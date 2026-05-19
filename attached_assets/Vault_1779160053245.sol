// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

import {IVault} from "../interfaces/IVault.sol";
import {IVestingFactory} from "../interfaces/IVestingFactory.sol";
import {IVTToken} from "../interfaces/IVTToken.sol";
import {IBuybackPool} from "../interfaces/IBuybackPool.sol";
import {Clones} from "../libraries/Clones.sol";

/// @title Vault
/// @notice Project-level container. Clone-deployed by VestingFactory.
///         Manages Tranche lifecycles (VT Token + BuybackPool), NFT staking,
///         and fixed VT minting per NFT. Also holds project T tokens and
///         approves BuybackPools to pull T.
contract Vault is IVault, Ownable2Step, Pausable, ReentrancyGuard, IERC1155Receiver {
    using SafeERC20 for IERC20;

    // ─── Custom Errors ──────────────────────────────────────────────────────
    error Vault__ZeroAddress();
    error Vault__AlreadyInitialized();
    error Vault__TrancheNotFound();
    error Vault__TrancheAlreadyExists();
    error Vault__ScheduleInvalid();
    error Vault__ZeroAmount();
    error Vault__InsufficientVTBalance();
    error Vault__InsufficientNFTBalance();
    error Vault__NotProjectOwner();

    // ─── Events (defined in IVault.sol to avoid duplication) ───────────────

    // ─── State: Basic Info ──────────────────────────────────────────────────
    address public factory;
    address public erc1155;
    address public projectToken;
    address public projectOwner;
    string public suiteName;

    // ─── State: Tranche Index ───────────────────────────────────────────────
    uint256 public trancheCount;

    // ─── State: Tranche Data ────────────────────────────────────────────────
    mapping(uint256 => VestingSchedule) public schedules;
    mapping(uint256 => uint256) public vtPerNft;
    mapping(uint256 => address) public vtTokens;
    mapping(uint256 => address) public buybackPools;
    mapping(uint256 => bool) public trancheExists;
    mapping(address => mapping(uint256 => uint256)) public vtMinted;
    mapping(uint256 => uint256) public totalVTMinted;

    // ─── State: Pool Approvals ──────────────────────────────────────────────
    /// @dev Last approved amount for each BP (snapshot, not current allowance)
    mapping(uint256 => uint256) public lastApprovedAmount;

    // ─── Constructor ────────────────────────────────────────────────────────
    constructor(address _owner) Ownable(_owner) {
        // Non-proxy clone: use onlyOwner instead of Initializable
    }

    // ─── Initializer ────────────────────────────────────────────────────────
    function initialize(
        address _factory,
        address _erc1155,
        address _projectToken,
        address _projectOwner,
        string calldata _suiteName
    ) external override {
        if (factory != address(0)) revert Vault__AlreadyInitialized();

        if (
            _factory == address(0) ||
            _erc1155 == address(0) ||
            _projectToken == address(0) ||
            _projectOwner == address(0)
        ) {
            revert Vault__ZeroAddress();
        }

        factory = _factory;
        erc1155 = _erc1155;
        projectToken = _projectToken;
        projectOwner = _projectOwner;
        suiteName = _suiteName;

        // Sync OZ Ownable owner with projectOwner so pause/unpause work on clones
        _transferOwnership(_projectOwner);
    }

    // ─── Modifiers ─────────────────────────────────────────────────────────
    modifier onlyProjectOwner() {
        if (msg.sender != projectOwner) revert Vault__NotProjectOwner();
        _;
    }

    // ─── Core: Create Tranche ───────────────────────────────────────────────
    function createNewTranche(
        uint256 _trancheId,
        VestingSchedule calldata _schedule,
        uint256 _vtPerNft
    )
        external
        override
        onlyProjectOwner
        whenNotPaused
        returns (address vtToken, address buybackPool)
    {
        if (trancheExists[_trancheId]) revert Vault__TrancheAlreadyExists();
        if (_vtPerNft == 0) revert Vault__ZeroAmount();
        if (_schedule.totalAmount == 0) revert Vault__ScheduleInvalid();

        // 1. Clone VT Token
        bytes32 vtSalt = keccak256(abi.encode(address(this), _trancheId, "vt"));
        vtToken = Clones.cloneDeterministic(
            IVestingFactory(factory).getVtTokenImpl(),
            vtSalt
        );

        // 2. Clone BuybackPool
        bytes32 bpSalt = keccak256(abi.encode(address(this), _trancheId, "bp"));
        buybackPool = Clones.cloneDeterministic(
            IVestingFactory(factory).getBuybackPoolImpl(),
            bpSalt
        );

        // 3. Initialize BuybackPool
        // releaseStartTime = schedule.startTime + schedule.cliff (cliff end timestamp)
        uint48 releaseStartTime = _schedule.startTime + _schedule.cliff;
        IBuybackPool(buybackPool).initialize(
            projectOwner,                       // _owner: BP admin (can call manualRelease/setReleaseConfig)
            vtToken,                           // _vtToken
            projectToken,                       // _tToken
            address(this),                     // _vault
            950,                               // _userRewardRate: 95% to users
            releaseStartTime,                  // _releaseStartTime
            0,                                 // _releaseInterval: 0 = no cooldown initially
            0                                  // _releaseBatchSize: 0 = pull all available
        );

        // 4. Initialize VT Token
        IVTToken(vtToken).initialize(
            string.concat("Vesting Token-", _toString(_trancheId)),
            string.concat("VT-", _toString(_trancheId)),
            address(this),
            buybackPool,
            projectToken,
            projectOwner,
            _trancheId
        );

        // 5. Record state
        schedules[_trancheId] = _schedule;
        vtPerNft[_trancheId] = _vtPerNft;
        vtTokens[_trancheId] = vtToken;
        buybackPools[_trancheId] = buybackPool;
        trancheExists[_trancheId] = true;
        trancheCount++;

        emit TrancheCreated(_trancheId, vtToken, buybackPool);

        return (vtToken, buybackPool);
    }

    // ─── Core: Stake NFT ───────────────────────────────────────────────────
    function stakeNFT(uint256 _trancheId, uint256 _amount) external override nonReentrant {
        if (!trancheExists[_trancheId]) revert Vault__TrancheNotFound();
        if (_amount == 0) revert Vault__ZeroAmount();

        if (IERC1155(erc1155).balanceOf(msg.sender, _trancheId) < _amount) {
            revert Vault__InsufficientNFTBalance();
        }

        IERC1155(erc1155).safeTransferFrom(
            msg.sender,
            address(this),
            _trancheId,
            _amount,
            ""
        );

        uint256 vtPerNftAmount = vtPerNft[_trancheId];
        if (vtPerNftAmount == 0) revert Vault__ScheduleInvalid();

        uint256 vtAmount = _amount * vtPerNftAmount;
        if (vtAmount == 0) revert Vault__ZeroAmount();

        IVTToken(vtTokens[_trancheId]).mint(msg.sender, vtAmount);

        vtMinted[msg.sender][_trancheId] += vtAmount;
        totalVTMinted[_trancheId] += vtAmount;

        emit VTMinted(msg.sender, _trancheId, vtAmount);
    }

    // ─── Token Management ───────────────────────────────────────────────────

    function depositTokens(uint256 _amount) external override onlyProjectOwner whenNotPaused {
        if (_amount == 0) revert Vault__ZeroAmount();

        IERC20(projectToken).safeTransferFrom(msg.sender, address(this), _amount);

        emit TokensDeposited(msg.sender, _amount);
    }

    function withdrawTokens(address _to, uint256 _amount)
        external
        override
        onlyProjectOwner
        nonReentrant
    {
        if (_to == address(0)) revert Vault__ZeroAddress();
        if (_amount == 0) revert Vault__ZeroAmount();

        IERC20(projectToken).safeTransfer(_to, _amount);

        emit TokensWithdrawn(_to, _amount);
    }

    /**
     * @notice Approve a BuybackPool to pull T from this Vault
     * @dev Caller should also increase allowance via this function
     * @param _trancheId Tranche ID (identifies the BP)
     * @param _amount    Amount of T to approve
     */
    function approvePool(uint256 _trancheId, uint256 _amount)
        external
        override
        onlyProjectOwner
        nonReentrant
    {
        if (!trancheExists[_trancheId]) revert Vault__TrancheNotFound();
        if (_amount == 0) revert Vault__ZeroAmount();

        address bp = buybackPools[_trancheId];

        // Reset to 0 first, then set new amount
        // Use plain approve to avoid safeDecreaseAllowance checking BP's token balance
        uint256 oldAllowance = lastApprovedAmount[_trancheId];
        if (oldAllowance > 0) {
            IERC20(projectToken).approve(bp, 0);
        }
        IERC20(projectToken).approve(bp, _amount);
        lastApprovedAmount[_trancheId] = _amount;

        emit PoolApproved(_trancheId, bp, _amount);
    }

    /**
     * @notice Approve a BuybackPool with unlimited T allowance
     * @param _trancheId Tranche ID (identifies the BP)
     */
    function unlimitedApprovePool(uint256 _trancheId)
        external
        override
        onlyProjectOwner
        nonReentrant
    {
        if (!trancheExists[_trancheId]) revert Vault__TrancheNotFound();

        address bp = buybackPools[_trancheId];

        // Directly set unlimited — plain approve works for unlimited
        IERC20(projectToken).approve(bp, type(uint256).max);
        lastApprovedAmount[_trancheId] = type(uint256).max;

        emit PoolApproved(_trancheId, bp, type(uint256).max);
    }

    // ─── String Helpers ─────────────────────────────────────────────────────
    function _toString(uint256 _value) private pure returns (string memory) {
        if (_value == 0) return "0";
        uint256 temp = _value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (_value != 0) {
            digits -= 1;
            // forge-lint: disable-next-line(unsafe-typecast)
            buffer[digits] = bytes1(uint8(48 + uint256(_value % 10)));
            _value /= 10;
        }
        return string(buffer);
    }

    // ─── ERC1155 Receiver ──────────────────────────────────────────────────
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC1155Receiver.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId
            || interfaceId == type(IERC1155).interfaceId;
    }

}
