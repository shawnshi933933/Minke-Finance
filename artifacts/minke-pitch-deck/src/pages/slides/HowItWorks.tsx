const base = import.meta.env.BASE_URL;

export default function HowItWorks() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #4A8AFF 1px, transparent 1px), linear-gradient(to bottom, #4A8AFF 1px, transparent 1px)",
          backgroundSize: "8vh 8vh",
        }}
      />

      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.5vh] w-auto opacity-80" />
        <div className="font-mono text-[1.2vw] text-muted tracking-widest">05 / HOW IT WORKS</div>
      </div>

      <div className="absolute left-[5vw] top-[13vh]">
        <div className="font-mono text-[1.3vw] text-primary tracking-[0.3em] mb-[2vh]">FROM LOCKED TO LIQUID</div>
        <h2 className="font-display font-bold text-[4.2vw] leading-none tracking-tight text-text">
          Four steps.
        </h2>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[6vh] grid grid-cols-4 gap-[1.5vw]">
        <div className="bg-bg-elevated rounded-[1.2vh] p-[2.5vh] border border-border flex flex-col h-[50vh]">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[1.4vw] text-primary tracking-widest">01</div>
            <img src={`${base}icon-deposit.png`} crossOrigin="anonymous" alt="" className="h-[12vh] w-auto" />
          </div>
          <div className="mt-[2vh] font-display font-bold text-[2vw] leading-tight text-text">
            Deposit a DRI asset
          </div>
          <div className="mt-[1.5vh] text-[1.4vw] text-muted leading-snug">
            SAFT contract, vesting schedule, node license or RWA bond. The factory mints a position NFT.
          </div>
        </div>

        <div className="bg-bg-elevated rounded-[1.2vh] p-[2.5vh] border border-border flex flex-col h-[50vh]">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[1.4vw] text-primary tracking-widest">02</div>
            <img src={`${base}icon-receive.png`} crossOrigin="anonymous" alt="" className="h-[12vh] w-auto" />
          </div>
          <div className="mt-[2vh] font-display font-bold text-[2vw] leading-tight text-text">
            Receive VT instantly
          </div>
          <div className="mt-[1.5vh] text-[1.4vw] text-muted leading-snug">
            Stake the NFT and mint VT &mdash; a fungible, tradable representation of the locked future tokens.
          </div>
        </div>

        <div className="bg-bg-elevated rounded-[1.2vh] p-[2.5vh] border border-border flex flex-col h-[50vh]">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[1.4vw] text-primary tracking-widest">03</div>
            <img src={`${base}icon-trade.png`} crossOrigin="anonymous" alt="" className="h-[12vh] w-auto" />
          </div>
          <div className="mt-[2vh] font-display font-bold text-[2vw] leading-tight text-text">
            Trade, hold or claim
          </div>
          <div className="mt-[1.5vh] text-[1.4vw] text-muted leading-snug">
            Sell VT for instant exit, hold for upside, or claim the underlying tokens as the schedule vests.
          </div>
        </div>

        <div className="bg-primary/15 rounded-[1.2vh] p-[2.5vh] border border-primary flex flex-col h-[50vh]">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[1.4vw] text-primary tracking-widest">04</div>
            <img src={`${base}icon-redemption.png`} crossOrigin="anonymous" alt="" className="h-[12vh] w-auto" />
          </div>
          <div className="mt-[2vh] font-display font-bold text-[2vw] leading-tight text-text">
            Final 1:1 redemption
          </div>
          <div className="mt-[1.5vh] text-[1.4vw] text-text/85 leading-snug">
            At maturity, every VT is redeemable 1:1 for the underlying token. No oracles, no haircuts, no counterparty.
          </div>
        </div>
      </div>
    </div>
  );
}
