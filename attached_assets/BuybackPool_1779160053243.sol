// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IBuybackPool} from "../interfaces/IBuybackPool.sol";
import {IVault} from "../interfaces/IVault.sol";
import {IVTToken} from "../interfaces/IVTToken.sol";

/**
 * @title BuybackPool
 * @notice Pool for gradual T release against staked VT
 *
 * @dev Mechanism:
 * - 1 VT : 1 T (future release)
 * - Users stake VT to get shares (1:1 at current share value)
 * - BP pulls T from Vault automatically based on release schedule
 * - When T is pulled, equivalent VT is burned 1:1
 * - Users' claimable T increases proportionally (minus fee)
 * - Share value = totalStakedVT / totalShares (decreases over time due to burn)
 * - Dust protection: at least 1 VT must remain after burn
 *
 * @dev Release Schedule:
 * - releaseStartTime: earliest timestamp to start pulling (cliff end)
 * - releaseInterval: minimum seconds between pulls, 0 = unlimited
 * - releaseBatchSize: max T per pull, 0 = pull all available
 * - Vault must approve BP via Vault.approvePool() before pulling
 *
 * Example (5% fee = 95% to users):
 * Day 1: TotalStakedVT=50, User stakes 5 VT -> 5 shares
 *        Pull 10 T -> Burn 10 VT -> ShareValue = 40/50 = 0.8 VT/share
 *        User pendingT += 10 * (5/50) * 0.95 = 0.95 T
 */
contract BuybackPool is IBuybackPool, Ownable2Step, Pausable, ReentrancyGuard {
    /// @dev Pass dummy address; actual owner set in initialize
    constructor(address _owner) Ownable(_owner) {}

    using SafeERC20 for IERC20;

    string public constant VERSION = "BuybackPool v2.0";

    // ─── Constants ──────────────────────────────────────────────────────────

    uint256 public constant PRECISION = 1e18;
    uint256 public constant BASIS_POINTS = 1000;
    uint256 public constant DEFAULT_DUST_PROTECTION = 1e18;

    // ─── Token Contracts ───────────────────────────────────────────────────

    IERC20 public vtToken;
    IERC20 public tToken;
    IVault public vault;

    // ─── Fee Config ────────────────────────────────────────────────────────

    /// @dev userRewardRate in basis points: 950 = 95% to users, 5% protocol fee
    uint256 public userRewardRate;

    // ─── Share Tracking ─────────────────────────────────────────────────────

    uint256 public totalShares;
    uint256 public totalStakedVT;

    /// @dev Accumulated VT burned per share (PRECISION decimals)
    uint256 public accVTPerShare;

    mapping(address => UserInfo) public userInfo;

    // ─── Vesting End Flag ───────────────────────────────────────────────────

    bool public vestingEnded;

    // ─── Release Schedule ───────────────────────────────────────────────────

    /// @dev Earliest timestamp to start pulling T (cliff end)
    uint48 public releaseStartTime;

    /// @dev Minimum seconds between pulls, 0 = unlimited
    uint32 public releaseInterval;

    /// @dev Max T per pull, 0 = pull all available
    uint256 public releaseBatchSize;

    /// @dev Last timestamp when T was pulled
    uint256 public lastReleaseTime;

    /// @dev Total T pulled from Vault so far
    uint256 public releasedAmount;

    /// @dev Cumulative VT burned (for auditability: totalSupply + totalVTBurned = historical total minted)
    uint256 public totalVTBurned;

    /// @dev Excess T from pulls that exceeded burnable VT, reserved for Phase 2 redeem
    uint256 public excessT;

    // ─── Dust Protection ───────────────────────────────────────────────────

    uint256 public dustProtection;

    // ─── Custom Errors ──────────────────────────────────────────────────────

    error BuybackPool__AlreadyInitialized();
    error BuybackPool__NoStakedVT();
    error BuybackPool__NotStarted();
    error BuybackPool__InCooldown();
    error BuybackPool__InsufficientVaultBalance();
    error BuybackPool__NothingToPull();
    error BuybackPool__ZeroAmount();
    error BuybackPool__VestingEnded();

    // ─── Initialize ─────────────────────────────────────────────────────────

    function initialize(
        address _owner,
        address _vtToken,
        address _tToken,
        address _vault,
        uint256 _userRewardRate,
        uint48 _releaseStartTime,
        uint32 _releaseInterval,
        uint256 _releaseBatchSize
    ) external {
        if (address(vtToken) != address(0)) revert BuybackPool__AlreadyInitialized();

        // Set owner (overwrites EIP-1167 clone's inherited owner = address(0))
        _transferOwnership(_owner);

        require(_vtToken != address(0), "Invalid VT token");
        require(_tToken != address(0), "Invalid T token");
        require(_vault != address(0), "Invalid vault");
        require(_userRewardRate <= BASIS_POINTS, "Reward rate > 1000");

        vtToken = IERC20(_vtToken);
        tToken = IERC20(_tToken);
        vault = IVault(_vault);
        userRewardRate = _userRewardRate;

        releaseStartTime = _releaseStartTime;
        releaseInterval = _releaseInterval;
        releaseBatchSize = _releaseBatchSize;
        lastReleaseTime = 0;
        releasedAmount = 0;
        excessT = 0;

        dustProtection = DEFAULT_DUST_PROTECTION;
        totalShares = 0;
        totalStakedVT = 0;
        accVTPerShare = 0;
        vestingEnded = false;
    }

    // ─── Core: User Actions ─────────────────────────────────────────────────

    function stakeVT(uint256 _amount) external nonReentrant whenNotPaused {
        require(_amount > 0, "Cannot stake 0");
        require(!vestingEnded, "Vesting ended, use redeemVT");

        UserInfo storage user = userInfo[msg.sender];

        // Trigger pull BEFORE updating state (lazy pull)
        // Pull first to accrue latest T rewards, then settle claimable with updated accVTPerShare
        _tryPullFromVault();

        // Issue new shares
        uint256 sharesToIssue = _computeShares(_amount);

        // Transfer VT from user
        vtToken.safeTransferFrom(msg.sender, address(this), _amount);

        // Settle pending claimable BEFORE adding new stake
        if (user.shares > 0) {
            _settleClaimable(msg.sender);
        }

        // Update user state
        user.shares += sharesToIssue;
        user.paidAccVTPerShare = accVTPerShare;

        // Update pool state
        totalShares += sharesToIssue;
        totalStakedVT += _amount;

        emit Staked(msg.sender, _amount, sharesToIssue);
    }

    function withdrawVT(uint256 _shares) external nonReentrant whenNotPaused {
        require(_shares > 0, "Cannot withdraw 0");

        UserInfo storage user = userInfo[msg.sender];
        require(user.shares >= _shares, "Insufficient shares");

        uint256 shareValue = getShareValueVT();
        uint256 vtToReturn = (_shares * shareValue) / PRECISION;

        // Dust protection
        if (totalStakedVT - vtToReturn < dustProtection) {
            vtToReturn = totalStakedVT - dustProtection;
            _shares = (vtToReturn * PRECISION) / shareValue;
            require(_shares > 0, "Cannot withdraw due to dust");
        }

        // Settle pending claimable
        _settleClaimable(msg.sender);

        // Update user state
        user.shares -= _shares;
        user.paidAccVTPerShare = accVTPerShare;

        // Update pool state
        totalShares -= _shares;
        totalStakedVT -= vtToReturn;

        // Transfer VT back
        vtToken.safeTransfer(msg.sender, vtToReturn);

        emit Withdrawn(msg.sender, _shares, vtToReturn);
    }

    function claimT() external nonReentrant whenNotPaused {
        // Trigger pull BEFORE settling
        _tryPullFromVault();

        _settleClaimable(msg.sender);

        UserInfo storage user = userInfo[msg.sender];
        uint256 claimable = user.claimableT;
        require(claimable > 0, "Nothing to claim");

        user.claimableT = 0;
        tToken.safeTransfer(msg.sender, claimable);

        emit Claimed(msg.sender, claimable);
    }

    function redeemVT(uint256 _vtAmount) external nonReentrant whenNotPaused {
        require(vestingEnded, "Vesting not ended yet");
        require(_vtAmount > 0, "Cannot redeem 0");
        require(excessT >= _vtAmount, "Insufficient excess T in pool");

        // Burn VT from user's wallet 1:1, send T from excessT
        IVTToken(address(vtToken)).burn(msg.sender, _vtAmount);
        totalVTBurned += _vtAmount;
        excessT -= _vtAmount;
        tToken.safeTransfer(msg.sender, _vtAmount);

        emit Redeemed(msg.sender, _vtAmount);
    }

    // ─── Release Logic ──────────────────────────────────────────────────────

    /**
     * @notice Try to pull T from Vault based on release schedule
     * @dev Conditions:
     *      1. totalStakedVT > 0
     *      2. block.timestamp >= releaseStartTime
     *      3. block.timestamp >= lastReleaseTime + releaseInterval
     *      4. Vault T balance > 0 AND Vault has approved this BP
     * @dev If conditions met: pull min(batchSize, vaultBalance), burn VT, update accVTPerShare
     * @dev If vault balance insufficient: pull all available (partial pull, no revert)
     */
    function _tryPullFromVault() internal {
        // Phase 2: Pull disabled after vesting ends
        if (vestingEnded) return;

        // Condition 1: must have staked VT to burn
        if (totalStakedVT == 0) return;

        // Condition 2: must be past start time
        if (block.timestamp < releaseStartTime) return;

        // Condition 3: must respect cooldown interval
        if (releaseInterval > 0 && block.timestamp < lastReleaseTime + releaseInterval) {
            return;
        }

        // Condition 4: vault must have T and have approved this BP
        uint256 vaultBalance = tToken.balanceOf(address(vault));
        if (vaultBalance == 0) return;

        uint256 allowance = tToken.allowance(address(vault), address(this));
        if (allowance == 0) return;

        // Calculate pull amount from Vault
        uint256 pullAmount = releaseBatchSize == 0
            ? vaultBalance
            : (releaseBatchSize > vaultBalance ? vaultBalance : releaseBatchSize);
        if (pullAmount > allowance) {
            pullAmount = allowance;
        }
        if (pullAmount == 0) return;

        // Pull T from Vault to BP
        tToken.safeTransferFrom(address(vault), address(this), pullAmount);

        // Calculate how much VT can be burned
        // burnableVT = totalStakedVT - dustProtection (at least dustProtection must remain)
        uint256 burnableVT = totalStakedVT > dustProtection
            ? totalStakedVT - dustProtection
            : 0;

        // Total available = accumulated excessT + new pull
        uint256 totalAvailable = excessT + pullAmount;

        // Actual burn = min(totalAvailable, burnableVT)
        uint256 actualBurn = burnableVT > totalAvailable ? totalAvailable : burnableVT;

        // excessT accumulates any T that couldn't be burned (excess over burnableVT)
        excessT = totalAvailable - actualBurn;

        if (actualBurn > 0) {
            accVTPerShare += (actualBurn * PRECISION) / totalShares;
            totalStakedVT -= actualBurn;
            IVTToken(address(vtToken)).burn(address(this), actualBurn);
            totalVTBurned += actualBurn;
            releasedAmount += actualBurn;
        }

        lastReleaseTime = block.timestamp;

        emit TPulledFromVault(actualBurn, excessT, getShareValueVT(), tToken.balanceOf(address(this)));
    }

    // ─── Admin: Manual Release ───────────────────────────────────────────────

    /**
     * @notice Owner manually triggers T pull from Vault (skips cooldown interval)
     * @param _amount Amount of T to pull
     */
    function manualRelease(uint256 _amount) external onlyOwner nonReentrant whenNotPaused {
        require(!vestingEnded, "Vesting ended");
        require(_amount > 0, "Cannot release 0");

        uint256 vaultBalance = tToken.balanceOf(address(vault));
        require(vaultBalance > 0, "Vault has no T");

        uint256 allowance = tToken.allowance(address(vault), address(this));
        require(allowance > 0, "Vault has not approved BP");

        // Pull at most min(_amount, vaultBalance, allowance)
        uint256 pullAmount = _amount;
        if (pullAmount > vaultBalance) pullAmount = vaultBalance;
        if (pullAmount > allowance) pullAmount = allowance;
        if (pullAmount == 0) return;

        // Pull from vault
        tToken.safeTransferFrom(address(vault), address(this), pullAmount);

        // Calculate how much VT can be burned
        uint256 burnableVT = totalStakedVT > dustProtection
            ? totalStakedVT - dustProtection
            : 0;

        // Total available = accumulated excessT + new pull
        uint256 totalAvailable = excessT + pullAmount;

        // Actual burn = min(totalAvailable, burnableVT)
        uint256 actualBurn = burnableVT > totalAvailable ? totalAvailable : burnableVT;

        // excessT accumulates any T that couldn't be burned
        excessT = totalAvailable - actualBurn;

        if (actualBurn > 0) {
            accVTPerShare += (actualBurn * PRECISION) / totalShares;
            totalStakedVT -= actualBurn;
            IVTToken(address(vtToken)).burn(address(this), actualBurn);
            totalVTBurned += actualBurn;
            releasedAmount += actualBurn;
        }

        lastReleaseTime = block.timestamp;

        emit ManualRelease(msg.sender, pullAmount, actualBurn, excessT);
    }

    // ─── Admin: Config ─────────────────────────────────────────────────────

    function setReleaseConfig(
        uint48 _releaseStartTime,
        uint32 _releaseInterval,
        uint256 _releaseBatchSize
    ) external onlyOwner {
        releaseStartTime = _releaseStartTime;
        releaseInterval = _releaseInterval;
        releaseBatchSize = _releaseBatchSize;
        emit ReleaseConfigUpdated(_releaseStartTime, _releaseInterval, _releaseBatchSize);
    }

    function setUserRewardRate(uint256 _rate) external onlyOwner {
        require(_rate <= BASIS_POINTS, "Rate > 1000");
        emit UserRewardRateUpdated(userRewardRate, _rate);
        userRewardRate = _rate;
    }

    function setDustProtection(uint256 _dust) external onlyOwner {
        require(_dust >= DEFAULT_DUST_PROTECTION, "Dust < 1 token");
        require(_dust <= totalStakedVT, "Dust > staked");
        emit DustProtectionUpdated(dustProtection, _dust);
        dustProtection = _dust;
    }

    function endVesting() external onlyOwner {
        require(!vestingEnded, "Already ended");
        vestingEnded = true;
        emit VestingEnded();
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // ─── Internal: Settlement ──────────────────────────────────────────────

    /**
     * @notice Settle pending claimable T for a user
     * @dev Uses accVTPerShare - paidAccVTPerShare to calculate unclaimed VT burned
     *      Converted to claimable T at userRewardRate
     */
    function _settleClaimable(address _user) internal {
        UserInfo storage user = userInfo[_user];
        if (user.shares == 0) return;

        uint256 deltaAcc = accVTPerShare - user.paidAccVTPerShare;
        uint256 unclaimedVT = user.shares * deltaAcc / PRECISION;

        // Convert to claimable T (minus fee)
        uint256 pendingT = unclaimedVT * userRewardRate / BASIS_POINTS;
        user.claimableT += pendingT;

        user.paidAccVTPerShare = accVTPerShare;
    }

    /**
     * @notice Compute shares for a given VT amount
     */
    function _computeShares(uint256 _vtAmount) internal view returns (uint256) {
        if (totalShares == 0) {
            return _vtAmount; // First staker gets 1:1
        }
        return (_vtAmount * PRECISION) / getShareValueVT();
    }

    // ─── View Functions ────────────────────────────────────────────────────

    function getTotalStakedVT() external view returns (uint256) {
        return totalStakedVT;
    }

    function getTotalShares() external view returns (uint256) {
        return totalShares;
    }

    /**
     * @notice Current share value in VT
     */
    function getShareValueVT() public view returns (uint256) {
        if (totalShares == 0) return PRECISION; // 1:1 initially
        return (totalStakedVT * PRECISION) / totalShares;
    }

    /**
     * @notice Pending claimable T (not yet settled)
     */
    function getPendingClaimable(address _user) external view returns (uint256) {
        UserInfo memory user = userInfo[_user];
        if (user.shares == 0) return 0;

        uint256 deltaAcc = accVTPerShare - user.paidAccVTPerShare;
        uint256 unclaimedVT = user.shares * deltaAcc / PRECISION;
        return unclaimedVT * userRewardRate / BASIS_POINTS;
    }

    /**
     * @notice Total claimable T (pending + already accumulated)
     */
    function getClaimableT(address _user) external view returns (uint256) {
        UserInfo memory user = userInfo[_user];
        uint256 pending = 0;
        if (user.shares > 0) {
            uint256 deltaAcc = accVTPerShare - user.paidAccVTPerShare;
            uint256 unclaimedVT = user.shares * deltaAcc / PRECISION;
            pending = unclaimedVT * userRewardRate / BASIS_POINTS;
        }
        return user.claimableT + pending;
    }

    /**
     * @notice Withdrawable VT (if user burns all shares now)
     */
    function getWithdrawableVT(address _user) external view returns (uint256) {
        UserInfo memory user = userInfo[_user];
        if (user.shares == 0) return 0;

        uint256 vtValue = (user.shares * getShareValueVT()) / PRECISION;

        if (totalStakedVT - vtValue < dustProtection) {
            return totalStakedVT - dustProtection;
        }
        return vtValue;
    }

    /**
     * @notice Get current release schedule status
     */
    function getReleaseStatus() external view returns (
        uint48 startTime,
        uint32 interval,
        uint256 batchSize,
        uint256 lastTime,
        uint256 released,
        bool canPullNow
    ) {
        bool ready = totalStakedVT > 0
            && block.timestamp >= releaseStartTime
            && (releaseInterval == 0 || block.timestamp >= lastReleaseTime + releaseInterval);

        return (
            releaseStartTime,
            releaseInterval,
            releaseBatchSize,
            lastReleaseTime,
            releasedAmount,
            ready
        );
    }
}
