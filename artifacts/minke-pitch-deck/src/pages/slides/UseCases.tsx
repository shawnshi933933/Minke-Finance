const base = import.meta.env.BASE_URL;

export default function UseCases() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 100% 100%, rgba(24,95,234,0.18) 0%, rgba(0,0,0,0) 60%)",
        }}
      />

      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.5vh] w-auto opacity-80" />
        <div className="font-mono text-[1.2vw] text-muted tracking-widest">06 / USE CASES</div>
      </div>

      <div className="absolute left-[5vw] top-[13vh] max-w-[60vw]">
        <div className="font-mono text-[1.3vw] text-primary tracking-[0.3em] mb-[2vh]">WHO USES MINKE</div>
        <h2 className="font-display font-bold text-[4.5vw] leading-[0.98] tracking-tight text-text" style={{ textWrap: "balance" }}>
          Anywhere a token has a vesting schedule.
        </h2>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[6vh] grid grid-cols-4 gap-[1.5vw]">
        <div className="bg-bg-elevated rounded-[1.2vh] p-[3vh] border border-border h-[44vh] flex flex-col">
          <div className="font-mono text-[1.1vw] text-primary tracking-widest">01</div>
          <div className="mt-[1.5vh] font-display font-bold text-[2.2vw] leading-tight text-text">
            VC &amp; Angel SAFTs
          </div>
          <div className="mt-[2vh] text-[1.4vw] text-muted leading-snug">
            Funds locked in 2-4 year vests can be used as collateral, hedged, or partially exited &mdash; without breaking SAFT terms.
          </div>
        </div>

        <div className="bg-bg-elevated rounded-[1.2vh] p-[3vh] border border-border h-[44vh] flex flex-col">
          <div className="font-mono text-[1.1vw] text-primary tracking-widest">02</div>
          <div className="mt-[1.5vh] font-display font-bold text-[2.2vw] leading-tight text-text">
            Team &amp; Advisor Vesting
          </div>
          <div className="mt-[2vh] text-[1.4vw] text-muted leading-snug">
            Founders, contributors and advisors get controlled liquidity on long vests &mdash; without dumping spot or breaking lockups.
          </div>
        </div>

        <div className="bg-bg-elevated rounded-[1.2vh] p-[3vh] border border-border h-[44vh] flex flex-col">
          <div className="font-mono text-[1.1vw] text-primary tracking-widest">03</div>
          <div className="mt-[1.5vh] font-display font-bold text-[2.2vw] leading-tight text-text">
            Node &amp; License Rewards
          </div>
          <div className="mt-[2vh] text-[1.4vw] text-muted leading-snug">
            DePIN, AI and L1 node licenses generate scheduled emissions. Tokenize the stream and trade it like any other instrument.
          </div>
        </div>

        <div className="bg-bg-elevated rounded-[1.2vh] p-[3vh] border border-border h-[44vh] flex flex-col">
          <div className="font-mono text-[1.1vw] text-primary tracking-widest">04</div>
          <div className="mt-[1.5vh] font-display font-bold text-[2.2vw] leading-tight text-text">
            Tokenized RWA &amp; Bonds
          </div>
          <div className="mt-[2vh] text-[1.4vw] text-muted leading-snug">
            Treasury bills, private credit and on-chain bonds with deterministic coupons fit Minke natively &mdash; one rail for all DRI.
          </div>
        </div>
      </div>
    </div>
  );
}
