const base = import.meta.env.BASE_URL;

export default function DFI() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-minke-soft">
      <div className="absolute inset-0 bg-minke-dot opacity-40" />
      <div className="absolute right-[2vw] top-[6vh] divider-text text-[18vw] pointer-events-none select-none">
        DFI
      </div>
      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.8vh] w-auto" />
        <div className="font-mono text-[1.1vw] text-muted tracking-widest">03 / CONCEPT</div>
      </div>
      <div className="absolute left-[5vw] top-[14vh] max-w-[44vw]">
        <div className="font-mono text-[1.2vw] text-primary tracking-[0.3em] mb-[2.5vh]">A NEW ASSET CLASS</div>
        <h2 className="font-display font-extrabold text-[6vw] leading-[0.92] tracking-tight text-text">DFI.</h2>
        <div className="mt-[1vh] font-display font-semibold text-[2.3vw] leading-tight text-text/85">
          Deterministic Future Income.
        </div>
        <p className="mt-[3vh] text-[1.5vw] text-muted leading-snug">
          We are defining a new asset class in DFI, a stream of expected future payments with clear
          schedule and amounts.
        </p>
        <div
          className="mt-[3vh] inline-block rounded-[0.8vh] px-[1.4vw] py-[1.2vh] font-mono text-[1.2vw] text-white shadow-[0_8px_20px_rgba(0,136,254,0.25)]"
          style={{ background: "linear-gradient(120deg, #0088FE 0%, #59B9FF 100%)" }}
        >
          Minke&rsquo;s original framework.
        </div>
      </div>
      <div className="absolute right-[5vw] top-[16vh] bottom-[8vh] w-[44vw] flex flex-col gap-[2vh]">
        <img src={`${base}illus-dri.png`} crossOrigin="anonymous" alt="" className="absolute -top-[4vh] right-0 w-[50vw] opacity-90 pointer-events-none" />

        <div className="relative flex-1 bg-bg-elevated border-l-[0.5vw] border-primary rounded-[1.4vh] p-[3vh] flex flex-col justify-center shadow-[0_8px_24px_rgba(0,136,254,0.08)]">
          <div className="font-mono text-[1vw] text-primary tracking-widest mb-[1vh]">DFI — DETERMINISTIC FUTURE INCOME</div>
          <div className="font-display font-extrabold text-[2.4vw] leading-tight text-text">
            Predictable amount. Regular schedule.
          </div>
          <div className="mt-[1.4vh] text-[1.4vw] text-muted leading-snug">
            SAFTs, team and advisor vesting, scheduled treasury unlocks, fixed-term staking
            rewards, node licenses, on-chain bonds and tokenized fixed-income RWA.
          </div>
        </div>
        <div className="relative flex-1 bg-bg-elevated border-l-[0.5vw] border-muted/40 rounded-[1.4vh] p-[3vh] flex flex-col justify-center shadow-[0_8px_24px_rgba(0,136,254,0.05)]">
          <div className="font-mono text-[1vw] text-muted tracking-widest mb-[1vh]">VFI &mdash; VARIABLE FUTURE INCOME</div>
          <div className="font-display font-extrabold text-[2.4vw] leading-tight text-text">
            Yield that varies.
          </div>
          <div className="mt-[1.4vh] text-[1.4vw] text-muted leading-snug">
            Yield-farming returns, variable lending APY, governance-token rewards, NFT royalties
            &mdash; size and timing both shaped by the market.
          </div>
        </div>
      </div>
    </div>
  );
}
