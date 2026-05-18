import { Router } from "express";
import { db, docsPages } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const DOCS_SEED: Array<typeof docsPages.$inferInsert> = [
  {
    slug: "introduction/what-is-minke",
    title: "What is Minke?",
    section: "Introduction",
    order: 1,
    comingSoon: false,
    content: `# What is Minke?

Minke Finance is a DeFi protocol that unlocks liquidity from vested and staked positions. By wrapping any locked asset into a tradeable **Vesting Token (VT)**, Minke enables holders to access the present value of their future claims — without waiting for lock-up periods to expire.

## Liquidity Without Sacrifice

In traditional DeFi, participating in vesting schedules, staking, or yield-bearing positions means accepting illiquidity. You commit capital, it gets locked up, and you wait. Minke changes that equation.

With Minke:

- **Holders** can exit early at a market-determined discount instead of waiting
- **Protocols** can offer more attractive vesting structures without penalizing early participants
- **Buyers** gain access to discounted exposure with a clear maturity date

## The Core Mechanism

When you deposit a locked asset into Minke's \`VestingFactory\`, you receive a **Vesting Token (VT)** — an ERC-20 token representing the future value of your locked position. VTs are:

- **Tradeable** on any DEX or secondary market
- **Redeemable** at maturity for the underlying asset
- **Composable** with other DeFi protocols

> Minke v2 will introduce **Yield Tokens (YT)**, further separating the yield component from the principal for advanced yield strategies.

## Who is Minke For?

| Participant | Use Case |
|---|---|
| Token recipients | Exit vesting positions early |
| Institutional funds | Deploy into DeFi without long lock-ups |
| Protocol treasuries | Offer liquid vesting to contributors |
| DeFi traders | Buy discounted future-value exposure |`,
  },
  {
    slug: "introduction/the-problem",
    title: "The Problem",
    section: "Introduction",
    order: 2,
    comingSoon: false,
    content: `# The Problem

Over **$50 billion** in crypto assets are locked in vesting schedules, staking contracts, and time-based commitments at any given time. This capital is productive for the network but completely illiquid for the holder.

## The Illiquidity Trap

When a contributor, investor, or protocol participant receives a vesting allocation, they face a hard choice: hold through the full lock-up period or forfeit their position. There is no middle ground.

This creates three distinct problems:

### For Token Recipients

Market conditions change. A founder may need liquidity for operating expenses. An early investor may want to rebalance. But traditional vesting offers no exit valve — the only options are to wait or to lose.

### For Institutional Capital

Institutional allocators managing DeFi treasuries, venture funds, or on-chain endowments cannot commit to multi-year lock-ups at scale. The inability to access liquidity mid-stream makes entire categories of DeFi participation off-limits for compliant capital.

### For Protocols

Protocols want aligned, long-term contributors. But rigid vesting schedules that punish any early exit reduce the attractiveness of token compensation relative to cash. The result is a race to shorter lock-ups — precisely the opposite of what protocols need.

## The Cost of Illiquidity

Illiquidity doesn't just inconvenience individuals — it has measurable economic costs:

- **Deadweight loss**: Capital that could be redeployed sits idle, earning nothing
- **Mispriced risk**: Lock-up discounts are applied at grant time with no ability to adjust
- **Reduced participation**: Institutional capital avoids illiquid structures entirely

## What's Missing

There is no general-purpose protocol for converting locked positions into tradeable instruments. Minke is purpose-built to fill this gap.`,
  },
  {
    slug: "introduction/why-now",
    title: "Why Now",
    section: "Introduction",
    order: 3,
    comingSoon: false,
    content: `# Why Now

Several converging forces make this precisely the right moment for a liquidity infrastructure protocol.

## DeFi Maturation

The DeFi ecosystem has crossed a maturity threshold. Protocols that have survived multiple market cycles have established track records. Token lock-ups tied to these protocols now carry real, assessable value — the kind that sophisticated buyers are willing to price and purchase.

## Institutional On-Chain Presence

Institutional capital has arrived in DeFi in a meaningful way. Family offices, crypto-native funds, and protocol treasuries are managing billions on-chain. These participants need liquidity tools that match their operational requirements. A multi-year vesting lock-up with no exit is simply incompatible with institutional treasury management.

## ERC-20 Composability

The ERC-20 standard is universally understood and integrated. By wrapping locked positions into standard ERC-20 Vesting Tokens, Minke makes them immediately composable with the full DeFi stack — DEXes, lending protocols, yield aggregators, and more. No custom integrations required.

## Gas Efficiency at Scale

L1 and L2 transaction costs have fallen to levels where wrapping and trading small-to-mid size positions is economically viable. What would have been impractical in 2021 is routine today.

## The Regulatory Window

Jurisdictions are increasingly providing clarity on how tokenized financial instruments should be treated. Minke's structure — representing future claims on existing assets — fits within emerging frameworks more cleanly than many earlier DeFi designs.

## Timing Is Everything

The opportunity to become the default liquidity layer for vested assets is available now. As more protocols adopt token-based compensation and more institutional capital enters on-chain, the demand for Minke's infrastructure will compound.`,
  },
  {
    slug: "protocol/architecture",
    title: "Architecture",
    section: "Protocol",
    order: 4,
    comingSoon: false,
    content: `# Protocol Architecture

Minke's protocol is built around a factory pattern: a single \`VestingFactory\` deploys and manages individual \`VestingToken\` contracts for each unique locked asset position.

## High-Level Overview

\`\`\`
Depositor
    │
    ▼
VestingFactory ──creates──▶ VestingToken (ERC-20 VT)
    │                            │
    │                            ├── tradeable on DEX
    │                            └── redeemable at maturity
    │
ContractRegistry ──tracks──▶ all deployed VestingTokens
\`\`\`

## Core Components

### VestingFactory

The \`VestingFactory\` is the protocol's entry point. It:

- Accepts deposits of locked or vesting positions
- Deploys a new \`VestingToken\` contract for each position
- Maintains registry linkage through \`ContractRegistry\`
- Is deployed behind an upgradeable proxy for future improvements

### VestingToken

Each \`VestingToken\` is an ERC-20 contract representing a specific locked position. It:

- Holds the underlying locked asset in escrow
- Issues VT tokens 1:1 with the locked amount
- Enforces the redemption schedule
- Burns VT tokens upon redemption at maturity

### ContractRegistry

The \`ContractRegistry\` provides an on-chain index of all deployed \`VestingToken\` contracts. It enables:

- Discovery of all Minke-wrapped positions
- Verification that a VT contract was deployed by Minke
- Future protocol integrations to enumerate available positions

## Upgrade Path

The \`VestingFactory\` is deployed behind a \`TransparentUpgradeableProxy\` with a \`ProxyAdmin\` contract. This pattern allows Minke to improve the factory logic without disrupting existing \`VestingToken\` deployments.

Individual \`VestingToken\` contracts are not upgradeable — once deployed, their terms are immutable. This provides strong guarantees to VT holders that the rules of their position cannot change.

## Token Flow

1. **Deposit** — Holder deposits a locked asset into \`VestingFactory\`
2. **Mint** — \`VestingFactory\` deploys a \`VestingToken\` and mints VT tokens to the depositor
3. **Trade** — VT holder sells or transfers VT tokens at a market discount
4. **Mature** — At maturity, VT holder redeems VT tokens for the underlying asset`,
  },
  {
    slug: "protocol/vesting-tokens",
    title: "Vesting Tokens (VT)",
    section: "Protocol",
    order: 5,
    comingSoon: false,
    content: `# Vesting Tokens (VT)

A **Vesting Token (VT)** is a standard ERC-20 token that represents the future value of a locked or vesting position. VTs make illiquid commitments tradeable.

## What a VT Represents

When you deposit a locked position into Minke, you receive VT tokens in return. Each VT token represents:

- **A specific underlying asset** (e.g., ETH, a governance token, staked assets)
- **A specific quantity** — 1 VT = 1 unit of the underlying, claimable at maturity
- **A maturity date** — the timestamp at which VT holders can redeem for the underlying

## Properties of VTs

| Property | Value |
|---|---|
| Standard | ERC-20 |
| Transferable | Yes — freely tradeable |
| Divisible | Yes — standard 18 decimal places |
| Redeemable | At maturity, 1:1 for underlying |
| Upgradeable | No — terms are immutable once deployed |

## Pricing Dynamics

VTs trade at a discount to their face value, with the discount reflecting:

- **Time to maturity** — longer lock-ups command deeper discounts
- **Asset quality** — blue-chip underlying assets narrow the discount
- **Market liquidity** — deeper markets price VTs more efficiently

As maturity approaches, a VT's market price converges toward the spot price of its underlying asset.

## Redemption

At or after the maturity date, any VT holder can call the \`redeem()\` function to exchange VT tokens for the underlying asset at a 1:1 ratio. VT tokens are burned upon redemption.

## Yield Tokens (YT) — Coming in v2

Minke v2 will introduce **Yield Tokens (YT)**, which separate the yield component from the principal of a position. This enables:

- Dedicated yield strategies without principal exposure
- Fixed-rate lending against the principal component
- More granular risk/return profiling for institutional participants

> YT functionality is currently in design. Follow Minke's updates for release timelines.`,
  },
  {
    slug: "protocol/smart-contracts",
    title: "Smart Contracts",
    section: "Protocol",
    order: 6,
    comingSoon: false,
    content: `# Smart Contracts

Minke's protocol consists of five deployed contracts on Ethereum. The current testnet deployment is live on **Sepolia**.

## Contract Overview

| Contract | Role |
|---|---|
| \`VestingFactory\` | Core factory for deploying VestingToken contracts |
| \`VestingToken\` | ERC-20 representing a single locked position |
| \`ContractRegistry\` | On-chain index of all Minke-deployed VestingTokens |
| \`ProxyAdmin\` | Admin contract for the upgradeable proxy |
| \`TransparentUpgradeableProxy\` | Proxy wrapping VestingFactory for upgradeability |

## Sepolia Deployments

\`\`\`
VestingFactory (implementation):
  0x2507a21e3d70Ffe6ba40d7e7E5d9c94cdd2Ec5D

TransparentUpgradeableProxy (VestingFactory proxy):
  0x...

ProxyAdmin:
  0x...

ContractRegistry:
  0x...
\`\`\`

> Full mainnet addresses will be published at launch.

## VestingFactory

The \`VestingFactory\` is the primary entry point for the protocol.

**Key functions:**

\`\`\`solidity
// Deploy a new VestingToken for a locked position
function createVestingToken(
    address underlying,
    uint256 amount,
    uint256 maturityTimestamp,
    string calldata name,
    string calldata symbol
) external returns (address vestingToken);

// Get all VestingTokens deployed by this factory
function getDeployedTokens() external view returns (address[] memory);
\`\`\`

## VestingToken

Each \`VestingToken\` is an ERC-20 with additional redemption logic.

**Key functions:**

\`\`\`solidity
// Redeem VT tokens for the underlying asset at maturity
function redeem(uint256 amount) external;

// Check whether the position has matured
function isMatured() external view returns (bool);

// Get the underlying asset address
function underlying() external view returns (address);

// Get the maturity timestamp
function maturity() external view returns (uint256);
\`\`\`

## ContractRegistry

\`\`\`solidity
// Check if an address is a Minke-deployed VestingToken
function isRegistered(address token) external view returns (bool);

// Get all registered VestingToken addresses
function getRegistered() external view returns (address[] memory);
\`\`\`

## Security Notes

- VestingToken contracts are **not upgradeable** — terms are immutable once deployed
- The VestingFactory upgrade path is controlled by ProxyAdmin with multi-sig governance
- Underlying assets are held in escrow within each VestingToken contract`,
  },
  {
    slug: "protocol/security",
    title: "Security",
    section: "Protocol",
    order: 7,
    comingSoon: false,
    content: `# Security

Minke's protocol design prioritizes the security of locked assets and the integrity of VT redemption guarantees.

## Design Principles

### Immutable VestingToken Contracts

Once a \`VestingToken\` contract is deployed, its terms cannot be changed. The maturity date, underlying asset, and redemption ratio are permanently fixed at creation. This provides strong guarantees to VT holders: the rules of their position are set in stone.

### Upgradeable Factory Only

The \`VestingFactory\` uses a \`TransparentUpgradeableProxy\` pattern, allowing Minke to improve factory logic (e.g., add new position types, improve gas efficiency) without affecting existing deployments. The upgrade key is held by a multi-sig governance contract.

### Escrow Architecture

Underlying assets are held directly within each \`VestingToken\` contract — not in a shared pool. This means:

- No cross-position contagion: an issue with one VestingToken does not affect others
- Simple audit surface: each VestingToken holds exactly the assets it should
- Trustless redemption: the redemption logic is self-contained per contract

## Access Control

| Role | Capability |
|---|---|
| VestingFactory owner | Deploy new VestingToken contracts |
| ProxyAdmin | Upgrade VestingFactory implementation |
| VT holder | Redeem at maturity |
| Anyone | View positions and check registry |

## Risk Disclosures

- **Smart contract risk**: All DeFi protocols carry smart contract risk. Minke's contracts are designed for simplicity to minimize attack surface.
- **Liquidity risk**: VT secondary market liquidity depends on market participants. Deep discounts may apply in illiquid conditions.
- **Underlying asset risk**: VTs inherit the risks of their underlying assets. A VT's value is bounded by the value of what it redeems for.

## Audits

Minke's contracts are undergoing independent security review. Audit reports will be published prior to mainnet deployment.

> This documentation does not constitute financial or legal advice. Always do your own due diligence.`,
  },
  {
    slug: "use-cases/institutional-investors",
    title: "Institutional Investors",
    section: "Use Cases",
    order: 8,
    comingSoon: false,
    content: `# Institutional Investors

Institutional capital manages risk through diversification, liquidity buffers, and position limits. Multi-year DeFi lock-ups are incompatible with most institutional mandates — Minke changes that.

## The Institutional Dilemma

A family office allocating to DeFi faces a structural problem: the most attractive yields and the most aligned DeFi positions often come with multi-year lock-up requirements. Accepting a 4-year vesting schedule to earn governance tokens or participate in protocol incentives is simply not possible for a fund with quarterly liquidity requirements.

The result: institutional capital stays on the sidelines or takes shorter-duration, lower-yield positions.

## Minke's Solution

With Minke, an institutional investor can:

1. **Participate in long-duration positions** knowing there is an exit valve
2. **Sell VT tokens** on the secondary market if liquidity is needed before maturity
3. **Buy VT tokens** as a discounted, fixed-maturity exposure to a preferred asset

## Use Case: DeFi Fund Liquidity Management

A crypto-native fund holds $10M in staked ETH with a 12-month unlock schedule. Midway through the year, the fund needs to rebalance.

Without Minke: the fund has no option but to wait.

With Minke: the fund wraps the staked position into VT tokens and sells them at a market-determined discount. The buyer receives a discounted ETH-equivalent position with 6 months to maturity. Both sides benefit.

## Use Case: Structured DeFi Products

Institutions building structured products — fixed-income equivalents, tranche products, maturity-matched positions — can use VT tokens as building blocks.

A VT with a known maturity date and a clear underlying asset looks, from a portfolio perspective, like a zero-coupon bond. Familiar structures, on-chain.

## Key Benefits for Institutions

- **Liquidity optionality**: Participate without permanent commitment
- **Structured exposure**: Fixed-maturity positions with known redemption terms
- **DeFi composability**: VTs work with existing DeFi infrastructure`,
  },
  {
    slug: "use-cases/protocol-treasuries",
    title: "Protocol Treasuries",
    section: "Use Cases",
    order: 9,
    comingSoon: false,
    content: `# Protocol Treasuries

Protocol treasuries managing on-chain assets face a unique set of challenges: they need to align contributors over the long term while maintaining the treasury's flexibility. Minke offers a new model.

## The Treasury Challenge

A protocol distributes tokens to contributors under a 4-year vesting schedule. The goals are alignment and retention. But contributors — particularly early-stage team members with significant life expenses — chafe under long vesting structures. The protocol either shortens vests (reducing alignment) or watches contributors leave.

## Minke-Enabled Vesting

With Minke, protocols can offer **liquid vesting**: contributors receive VT tokens that represent their full vesting schedule but can be traded at any time.

- **Contributors** retain optionality — they can hold until maturity or sell at a discount
- **Protocols** maintain the full lock-up structure — the underlying tokens remain in escrow
- **Buyers** access discounted token exposure with a known redemption date

The vesting schedule is unchanged. Only the liquidity profile improves.

## Use Case: Contributor Compensation

A protocol pays engineers in tokens on a 3-year vest. Under Minke:

1. Protocol deposits the vesting allocation into \`VestingFactory\`
2. Contributors receive VT tokens representing their allocation
3. Contributors hold to maturity for 1:1 redemption, or sell early at market price

The protocol achieves long-term alignment. Contributors achieve optionality.

## Use Case: Treasury Diversification

A protocol treasury holds a large position in a partner protocol's governance token under a lock-up agreement. Using Minke, the treasury can:

- Wrap the position into VT tokens
- Sell a portion of the VT tokens to fund operations
- Maintain protocol-level commitment while accessing treasury liquidity

## Benefits for Protocols

- **Attract top contributors** with more flexible compensation structures
- **Maintain alignment** without penalizing contributors for liquidity needs
- **Improve treasury optionality** on locked partner positions`,
  },
  {
    slug: "use-cases/defi-power-users",
    title: "DeFi Power Users",
    section: "Use Cases",
    order: 10,
    comingSoon: false,
    content: `# DeFi Power Users

For sophisticated DeFi participants, Minke VTs open up a range of strategies — from discount arbitrage to structured yield positions.

## Discount Arbitrage

VT tokens trade at a discount to their underlying asset. The discount reflects time value and market sentiment. A trader who believes the market is mispricing a VT can:

1. Buy VT at a discount (e.g., 85 cents on the dollar for a 6-month VT)
2. Hold to maturity
3. Redeem for the full underlying asset

This is mechanically similar to buying a zero-coupon bond below face value.

## Yield Enhancement

A DeFi participant holding a long-term token position they intend to keep can:

1. Wrap the position into VT tokens via Minke
2. Sell the VT tokens to a buyer at a small discount
3. Use the proceeds to deploy into higher-yield opportunities during the lock-up period

Effectively, this converts an idle locked position into productive yield-bearing capital.

## LP Positions with VTs

VT tokens are standard ERC-20s. They can be supplied to DEX liquidity pools, creating:

- **VT/ETH pools** — enabling price discovery for a specific maturity tranche
- **VT/stablecoin pools** — providing stable exit liquidity for VT holders

LPs earn fees from both buyers and sellers of VT exposure, with a known maximum-loss scenario bounded by the VT redemption value.

## Portfolio Construction

A DeFi portfolio manager can build a **maturity ladder** using VT tokens across different protocols and lock-up periods — analogous to a bond ladder in traditional finance.

| Position | Underlying | Maturity | Discount |
|---|---|---|---|
| VT-A | ETH staking | 3 months | 2% |
| VT-B | Governance token | 12 months | 15% |
| VT-C | Protocol rewards | 24 months | 28% |

> VT pricing examples are illustrative only and do not represent actual market data.

## Advanced Strategies with YT (v2)

When Yield Tokens launch in v2, power users will be able to:

- Separate principal and yield from a single position
- Trade yield exposure independently of principal
- Create fixed-rate synthetics using the principal component`,
  },
  {
    slug: "use-cases/restaking",
    title: "Restaking",
    section: "Use Cases",
    order: 11,
    comingSoon: false,
    content: `# Restaking

Restaking protocols lock ETH or liquid staking tokens (LSTs) to secure additional networks, often with extended unlock periods. Minke is a natural complement to the restaking ecosystem.

## The Restaking Lock-Up Problem

Restaking offers higher yields by putting staked assets to work across multiple networks simultaneously. But this additional utility comes with additional illiquidity: assets are often subject to multi-network withdrawal queues that can extend unlock periods to weeks or months.

For a restaker who needs to exit quickly, this is a significant problem.

## Minke + Restaking

A restaker holding illiquid restaked ETH (or an LST) can:

1. Deposit the restaked position into Minke's \`VestingFactory\`
2. Receive VT tokens representing the future value of the restaked position
3. Sell or use the VT tokens immediately

The underlying restaked position continues to earn yield and secure networks. The restaker accesses liquidity.

## EigenLayer and AVS Positions

Actively Validated Services (AVSs) on EigenLayer and similar platforms often have staking lock-ups tied to their slashing and security parameters. Minke can wrap AVS operator positions into VTs, providing:

- **Operator liquidity**: AVS operators can access capital without unstaking
- **Delegator flexibility**: Delegators can exit positions at a market discount

## Liquid Restaking Tokens (LRTs)

Liquid Restaking Tokens already provide some liquidity for restaked positions, but LRT redemptions are still subject to queues during high-demand periods. VTs provide an additional liquidity layer: instead of waiting in a redemption queue, LRT holders can sell VTs at a market discount for immediate liquidity.

## The Restaking Ecosystem Flywheel

More restaking liquidity → more restaking participation → more security for AVSs → more valuable restaking rewards → deeper VT markets → more restaking liquidity.

Minke sits at the center of this flywheel, providing the liquidity infrastructure that makes large-scale restaking participation viable.`,
  },
  {
    slug: "integration-guide",
    title: "Integration Guide",
    section: "Integration Guide",
    order: 12,
    comingSoon: true,
    content: `# Integration Guide

**Coming Soon**

The Minke Integration Guide will provide everything you need to integrate Minke's VestingToken infrastructure into your protocol, dApp, or trading system.

## What to Expect

- **SDK documentation** — TypeScript/JavaScript SDK for interacting with VestingFactory and VestingToken contracts
- **Smart contract interfaces** — Full ABI documentation and integration patterns
- **Event indexing** — How to track VestingToken deployments and redemptions
- **DEX integration** — Adding VT token support to AMMs and aggregators
- **Wallet integration** — Displaying and managing VT positions in wallets

## Stay Updated

Follow Minke Finance for release announcements.`,
  },
  {
    slug: "user-101",
    title: "User 101",
    section: "User 101",
    order: 13,
    comingSoon: true,
    content: `# User 101

**Coming Soon**

The Minke User 101 guide will walk through everything a first-time user needs to know — from connecting your wallet to trading VT tokens.

## What to Expect

- **Getting started** — Connecting your wallet and navigating the Minke app
- **Depositing a position** — Step-by-step walkthrough of creating a VestingToken
- **Trading VTs** — How to buy and sell VT tokens on secondary markets
- **Redeeming at maturity** — How to claim your underlying assets when the time comes
- **FAQs** — Common questions answered

## Stay Updated

Follow Minke Finance for release announcements.`,
  },
  {
    slug: "vision",
    title: "Vision",
    section: "Vision",
    order: 14,
    comingSoon: false,
    content: `# Vision

Minke's mission is to become the default liquidity layer for every locked asset in DeFi — the infrastructure that lets the entire ecosystem participate without permanent commitment.

## The World We're Building

Today, participating in DeFi's most valuable opportunities means accepting illiquidity. The best yields, the most aligned protocol positions, the highest-upside staking arrangements — they all come with lock-ups. Minke exists to break that constraint.

We envision a DeFi ecosystem where:

- **Every vested position is liquid** — from contributor tokens to staking rewards
- **Institutional capital participates fully** — without lock-up constraints blocking access
- **Protocols attract better talent** — by offering flexible compensation without sacrificing alignment
- **Risk is priced efficiently** — through transparent, on-chain markets for future claims

## The Path to v2: Yield Tokens

The introduction of **Yield Tokens (YT)** in v2 will unlock the next layer of the Minke ecosystem. By separating the yield component from the principal of a locked position, YTs enable:

- **Fixed-rate lending** against the principal component
- **Yield trading** — buying and selling future yield streams
- **Structured products** — combining VTs and YTs to create novel risk profiles

The VT → YT expansion mirrors the evolution of traditional fixed income markets: from simple bonds to stripped securities, interest rate swaps, and beyond.

## A New Primitive

Minke VTs are not just a product — they are a new on-chain primitive. Like ERC-20s themselves, wrapped ETH, or liquidity pool tokens, VTs create composability that others can build on.

We expect the DeFi ecosystem to develop applications on top of Minke that we haven't imagined: yield aggregators that route through VT positions, lending protocols that accept VTs as collateral, insurance products that cover VT discount risk.

## Long-Term Outlook

The locked-asset market will grow as DeFi adoption deepens. More protocols mean more token distributions. More institutional participation means more structured positions. More restaking means more locked ETH.

Every locked asset is a future customer for Minke's liquidity infrastructure.

> Minke is building the financial rails for a fully liquid on-chain economy.`,
  },
];

async function seedDocsIfEmpty() {
  try {
    const existing = await db.select().from(docsPages).limit(1);
    if (existing.length > 0) return;
    await db.insert(docsPages).values(DOCS_SEED);
  } catch {
    // seeding is best-effort
  }
}

seedDocsIfEmpty();

router.get("/docs/pages", async (req, res) => {
  try {
    const pages = await db
      .select({
        slug: docsPages.slug,
        title: docsPages.title,
        section: docsPages.section,
        order: docsPages.order,
        comingSoon: docsPages.comingSoon,
      })
      .from(docsPages)
      .orderBy(docsPages.order);
    res.json(pages);
  } catch (err) {
    req.log.error({ err }, "Failed to list doc pages");
    res.status(500).json({ error: "Internal server error" });
  }
});

async function getDocBySlug(slug: string, req: any, res: any) {
  try {
    const [page] = await db
      .select()
      .from(docsPages)
      .where(eq(docsPages.slug, slug))
      .limit(1);
    if (!page) {
      res.status(404).json({ error: "Page not found" });
      return;
    }
    res.json({
      slug: page.slug,
      title: page.title,
      section: page.section,
      order: page.order,
      content: page.content,
      comingSoon: page.comingSoon,
      updatedAt: page.updatedAt?.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get doc content");
    res.status(500).json({ error: "Internal server error" });
  }
}

router.get("/docs/content/:section/:page", async (req, res) => {
  const slug = `${req.params["section"]}/${req.params["page"]}`;
  await getDocBySlug(slug, req, res);
});

router.get("/docs/content/:slug", async (req, res) => {
  await getDocBySlug(req.params["slug"], req, res);
});

async function updateDocBySlug(slug: string, content: string, req: any, res: any) {
  try {
    const [updated] = await db
      .update(docsPages)
      .set({ content, updatedAt: new Date() })
      .where(eq(docsPages.slug, slug))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Page not found" });
      return;
    }
    res.json({
      slug: updated.slug,
      title: updated.title,
      section: updated.section,
      order: updated.order,
      content: updated.content,
      comingSoon: updated.comingSoon,
      updatedAt: updated.updatedAt?.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update doc content");
    res.status(500).json({ error: "Internal server error" });
  }
}

function adminAuth(req: any, res: any): string | null {
  const adminPassword = process.env["DOCS_ADMIN_PASSWORD"] ?? "minke-admin";
  const authHeader = (req.headers["authorization"] as string) ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (token !== adminPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return token;
}

router.post("/docs/auth", (req, res) => {
  const result = adminAuth(req, res);
  if (!result) return;
  res.json({ ok: true });
});

router.put("/docs/content/:section/:page", async (req, res) => {
  if (!adminAuth(req, res)) return;
  const slug = `${req.params["section"]}/${req.params["page"]}`;
  const { content } = req.body as { content?: string };
  if (typeof content !== "string") {
    res.status(400).json({ error: "content is required" });
    return;
  }
  await updateDocBySlug(slug, content, req, res);
});

router.put("/docs/content/:slug", async (req, res) => {
  if (!adminAuth(req, res)) return;
  const { content } = req.body as { content?: string };
  if (typeof content !== "string") {
    res.status(400).json({ error: "content is required" });
    return;
  }
  await updateDocBySlug(req.params["slug"], content, req, res);
});

export default router;
