// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {IVestingFactory} from "../interfaces/IVestingFactory.sol";
import {IVault} from "../interfaces/IVault.sol";
import {IERC1155NFT} from "../interfaces/IERC1155NFT.sol";
import {Clones} from "../libraries/Clones.sol";

/// @title VestingFactory
/// @notice Global singleton entry point. Clone-deploys Vesting Suites (Vault + ERC1155).
///         Template addresses are admin-configurable via setXXXImpl().
///         Both Vault and ERC1155 are deployed via CREATE2 for deterministic addresses.
contract VestingFactory is
    IVestingFactory,
    Ownable2Step,
    Pausable,
    ReentrancyGuard
{
    // ─── Custom Errors ─────────────────────────────────────────────────────────
    error VestingFactory__ZeroAddress();
    error VestingFactory__SameAddress();
    error VestingFactory__AlreadyInitialized();
    error VestingFactory__ZeroSuiteName();
    error VestingFactory__IndexOutOfBounds();

    // ─── Events ───────────────────────────────────────────────────────────────
    /// @notice Emitted when the factory is initialized
    event VestingFactoryInitialized(
        address vaultImpl,
        address erc1155Impl,
        address buybackPoolImpl,
        address vtTokenImpl
    );
    // Note: VestingSuiteCreated and ImplementationUpdated are defined in IVestingFactory

    // ─── Templates ─────────────────────────────────────────────────────────────
    address public vaultImpl;
    address public erc1155Impl;
    address public buybackPoolImpl;
    address public vtTokenImpl;

    // ─── Suite Index ──────────────────────────────────────────────────────────
    address[] public allSuites;
    mapping(address => address[]) public suitesByOwner;

    /// @notice Quick lookup for vault existence (O(1) vs O(n) loop)
    mapping(address => bool) public isSuite;

    /// @notice Per-projectOwner nonce for CREATE2 salt
    mapping(address => uint256) public nonceByOwner;

    // ─── Constructor ──────────────────────────────────────────────────────────
    /// @dev Pass deployer as owner; initialize sets template implementations
    constructor(address _owner) Ownable(_owner) {
        // No _disableInitializers() - we use onlyOwner for initialize instead
        // to work with OZ 5.x Initializable pattern
    }

    // ─── Initializer ─────────────────────────────────────────────────────────
    /// @notice Initialize the factory with template implementations
    /// @dev Can only be called by owner, and only once (checked via vaultImpl == 0)
    function initialize(
        address _vaultImpl,
        address _erc1155Impl,
        address _buybackPoolImpl,
        address _vtTokenImpl
    ) external onlyOwner {
        if (vaultImpl != address(0)) revert VestingFactory__AlreadyInitialized();
        if (_vaultImpl == address(0) || _erc1155Impl == address(0) || _buybackPoolImpl == address(0) || _vtTokenImpl == address(0)) {
            revert VestingFactory__ZeroAddress();
        }

        vaultImpl = _vaultImpl;
        erc1155Impl = _erc1155Impl;
        buybackPoolImpl = _buybackPoolImpl;
        vtTokenImpl = _vtTokenImpl;

        emit VestingFactoryInitialized(_vaultImpl, _erc1155Impl, _buybackPoolImpl, _vtTokenImpl);
    }

    // ─── Core: Create Suite ───────────────────────────────────────────────────
    /// @inheritdoc IVestingFactory
    function createVestingSuite(
        address _projectToken,
        string calldata _suiteName
    ) external override whenNotPaused nonReentrant returns (address vault, address erc1155) {
        if (_projectToken == address(0)) revert VestingFactory__ZeroAddress();
        if (bytes(_suiteName).length == 0) revert VestingFactory__ZeroSuiteName();

        // Increment nonce first to prevent reentrancy
        uint256 nonce = ++nonceByOwner[_msgSender()];

        // Vault: CREATE2 salt
        bytes32 vaultSalt = keccak256(abi.encode(_msgSender(), _projectToken, _suiteName, nonce));
        vault = Clones.cloneDeterministic(vaultImpl, vaultSalt);

        // ERC1155: CREATE2 salt
        bytes32 erc1155Salt = keccak256(
            abi.encode(_msgSender(), _projectToken, _suiteName, nonce, "erc1155")
        );
        erc1155 = Clones.cloneDeterministic(erc1155Impl, erc1155Salt);

        // Mark as registered
        isSuite[vault] = true;

        // Initialize Vault (passes factory address so Vault can query buybackPoolImpl dynamically)
        IVault(vault).initialize(
            address(this), // → slot 2: factory
            erc1155,        // → slot 3: erc1155
            _projectToken,
            _msgSender(),
            _suiteName
        );

        // Initialize ERC1155 (vault = this vault clone, owner = projectOwner)
        IERC1155NFT(erc1155).initialize(
            vault,           // _vault
            _msgSender(),    // _projectOwner
            ""               // baseURI
        );

        // Record index
        allSuites.push(vault);
        suitesByOwner[_msgSender()].push(vault);

        emit VestingSuiteCreated(_msgSender(), vault, erc1155, _projectToken, _suiteName);

        return (vault, erc1155);
    }

    // ─── View: Getters ────────────────────────────────────────────────────────
    /// @inheritdoc IVestingFactory
    function getVaultImpl() external view override returns (address) {
        return vaultImpl;
    }

    /// @inheritdoc IVestingFactory
    function getERC1155Impl() external view override returns (address) {
        return erc1155Impl;
    }

    /// @inheritdoc IVestingFactory
    function getBuybackPoolImpl() external view override returns (address) {
        return buybackPoolImpl;
    }

    /// @inheritdoc IVestingFactory
    function getVtTokenImpl() external view override returns (address) {
        return vtTokenImpl;
    }

    /// @inheritdoc IVestingFactory
    function getSuiteCount() external view override returns (uint256) {
        return allSuites.length;
    }

    /// @inheritdoc IVestingFactory
    function getSuiteAt(uint256 _index) external view override returns (address) {
        if (_index >= allSuites.length) revert VestingFactory__IndexOutOfBounds();
        return allSuites[_index];
    }

    /// @inheritdoc IVestingFactory
    function getSuitesByOwner(address _owner) external view override returns (address[] memory) {
        return suitesByOwner[_owner];
    }

    /// @inheritdoc IVestingFactory
    function suiteExists(address _vault) external view override returns (bool) {
        return isSuite[_vault];
    }

    // ─── Admin: Update Templates ────────────────────────────────────────────────
    /// @inheritdoc IVestingFactory
    function setVaultImpl(address _newImpl) external override onlyOwner {
        _updateImpl(_newImpl, vaultImpl, "vault");
        vaultImpl = _newImpl;
    }

    /// @inheritdoc IVestingFactory
    function setERC1155Impl(address _newImpl) external override onlyOwner {
        _updateImpl(_newImpl, erc1155Impl, "erc1155");
        erc1155Impl = _newImpl;
    }

    /// @inheritdoc IVestingFactory
    function setBuybackPoolImpl(address _newImpl) external override onlyOwner {
        _updateImpl(_newImpl, buybackPoolImpl, "buybackPool");
        buybackPoolImpl = _newImpl;
    }

    /// @inheritdoc IVestingFactory
    function setVtTokenImpl(address _newImpl) external override onlyOwner {
        _updateImpl(_newImpl, vtTokenImpl, "vtToken");
        vtTokenImpl = _newImpl;
    }

    // ─── Admin: Pause ──────────────────────────────────────────────────────────
    /// @inheritdoc IVestingFactory
    function pause() external override onlyOwner {
        _pause();
    }

    /// @inheritdoc IVestingFactory
    function unpause() external override onlyOwner {
        _unpause();
    }

    // ─── Internal ──────────────────────────────────────────────────────────────
    function _updateImpl(
        address _newImpl,
        address _currentImpl,
        string memory _contractType
    ) private {
        if (_newImpl == address(0)) revert VestingFactory__ZeroAddress();
        if (_newImpl == _currentImpl) revert VestingFactory__SameAddress();
        emit ImplementationUpdated(_contractType, _currentImpl, _newImpl);
    }

    // ─── Reserved slots ─────────────────────────────────────────────────────────
    uint256[50] private __gap;
}
