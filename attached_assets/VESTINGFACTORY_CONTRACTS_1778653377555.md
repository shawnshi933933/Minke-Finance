# VestingFactory — 合约完整说明文档

> 本文档供新项目快速了解 VestingFactory 合约体系，包含：架构设计、已部署地址、所有函数签名与 ABI、操作流程、数据结构、事件与错误码。

---

## 目录

1. [系统概述](#1-系统概述)
2. [架构设计](#2-架构设计)
3. [已部署地址（Sepolia 测试网）](#3-已部署地址sepolia-测试网)
4. [合约详解](#4-合约详解)
   - 4.1 VestingFactory
   - 4.2 Vault
   - 4.3 ERC1155NFT
   - 4.4 VTToken
   - 4.5 BuybackPool
5. [完整 ABI（前端直接可用）](#5-完整-abi前端直接可用)
6. [标准操作流程](#6-标准操作流程)
7. [归属机制详解](#7-归属机制详解)
8. [数据结构](#8-数据结构)
9. [事件清单](#9-事件清单)
10. [错误码清单](#10-错误码清单)
11. [前端接入配置](#11-前端接入配置)

---

## 1. 系统概述

VestingFactory 是一套基于 **EIP-1167 Clone 工厂模式** 的代币归属（Vesting）协议。项目方通过工厂合约部署"归属套件（Vesting Suite）"，为投资人发放 NFT 凭证，投资人质押 NFT 获得归属代币（VT），VT 随时间被回购池（BuybackPool）逐步转换为项目代币（T）。

### 核心特点

- **工厂模式**：所有套件通过 Clone 部署，Gas 成本极低（约为全部署的 1/10）
- **CREATE2**：Vault 和 ERC1155 地址可通过参数预计算，具有确定性
- **NFT 凭证**：ERC1155，tokenId = trancheId，可转让，支持二级市场流通
- **自动释放**：BuybackPool 在每次用户交互时自动从 Vault 拉取 T，无需链下触发
- **两阶段归属**：Phase 1 质押换 T；Phase 2 结束后剩余 VT 可 1:1 兑换 excess T

---

## 2. 架构设计

```
                    ┌──────────────────────────────────┐
                    │         VestingFactory           │
                    │  (单例，Sepolia 已部署)           │
                    │                                  │
                    │  vaultImpl ──────────────────►  Vault 实现合约
                    │  erc1155Impl ────────────────►  ERC1155NFT 实现合约
                    │  buybackPoolImpl ────────────►  BuybackPool 实现合约
                    │  vtTokenImpl ────────────────►  VTToken 实现合约
                    └───────────┬──────────────────────┘
                                │ createVestingSuite()
                                │ Clone × 2
                    ┌───────────▼──────────────────────┐
                    │    Vault Clone（项目金库）         │
                    │    + ERC1155NFT Clone（NFT）      │
                    └───────────┬──────────────────────┘
                                │ createNewTranche()
                                │ Clone × 2（每个 Tranche）
                    ┌───────────▼──────────────────────┐
                    │  VTToken Clone（归属代币）         │
                    │  + BuybackPool Clone（回购池）     │
                    └──────────────────────────────────┘

每个 Suite：1 个 Vault + 1 个 ERC1155NFT
每个 Tranche：1 个 VTToken + 1 个 BuybackPool
```

### 角色说明

| 角色 | 说明 |
|------|------|
| **项目方（projectOwner）** | 部署 Suite、创建 Tranche、存代币、铸造 NFT、配置 BP |
| **投资人（investor）** | 持有 NFT → 质押到 Vault 换 VT → 质押 VT 到 BP → 随时间 Claim T |
| **Factory Owner** | 可升级实现合约模板，暂停工厂 |

---

## 3. 已部署地址（Sepolia 测试网）

> Chain ID: **11155111**
> 
> 以下为**实现模板合约**地址，不可直接调用业务函数。每次 createSuite / createTranche 会通过 EIP-1167 Clone 部署独立实例。

| 合约 | 地址 | Etherscan |
|------|------|-----------|
| **VestingFactory** | `0xaEFE491fFbb56722FF96D6C51558Ab61a8c8D274` | [查看](https://sepolia.etherscan.io/address/0xaEFE491fFbb56722FF96D6C51558Ab61a8c8D274) |
| Vault 实现 | `0x0E6AdE46aB54817E01994CA80b77DE3Aa6321141` | [查看](https://sepolia.etherscan.io/address/0x0E6AdE46aB54817E01994CA80b77DE3Aa6321141) |
| ERC1155NFT 实现 | `0x1972E02083c1963c460758cD896F53F7B50df234` | [查看](https://sepolia.etherscan.io/address/0x1972E02083c1963c460758cD896F53F7B50df234) |
| VTToken 实现 | `0x9B4047936B70814B792f400be5ea96077b0199c4` | [查看](https://sepolia.etherscan.io/address/0x9B4047936B70814B792f400be5ea96077b0199c4) |
| BuybackPool 实现 | `0x1F122F703B833d310f8fF4Cb536ad1E5D461c0ac` | [查看](https://sepolia.etherscan.io/address/0x1F122F703B833d310f8fF4Cb536ad1E5D461c0ac) |

### 已部署的管理 dApp

- **地址**：https://vestingfactory.replit.app
- **用途**：项目方操作界面（Create Suite / Tranche / 配置 BP 等）
- **网络**：Sepolia，需 MetaMask 或兼容钱包

---

## 4. 合约详解

### 4.1 VestingFactory

**地址**：`0xaEFE491fFbb56722FF96D6C51558Ab61a8c8D274`

整个系统的单例入口。持有四个实现合约地址，通过 CREATE2 Clone 部署 Vault + ERC1155 对。

#### 主要函数

```solidity
// ── 创建 Suite（项目方调用）──────────────────────────────────────────
function createVestingSuite(
    address _projectToken,   // 项目 ERC20 代币地址（T）
    string calldata _suiteName  // Suite 名称，如 "ZooFin Vesting Suite"
) external returns (address vault, address erc1155)
// 权限：任何人
// 效果：Clone 部署 Vault + ERC1155，初始化，记录索引

// ── 查询 ──────────────────────────────────────────────────────────────
function getSuitesByOwner(address _owner) external view returns (address[] memory)
function getSuiteCount() external view returns (uint256)
function getSuiteAt(uint256 _index) external view returns (address)
function suiteExists(address _vault) external view returns (bool)
function isSuite(address) external view returns (bool)
function allSuites(uint256 index) external view returns (address)

// ── 实现合约地址查询 ────────────────────────────────────────────────
function getVaultImpl() external view returns (address)
function getERC1155Impl() external view returns (address)
function getBuybackPoolImpl() external view returns (address)
function getVtTokenImpl() external view returns (address)

// ── Admin（Factory Owner 专用）──────────────────────────────────────
function setVaultImpl(address _newImpl) external
function setERC1155Impl(address _newImpl) external
function setBuybackPoolImpl(address _newImpl) external
function setVtTokenImpl(address _newImpl) external
function pause() external
function unpause() external
```

---

### 4.2 Vault

**实现地址**：`0x0E6AdE46aB54817E01994CA80b77DE3Aa6321141`

每个 Suite 的核心合约。存储项目代币，管理 Tranche 生命周期，处理 NFT 质押与 VT 铸造。

#### 主要函数

```solidity
// ── 创建 Tranche（projectOwner 专用）───────────────────────────────
function createNewTranche(
    uint256 _trancheId,          // Tranche 编号（建议从 0 递增）
    VestingSchedule calldata _schedule,  // 归属计划（见数据结构章节）
    uint256 _vtPerNft            // 每个 NFT 对应多少 VT（含 18 位精度，如 50e18）
) external returns (address vtToken, address buybackPool)
// 权限：仅 projectOwner
// 效果：Clone VTToken + BuybackPool，初始化两者，记录 tranche 状态

// ── 代币管理（projectOwner 专用）───────────────────────────────────
function depositTokens(uint256 _amount) external
// 需要先 ERC20.approve(vault, amount)

function withdrawTokens(address _to, uint256 _amount) external

function approvePool(uint256 _trancheId, uint256 _amount) external
// 授权指定金额给 BuybackPool

function unlimitedApprovePool(uint256 _trancheId) external
// 授权 type(uint256).max 给 BuybackPool（推荐）

// ── 投资人操作 ──────────────────────────────────────────────────────
function stakeNFT(uint256 _trancheId, uint256 _amount) external
// 投资人将 NFT（ERC1155 tokenId = trancheId）质押到 Vault，铸造 VT
// 需要先 ERC1155.setApprovalForAll(vault, true)

// ── 查询 ────────────────────────────────────────────────────────────
function suiteName() external view returns (string memory)
function projectToken() external view returns (address)
function erc1155() external view returns (address)
function projectOwner() external view returns (address)
function trancheCount() external view returns (uint256)
function trancheExists(uint256 trancheId) external view returns (bool)
function vtTokens(uint256 trancheId) external view returns (address)
function buybackPools(uint256 trancheId) external view returns (address)
function vtPerNft(uint256 trancheId) external view returns (uint256)
function schedules(uint256 trancheId) external view returns (
    uint256 totalAmount, uint48 startTime, uint48 cliff, uint48 duration
)
function totalVTMinted(uint256 trancheId) external view returns (uint256)
function lastApprovedAmount(uint256 trancheId) external view returns (uint256)
```

---

### 4.3 ERC1155NFT

**实现地址**：`0x1972E02083c1963c460758cD896F53F7B50df234`

每个 Suite 一个 Clone。ERC1155 标准，tokenId = trancheId（同一 tranche 的 NFT 是同质化的）。

#### 主要函数

```solidity
// ── 铸造（projectOwner 专用）────────────────────────────────────────
function mint(address to, uint256 id, uint256 amount) external
// id = trancheId，amount = 发放给该投资人的 NFT 数量

function batchMint(address to, uint256[] calldata ids, uint256[] calldata amounts) external
// 批量铸造

// ── 投资人操作 ──────────────────────────────────────────────────────
function batchDepositToVault(
    uint256[] calldata trancheIds,
    uint256[] calldata amounts
) external
// 批量质押多个 Tranche 的 NFT 到 Vault

// ── 标准 ERC1155 函数（继承自 OpenZeppelin）────────────────────────
function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external
function safeBatchTransferFrom(address from, address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data) external
function setApprovalForAll(address operator, bool approved) external
function balanceOf(address account, uint256 id) external view returns (uint256)
function isApprovedForAll(address account, address operator) external view returns (bool)

// ── 元数据 ──────────────────────────────────────────────────────────
function uri(uint256 tokenId) external view returns (string memory)
// 返回 baseURI + tokenId + ".json"
function setURI(string calldata newURI) external  // onlyOwner

function vault() external view returns (address)
function projectOwner() external view returns (address)
```

---

### 4.4 VTToken

**实现地址**：`0x9B4047936B70814B792f400be5ea96077b0199c4`

每个 Tranche 一个 Clone 的 ERC20。命名格式 `Vesting Token-{id}` / `VT-{id}`。

- **只有 Vault** 可以 `mint()`
- **只有 BuybackPool** 可以 `burn()`

```solidity
// ── 标准 ERC20（继承自 OpenZeppelin）────────────────────────────────
function transfer(address to, uint256 amount) external returns (bool)
function approve(address spender, uint256 amount) external returns (bool)
function transferFrom(address from, address to, uint256 amount) external returns (bool)
function balanceOf(address account) external view returns (uint256)
function allowance(address owner, address spender) external view returns (uint256)
function totalSupply() external view returns (uint256)
function name() external view returns (string memory)
function symbol() external view returns (string memory)
function decimals() external view returns (uint8)  // 18

// ── 权限控制铸造/销毁 ────────────────────────────────────────────────
function mint(address _to, uint256 _amount) external  // 仅 vault
function burn(address _from, uint256 _amount) external  // 仅 buybackPool

// ── 查询 ────────────────────────────────────────────────────────────
function vault() external view returns (address)
function buybackPool() external view returns (address)
function trancheId() external view returns (uint256)
function projectToken() external view returns (address)
function projectOwner() external view returns (address)
```

---

### 4.5 BuybackPool

**实现地址**：`0x1F122F703B833d310f8fF4Cb536ad1E5D461c0ac`

每个 Tranche 一个 Clone。核心归属引擎。

#### 机制说明

```
投资人质押 VT → 获得份额（shares）
BP 从 Vault 拉 T → 等比例 burn VT → accVTPerShare 增加
用户 claimT → 按 (share × accVTPerShare) × 95% 计算可领 T
用户 withdrawVT → 按当前份额价值换回剩余 VT
```

Phase 2（`endVesting()` 后）：
```
剩余未质押的 VT → redeemVT() → 1:1 兑换 excessT
```

#### 主要函数

```solidity
// ── 投资人操作 ──────────────────────────────────────────────────────
function stakeVT(uint256 _amount) external
// 质押 VT，获得份额。需要先 VTToken.approve(bp, amount)
// 自动触发 _tryPullFromVault()

function withdrawVT(uint256 _shares) external
// 按份额赎回 VT（此时 VT 因 burn 已减少，赎回量 < 原始质押量）

function claimT() external
// 领取已累积的项目代币 T

function redeemVT(uint256 _vtAmount) external
// 仅 Phase 2（vestingEnded = true）：用 VT 1:1 兑换 excessT

// ── 项目方操作（onlyOwner = projectOwner）──────────────────────────
function setReleaseConfig(
    uint48 _releaseStartTime,   // 开始释放的时间戳（通常 = vesting startTime + cliff）
    uint32 _releaseInterval,    // 两次释放最小间隔（秒），0 = 无限制
    uint256 _releaseBatchSize   // 每次最多释放多少 T，0 = 全部释放
) external

function setUserRewardRate(uint256 _rate) external
// _rate 基点值（basis points），950 = 95% 归用户，50 = 5% 协议费
// 范围：0–1000

function setDustProtection(uint256 _dust) external
// 最低保留 VT 量，防止除零，默认 1e18（1 VT）

function manualRelease(uint256 _amount) external
// 手动触发 T 释放（跳过 interval 限制）

function endVesting() external
// 标记 Phase 2，禁止再拉 T，开启 redeemVT

function pause() / unpause() external

// ── 查询 ────────────────────────────────────────────────────────────
function vestingEnded() external view returns (bool)
function userRewardRate() external view returns (uint256)
function dustProtection() external view returns (uint256)
function getTotalStakedVT() external view returns (uint256)
function getTotalShares() external view returns (uint256)
function releasedAmount() external view returns (uint256)
function excessT() external view returns (uint256)
function getShareValueVT() external view returns (uint256)
// 当前每份额对应多少 VT（含 18 位精度）

function getClaimableT(address _user) external view returns (uint256)
// 用户可领取的 T 总量（含待结算部分）

function userInfo(address) external view returns (
    uint256 shares,
    uint256 claimableT,
    uint256 paidAccVTPerShare
)

function getReleaseStatus() external view returns (
    uint48 startTime,
    uint32 interval,
    uint256 batchSize,
    uint256 lastTime,
    uint256 released,
    bool canPullNow
)
```

---

## 5. 完整 ABI（前端直接可用）

以下为 TypeScript / viem / wagmi 格式，可直接粘贴使用。

### FACTORY_ABI

```typescript
export const FACTORY_ABI = [
  { name: 'createVestingSuite', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_projectToken', type: 'address' }, { name: '_suiteName', type: 'string' }],
    outputs: [{ name: 'vault', type: 'address' }, { name: 'erc1155', type: 'address' }] },
  { name: 'getSuitesByOwner', type: 'function', stateMutability: 'view',
    inputs: [{ name: '_owner', type: 'address' }], outputs: [{ type: 'address[]' }] },
  { name: 'allSuites', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }], outputs: [{ type: 'address' }] },
  { name: 'getSuiteCount', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'isSuite', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }], outputs: [{ type: 'bool' }] },
] as const
```

### VAULT_ABI

```typescript
export const VAULT_ABI = [
  { name: 'suiteName', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { name: 'projectToken', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
  { name: 'erc1155', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
  { name: 'projectOwner', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
  { name: 'trancheCount', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'trancheExists', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }], outputs: [{ type: 'bool' }] },
  { name: 'vtTokens', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }], outputs: [{ type: 'address' }] },
  { name: 'buybackPools', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }], outputs: [{ type: 'address' }] },
  { name: 'vtPerNft', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }], outputs: [{ type: 'uint256' }] },
  { name: 'schedules', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'totalAmount', type: 'uint256' },
      { name: 'startTime', type: 'uint48' },
      { name: 'cliff', type: 'uint48' },
      { name: 'duration', type: 'uint48' },
    ] },
  { name: 'totalVTMinted', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }], outputs: [{ type: 'uint256' }] },
  { name: 'lastApprovedAmount', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }], outputs: [{ type: 'uint256' }] },
  { name: 'createNewTranche', type: 'function', stateMutability: 'nonpayable',
    inputs: [
      { name: '_trancheId', type: 'uint256' },
      { name: '_schedule', type: 'tuple', components: [
        { name: 'totalAmount', type: 'uint256' },
        { name: 'startTime', type: 'uint48' },
        { name: 'cliff', type: 'uint48' },
        { name: 'duration', type: 'uint48' },
      ]},
      { name: '_vtPerNft', type: 'uint256' },
    ],
    outputs: [{ name: 'vtToken', type: 'address' }, { name: 'buybackPool', type: 'address' }] },
  { name: 'depositTokens', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_amount', type: 'uint256' }], outputs: [] },
  { name: 'approvePool', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_trancheId', type: 'uint256' }, { name: '_amount', type: 'uint256' }], outputs: [] },
  { name: 'unlimitedApprovePool', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_trancheId', type: 'uint256' }], outputs: [] },
  { name: 'withdrawTokens', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_to', type: 'address' }, { name: '_amount', type: 'uint256' }], outputs: [] },
  { name: 'stakeNFT', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_trancheId', type: 'uint256' }, { name: '_amount', type: 'uint256' }], outputs: [] },
] as const
```

### ERC1155_ABI

```typescript
export const ERC1155_ABI = [
  { name: 'mint', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'to', type: 'address' }, { name: 'id', type: 'uint256' }, { name: 'amount', type: 'uint256' }], outputs: [] },
  { name: 'batchMint', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'to', type: 'address' }, { name: 'ids', type: 'uint256[]' }, { name: 'amounts', type: 'uint256[]' }], outputs: [] },
  { name: 'balanceOf', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }, { name: 'id', type: 'uint256' }], outputs: [{ type: 'uint256' }] },
  { name: 'setApprovalForAll', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'operator', type: 'address' }, { name: 'approved', type: 'bool' }], outputs: [] },
  { name: 'isApprovedForAll', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }, { name: 'operator', type: 'address' }], outputs: [{ type: 'bool' }] },
  { name: 'safeTransferFrom', type: 'function', stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' }, { name: 'to', type: 'address' },
      { name: 'id', type: 'uint256' }, { name: 'amount', type: 'uint256' },
      { name: 'data', type: 'bytes' }
    ], outputs: [] },
  { name: 'uri', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [{ type: 'string' }] },
  { name: 'vault', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
  { name: 'projectOwner', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
] as const
```

### BUYBACK_POOL_ABI

```typescript
export const BUYBACK_POOL_ABI = [
  { name: 'vestingEnded', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'bool' }] },
  { name: 'userRewardRate', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'dustProtection', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'getTotalStakedVT', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'getTotalShares', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'releasedAmount', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'excessT', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'getShareValueVT', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'getClaimableT', type: 'function', stateMutability: 'view',
    inputs: [{ name: '_user', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'userInfo', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [
      { name: 'shares', type: 'uint256' },
      { name: 'claimableT', type: 'uint256' },
      { name: 'paidAccVTPerShare', type: 'uint256' }
    ] },
  { name: 'getReleaseStatus', type: 'function', stateMutability: 'view', inputs: [],
    outputs: [
      { name: 'startTime', type: 'uint48' },
      { name: 'interval', type: 'uint32' },
      { name: 'batchSize', type: 'uint256' },
      { name: 'lastTime', type: 'uint256' },
      { name: 'released', type: 'uint256' },
      { name: 'canPullNow', type: 'bool' },
    ] },
  { name: 'setReleaseConfig', type: 'function', stateMutability: 'nonpayable',
    inputs: [
      { name: '_releaseStartTime', type: 'uint48' },
      { name: '_releaseInterval', type: 'uint32' },
      { name: '_releaseBatchSize', type: 'uint256' }
    ], outputs: [] },
  { name: 'setUserRewardRate', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_rate', type: 'uint256' }], outputs: [] },
  { name: 'setDustProtection', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_dust', type: 'uint256' }], outputs: [] },
  { name: 'endVesting', type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { name: 'manualRelease', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_amount', type: 'uint256' }], outputs: [] },
  { name: 'stakeVT', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_amount', type: 'uint256' }], outputs: [] },
  { name: 'withdrawVT', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_shares', type: 'uint256' }], outputs: [] },
  { name: 'claimT', type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { name: 'redeemVT', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_vtAmount', type: 'uint256' }], outputs: [] },
] as const
```

### VT_TOKEN_ABI（通用 ERC20 + 扩展）

```typescript
export const VT_TOKEN_ABI = [
  { name: 'name', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { name: 'symbol', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
  { name: 'totalSupply', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'balanceOf', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'allowance', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'approve', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'spender', type: 'address' }, { name: 'value', type: 'uint256' }], outputs: [{ type: 'bool' }] },
  { name: 'transfer', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'to', type: 'address' }, { name: 'value', type: 'uint256' }], outputs: [{ type: 'bool' }] },
  { name: 'vault', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
  { name: 'buybackPool', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
  { name: 'trancheId', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
] as const
```

---

## 6. 标准操作流程

### 项目方完整流程

```
步骤 1：准备项目代币（T）
  → 部署你的 ERC20，或使用现有代币地址

步骤 2：创建 Suite
  → Factory.createVestingSuite(tokenAddress, "Suite 名称")
  → 获得 vault 地址 和 erc1155 地址

步骤 3：创建 Tranche
  → Vault.createNewTranche(
       trancheId,       // 从 0 开始
       {
         totalAmount: 1_000_000n * 10n**18n,   // 总归属量
         startTime:   0n,                       // 0 = 立即开始
         cliff:       BigInt(30 * 86400),       // 30 天 cliff（秒）
         duration:    BigInt(365 * 86400),      // 365 天总归属期
       },
       50n * 10n**18n   // 每个 NFT 对应 50 VT
     )
  → 获得 vtToken 地址 和 buybackPool 地址

步骤 4：存入项目代币
  → ERC20.approve(vaultAddress, amount)
  → Vault.depositTokens(amount)

步骤 5：授权 BuybackPool 拉 T
  → Vault.unlimitedApprovePool(trancheId)  ← 推荐无限授权

步骤 6：铸造 NFT 给投资人
  → ERC1155.mint(investorAddress, trancheId, nftAmount)
  → 每个 NFT 对应 vtPerNft 数量的 VT

步骤 7：配置释放计划
  → BuybackPool.setReleaseConfig(
       releaseStartTime,   // 开始释放时间戳（通常 = startTime + cliff）
       releaseInterval,    // 两次释放最小间隔秒数（如 86400 = 每天一次）
       releaseBatchSize    // 每次释放上限（0 = 无限制）
     )
```

### 投资人完整流程

```
步骤 1：收到 NFT（ERC1155，tokenId = trancheId）

步骤 2：质押 NFT，获得 VT
  → ERC1155.setApprovalForAll(vaultAddress, true)
  → Vault.stakeNFT(trancheId, nftAmount)
  → 钱包收到 VT（数量 = nftAmount × vtPerNft）

步骤 3：质押 VT 到 BuybackPool，参与归属
  → VTToken.approve(buybackPoolAddress, vtAmount)
  → BuybackPool.stakeVT(vtAmount)

步骤 4：等待 cliff 结束后，定期 claim T
  → BuybackPool.claimT()
  （每次交互自动触发释放，无需手动 pull）

步骤 5（可选）：提前退出，赎回剩余 VT
  → BuybackPool.withdrawVT(shares)
  （注意：VT 因 burn 已减少，赎回量 < 原始质押量）

步骤 6（Phase 2，vesting 结束后）：
  → BuybackPool.redeemVT(vtAmount)  // 1:1 兑换 excessT
```

---

## 7. 归属机制详解

### 份额（Shares）计算

```
首次质押：shares = vtAmount（1:1）
后续质押：shares = vtAmount × PRECISION / getShareValueVT()

其中 PRECISION = 1e18
getShareValueVT() = totalStakedVT × 1e18 / totalShares
```

### T 释放与 VT Burn

```
每次用户交互时，自动执行 _tryPullFromVault()：

条件：
  1. totalStakedVT > 0
  2. block.timestamp >= releaseStartTime
  3. block.timestamp >= lastReleaseTime + releaseInterval
  4. Vault T 余额 > 0 且已授权本 BP

执行：
  pullAmount = min(releaseBatchSize, vaultBalance, allowance)
  burnableVT = totalStakedVT - dustProtection
  actualBurn = min(pullAmount + excessT, burnableVT)
  excessT += pullAmount - actualBurn
  burn actualBurn VT from BP
  accVTPerShare += actualBurn × 1e18 / totalShares
```

### 用户可领 T 计算

```
deltaAcc = accVTPerShare - user.paidAccVTPerShare
unclaimedVT = user.shares × deltaAcc / 1e18
pendingT = unclaimedVT × userRewardRate / 1000
totalClaimable = user.claimableT + pendingT
```

### 数值示例（userRewardRate = 950）

```
初始：TotalStakedVT = 100 VT，User A 质押 10 VT = 10 shares
      TotalShares = 10，ShareValue = 100×1e18/10 = 10e18

Day 1：拉 T = 20，burnableVT = 99（dustProtection = 1）
       actualBurn = 20，accVTPerShare += 20×1e18/10 = 2e18
       TotalStakedVT = 80，ShareValue = 80×1e18/10 = 8e18

User A claimT：
  deltaAcc = 2e18，unclaimedVT = 10×2e18/1e18 = 20
  pendingT = 20 × 950 / 1000 = 19 T
```

---

## 8. 数据结构

### VestingSchedule（Vault 内使用）

```solidity
struct VestingSchedule {
    uint256 totalAmount;   // 该 Tranche 总归属代币量（含 18 位精度）
    uint48  startTime;     // 归属开始时间戳（0 = 合约自动取 block.timestamp）
    uint48  cliff;         // Cliff 时长（秒），cliff 内不释放
    uint48  duration;      // 总归属时长（秒），从 startTime 开始计算
}
```

> ⚠️ **注意**：`cliff` 和 `duration` 类型为 `uint48`，不是 `uint32`。前端 ABI 必须使用正确类型，否则函数选择器不匹配导致交易 revert。

### UserInfo（BuybackPool 内）

```solidity
struct UserInfo {
    uint256 shares;              // 用户持有的份额数量
    uint256 claimableT;          // 已结算、待领取的 T
    uint256 paidAccVTPerShare;   // 上次结算时的 accVTPerShare 快照
}
```

---

## 9. 事件清单

### VestingFactory

```solidity
event VestingSuiteCreated(
    address indexed owner,
    address indexed vault,
    address indexed erc1155,
    address projectToken,
    string suiteName
)
event ImplementationUpdated(string contractType, address oldImpl, address newImpl)
event VestingFactoryInitialized(address vaultImpl, address erc1155Impl, address buybackPoolImpl, address vtTokenImpl)
```

### Vault

```solidity
event TrancheCreated(uint256 indexed trancheId, address vtToken, address buybackPool)
event VTMinted(address indexed to, uint256 indexed trancheId, uint256 amount)
event TokensDeposited(address indexed from, uint256 amount)
event TokensWithdrawn(address indexed to, uint256 amount)
event PoolApproved(uint256 indexed trancheId, address bp, uint256 amount)
```

### BuybackPool

```solidity
event Staked(address indexed user, uint256 vtAmount, uint256 sharesIssued)
event Withdrawn(address indexed user, uint256 shares, uint256 vtReturned)
event Claimed(address indexed user, uint256 tAmount)
event Redeemed(address indexed user, uint256 vtAmount)
event TPulledFromVault(uint256 burned, uint256 excessT, uint256 shareValue, uint256 tBalance)
event ManualRelease(address indexed caller, uint256 pulled, uint256 burned, uint256 newExcessT)
event ReleaseConfigUpdated(uint48 startTime, uint32 interval, uint256 batchSize)
event UserRewardRateUpdated(uint256 oldRate, uint256 newRate)
event DustProtectionUpdated(uint256 oldDust, uint256 newDust)
event VestingEnded()
```

### ERC1155NFT

```solidity
event URIUpdated(string oldURI, string newURI)
// 继承 ERC1155 标准事件：TransferSingle, TransferBatch, ApprovalForAll
```

### VTToken

```solidity
event VTTokenInitialized(address indexed vault, address indexed buybackPool, uint256 indexed trancheId)
// 继承 ERC20 标准事件：Transfer, Approval
```

---

## 10. 错误码清单

### VestingFactory

| 错误 | 含义 |
|------|------|
| `VestingFactory__ZeroAddress` | 传入了零地址 |
| `VestingFactory__SameAddress` | 新实现地址与旧地址相同 |
| `VestingFactory__AlreadyInitialized` | 工厂已初始化，不能重复初始化 |
| `VestingFactory__ZeroSuiteName` | Suite 名称为空 |
| `VestingFactory__IndexOutOfBounds` | 访问了不存在的 Suite 索引 |

### Vault

| 错误 | 含义 |
|------|------|
| `Vault__ZeroAddress` | 传入零地址 |
| `Vault__AlreadyInitialized` | Vault 已初始化 |
| `Vault__TrancheNotFound` | 指定 trancheId 不存在 |
| `Vault__TrancheAlreadyExists` | 该 trancheId 已创建 |
| `Vault__ScheduleInvalid` | VestingSchedule 参数无效 |
| `Vault__ZeroAmount` | 金额为 0 |
| `Vault__InsufficientVTBalance` | VT 余额不足 |
| `Vault__InsufficientNFTBalance` | NFT 余额不足 |
| `Vault__NotProjectOwner` | 调用者不是 projectOwner |

### BuybackPool

| 错误 | 含义 |
|------|------|
| `BuybackPool__AlreadyInitialized` | 已初始化 |
| `BuybackPool__NoStakedVT` | 池中没有质押的 VT |
| `BuybackPool__NotStarted` | 未到释放开始时间 |
| `BuybackPool__InCooldown` | 在冷却期内 |
| `BuybackPool__InsufficientVaultBalance` | Vault T 余额不足 |
| `BuybackPool__NothingToPull` | 没有可拉取的 T |
| `BuybackPool__ZeroAmount` | 金额为 0 |
| `BuybackPool__VestingEnded` | Phase 2 已结束，不能再 stake/claim |

---

## 11. 前端接入配置

### wagmi v2 基础配置

```typescript
import { createConfig, http } from 'wagmi'
import { sepolia } from 'viem/chains'
import { injected, metaMask } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected(), metaMask()],
  transports: {
    [sepolia.id]: http('https://ethereum-sepolia.rpc.subquery.network/public'),
  },
})

// Chain ID: 11155111
```

### 合约地址常量

```typescript
export const FACTORY_ADDRESS = '0xaEFE491fFbb56722FF96D6C51558Ab61a8c8D274' as const
export const CHAIN_ID = 11155111  // Sepolia
```

### 典型读取示例（wagmi useReadContracts）

```typescript
// 读取 Vault 基本信息
const { data } = useReadContracts({
  contracts: [
    { address: vaultAddress, abi: VAULT_ABI, functionName: 'suiteName' },
    { address: vaultAddress, abi: VAULT_ABI, functionName: 'projectToken' },
    { address: vaultAddress, abi: VAULT_ABI, functionName: 'trancheCount' },
    { address: vaultAddress, abi: VAULT_ABI, functionName: 'projectOwner' },
  ],
})

// 读取 BuybackPool 状态
const { data: bpData } = useReadContracts({
  contracts: [
    { address: bpAddress, abi: BUYBACK_POOL_ABI, functionName: 'getReleaseStatus' },
    { address: bpAddress, abi: BUYBACK_POOL_ABI, functionName: 'getTotalStakedVT' },
    { address: bpAddress, abi: BUYBACK_POOL_ABI, functionName: 'getClaimableT', args: [userAddress] },
    { address: bpAddress, abi: BUYBACK_POOL_ABI, functionName: 'vestingEnded' },
  ],
})
```

### 典型写入示例（wagmi useWriteContract）

```typescript
const { writeContract } = useWriteContract()

// 投资人质押 VT
writeContract({
  address: bpAddress,
  abi: BUYBACK_POOL_ABI,
  functionName: 'stakeVT',
  args: [vtAmount],  // bigint，含 18 位精度
  chainId: 11155111,
})

// 投资人 claim T
writeContract({
  address: bpAddress,
  abi: BUYBACK_POOL_ABI,
  functionName: 'claimT',
  chainId: 11155111,
})
```

### 注意事项

1. **VT 质押前必须先 approve**：`VTToken.approve(bpAddress, amount)`
2. **NFT 质押前必须先 setApprovalForAll**：`ERC1155.setApprovalForAll(vaultAddress, true)`
3. **存代币前必须先 approve**：`ProjectToken.approve(vaultAddress, amount)`
4. **`VestingSchedule` 的时间字段均为 `uint48`**（非 uint32），ABI 类型必须匹配
5. **`startTime = 0`** 时合约取 `block.timestamp` 作为开始时间
6. `releaseBatchSize = 0` 表示每次释放全部可用 T
7. `releaseInterval = 0` 表示无冷却限制，每次交互都可释放

---

*最后更新：2026-05-13 | 合约版本：BuybackPool v2.0 | 网络：Sepolia (11155111)*
