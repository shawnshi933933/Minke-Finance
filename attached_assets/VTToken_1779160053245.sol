// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IVTToken} from "../interfaces/IVTToken.sol";

/// @title VTToken
/// @notice Minimal ERC20 for vesting representation. Each Tranche has its own clone.
///         Only Vault can mint; only BuybackPool can burn. Hardcoded permissions.
/// @dev    For EIP-1167 clone pattern, name/symbol are stored in state and returned
///         via overridden view functions, since ERC20's constructor sets them once.
contract VTToken is IVTToken, ERC20 {
    // ─── Custom Errors ─────────────────────────────────────────────────────────
    error VTToken__ZeroAddress();
    error VTToken__Unauthorized();
    error VTToken__AlreadyInitialized();

    // ─── Events ────────────────────────────────────────────────────────────────
    /// @notice Emitted when the VTToken is initialized
    event VTTokenInitialized(
        address indexed vault,
        address indexed buybackPool,
        uint256 indexed trancheId
    );

    // ─── State ─────────────────────────────────────────────────────────────────
    string private _name;
    string private _symbol;

    /// @inheritdoc IVTToken
    address public vault;

    /// @inheritdoc IVTToken
    address public buybackPool;

    /// @inheritdoc IVTToken
    uint256 public trancheId;

    /// @inheritdoc IVTToken
    address public projectToken;

    /// @inheritdoc IVTToken
    address public projectOwner;

    // ─── Constructor ───────────────────────────────────────────────────────────
    /// @dev Pass empty strings; actual name/symbol set in initialize via overrides
    constructor() ERC20("", "") {
        // Non-proxy clone: no owner needed, permissions hardcoded
    }

    // ─── Initializer ───────────────────────────────────────────────────────────
    /// @inheritdoc IVTToken
    function initialize(
        string calldata _nameArg,
        string calldata _symbolArg,
        address _vault,
        address _buybackPool,
        address _projectToken,
        address _projectOwner,
        uint256 _trancheId
    ) external override {
        if (vault != address(0)) revert VTToken__AlreadyInitialized();

        if (
            _vault == address(0) ||
            _buybackPool == address(0) ||
            _projectToken == address(0) ||
            _projectOwner == address(0)
        ) {
            revert VTToken__ZeroAddress();
        }

        _name = _nameArg;
        _symbol = _symbolArg;
        vault = _vault;
        buybackPool = _buybackPool;
        projectToken = _projectToken;
        projectOwner = _projectOwner;
        trancheId = _trancheId;

        emit VTTokenInitialized(_vault, _buybackPool, _trancheId);
    }

    // ─── ERC20 Overrides ──────────────────────────────────────────────────────
    /// @notice Returns the token name (set per-clone via initialize)
    function name() public view override(ERC20, IVTToken) returns (string memory) {
        return _name;
    }

    /// @notice Returns the token symbol (set per-clone via initialize)
    function symbol() public view override(ERC20, IVTToken) returns (string memory) {
        return _symbol;
    }

    // ─── Mint & Burn ──────────────────────────────────────────────────────────
    /// @inheritdoc IVTToken
    function mint(address _to, uint256 _amount) external override {
        if (msg.sender != vault) revert VTToken__Unauthorized();
        _mint(_to, _amount);
    }

    /// @inheritdoc IVTToken
    function burn(address _from, uint256 _amount) external override {
        if (msg.sender != buybackPool) revert VTToken__Unauthorized();
        _burn(_from, _amount);
    }

}