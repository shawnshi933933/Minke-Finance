// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {IERC1155NFT} from "../interfaces/IERC1155NFT.sol";

/// @title ERC1155NFT
/// @notice ERC1155 collection per Vesting Suite. tokenId = trancheId (fungible).
///         NFTs are transferable; only Vault can redeem for VT.
contract ERC1155NFT is IERC1155NFT, ERC1155, Ownable2Step {

    // ─── Custom Errors ─────────────────────────────────────────────────────
    error ERC1155NFT__ZeroAddress();
    error ERC1155NFT__ZeroAmount();
    error ERC1155NFT__LengthMismatch();
    error ERC1155NFT__AlreadyInitialized();

    // ─── Events ────────────────────────────────────────────────────────────
    event URIUpdated(string oldURI, string newURI);

    // ─── State ─────────────────────────────────────────────────────────────
    address public override vault;
    string private _baseURI;

    // ─── Constructor ───────────────────────────────────────────────────────
    /// @dev Pass empty uri and dummy address; actual values set in initialize
    constructor(string memory, address _owner) ERC1155("") Ownable(_owner) {
        // Non-proxy clone: use onlyOwner instead of Initializable
    }

    // ─── Initializer ───────────────────────────────────────────────────────
    /// @dev No onlyOwner: clone has no owner, so anyone can initialize.
    ///      VestingFactory calls this atomically after clone(), so it's safe.
    function initialize(
        address _vault,
        address _projectOwner,
        string calldata baseURI_
    ) external override {
        if (vault != address(0)) revert ERC1155NFT__AlreadyInitialized();

        if (_vault == address(0) || _projectOwner == address(0)) {
            revert ERC1155NFT__ZeroAddress();
        }

        vault = _vault;
        _transferOwnership(_projectOwner);
        _baseURI = baseURI_;
    }

    // ─── Mint Functions ────────────────────────────────────────────────────
    function mint(
        address to,
        uint256 id,
        uint256 amount
    ) external override onlyOwner {
        if (to == address(0)) revert ERC1155NFT__ZeroAddress();
        if (amount == 0) revert ERC1155NFT__ZeroAmount();

        _mint(to, id, amount, "");
    }

    function batchMint(
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts
    ) external override onlyOwner {
        if (to == address(0)) revert ERC1155NFT__ZeroAddress();
        if (ids.length != amounts.length) revert ERC1155NFT__LengthMismatch();

        _mintBatch(to, ids, amounts, "");
    }

    // ─── Batch Deposit to Vault ───────────────────────────────────────────
    function batchDepositToVault(
        uint256[] calldata trancheIds,
        uint256[] calldata amounts
    ) external override {
        if (trancheIds.length != amounts.length) revert ERC1155NFT__LengthMismatch();
        if (vault == address(0)) revert ERC1155NFT__ZeroAddress();

        safeBatchTransferFrom(msg.sender, vault, trancheIds, amounts, "");
    }

    // ─── URI ───────────────────────────────────────────────────────────────
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string.concat(_baseURI, Strings.toString(tokenId), ".json");
    }

    function baseURI() external view override returns (string memory) {
        return _baseURI;
    }

    function setURI(string calldata newURI) external override onlyOwner {
        string memory oldURI = _baseURI;
        _baseURI = newURI;
        emit URIUpdated(oldURI, newURI);
    }

    // ─── projectOwner alias ────────────────────────────────────────────────
    function projectOwner() external view override returns (address) {
        return owner();
    }

}