const base = import.meta.env.BASE_URL;

export default function DRI() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 0% 50%, rgba(24,95,234,0.2) 0%, rgba(0,0,0,0) 55%)",
        }}
      />

      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.5vh] w-auto opacity-80" />
        <div className="font-mono text-[1.2vw] text-muted tracking-widest">03 / CONCEPT</div>
      </div>

      <div className="absolute left-[5vw] top-[14vh] max-w-[42vw]">
        <div className="font-mono text-[1.3vw] text-primary tracking-[0.3em] mb-[2.5vh]">A NEW ASSET CLASS</div>
        <h2 className="font-display font-bold text-[6vw] leading-[0.95] tracking-tight text-text">
          DRI.
        </h2>
        <div className="mt-[1vh] font-display font-medium text-[2.4vw] leading-tight text-text/90">
          Deterministic Future Income.
        </div>
        <p className="mt-[3vh] text-[1.6vw] text-muted leading-snug">
          Any on-chain position whose future cash flow is fixed by contract &mdash; the amount and the schedule are both knowable today.
        </p>
        <div className="mt-[3vh] inline-block bg-primary/15 border border-primary/40 rounded-[0.8vh] px-[1.4vw] py-[1.2vh] font-mono text-[1.3vw] text-primary">
          Minke&rsquo;s original framework.
        </div>
      </div>

      <div className="absolute right-[5vw] top-[16vh] bottom-[8vh] w-[42vw] flex flex-col gap-[2vh]">
        <div className="flex-1 bg-bg-elevated border-l-[0.4vw] border-primary rounded-[1vh] p-[3vh] flex flex-col justify-center">
          <div className="font-mono text-[1.1vw] text-primary tracking-widest mb-[1vh]">DRI &mdash; DETERMINISTIC</div>
          <div className="font-display font-bold text-[2.6vw] leading-tight text-text">
            Fixed amount. Fixed schedule.
          </div>
          <div className="mt-[1.5vh] text-[1.5vw] text-muted leading-snug">
            SAFTs, team and advisor vesting, node licenses, scheduled treasury unlocks, on-chain bonds and tokenized fixed-income RWA.
          </div>
        </div>
        <div className="flex-1 bg-bg-elevated border-l-[0.4vw] border-muted/40 rounded-[1vh] p-[3vh] flex flex-col justify-center">
          <div className="font-mono text-[1.1vw] text-muted tracking-widest mb-[1vh]">NON-DRI &mdash; VARIABLE</div>
          <div className="font-display font-bold text-[2.6vw] leading-tight text-text">
            Yield depends on market state.
          </div>
          <div className="mt-[1.5vh] text-[1.5vw] text-muted leading-snug">
            Staking rewards, LP fees, lending APY, liquid restaking yield &mdash; predictable in shape, not in size.
          </div>
        </div>
      </div>
    </div>
  );
}
