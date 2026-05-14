const base = import.meta.env.BASE_URL;

export default function Market() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-minke-hero">
      <div className="absolute inset-0 bg-minke-dot opacity-40" />

      <div className="absolute left-[2vw] top-[6vh] divider-text text-[16vw] pointer-events-none select-none">
        MARKET
      </div>

      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.8vh] w-auto" />
        <div className="font-mono text-[1.1vw] text-muted tracking-widest">02 / MARKET</div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] top-[14vh] grid grid-cols-12 gap-[2vw] items-start">
        <div className="col-span-7">
          <div className="font-mono text-[1.2vw] text-primary tracking-[0.3em] mb-[2.5vh]">MARKET OPPORTUNITY</div>
          <h2 className="font-display font-extrabold text-[4.6vw] leading-[0.98] tracking-tight text-text" style={{ textWrap: "balance" }}>
            The Future Income market across DeFi.
          </h2>
          <p className="mt-[2.5vh] text-[1.5vw] text-muted leading-snug max-w-[52vw]">
            Vesting pipelines, staking and restaking floats, mining and node emissions, fixed-term
            savings and on-chain bonds all share one shape: tomorrow&rsquo;s cash flow with no rail
            for today&rsquo;s value. That is the Future Income TAM.
          </p>
        </div>
        <div className="col-span-5 flex justify-center">
          <img src={`${base}illus-market.png`} crossOrigin="anonymous" alt="" className="h-[46vh] w-auto" />
        </div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[6vh] grid grid-cols-4 gap-[1.4vw]">
        {[
          { l: "VESTING & SAFTs", v: "~$200B", d: "Token unlock pipeline already scheduled across major projects through 2026.", primary: false },
          { l: "STAKING & RESTAKING", v: "~$500B", d: "ETH, SOL and restaked float earning predictable, schedule-driven rewards.", primary: false },
          { l: "MINING & NODE EMISSIONS", v: "~$50B / yr", d: "BTC, DePIN, AI and L1 node licenses generating rule-based emissions.", primary: false },
          { l: "FUTURE INCOME TAM", v: "$1T+", d: "Total addressable future income — including fixed-term savings, RWA bonds and tokenizable yield streams.", primary: true },
        ].map((c, i) => (
          <div
            key={i}
            className={
              c.primary
                ? "rounded-[1.4vh] p-[2.4vh] border-2 border-primary shadow-[0_12px_32px_rgba(0,136,254,0.18)]"
                : "rounded-[1.4vh] p-[2.4vh] border border-border bg-bg-elevated shadow-[0_8px_24px_rgba(0,136,254,0.06)]"
            }
            style={
              c.primary
                ? { background: "linear-gradient(135deg, #0088FE 0%, #59B9FF 100%)" }
                : undefined
            }
          >
            <div className={`font-mono text-[1vw] tracking-widest ${c.primary ? "text-white/85" : "text-muted"}`}>
              {c.l}
            </div>
            <div
              className={`mt-[1.4vh] font-display font-extrabold text-[3vw] leading-none ${c.primary ? "text-white" : "text-text"}`}
            >
              {c.v}
            </div>
            <div className={`mt-[1vh] text-[1.15vw] leading-snug ${c.primary ? "text-white/90" : "text-muted"}`}>{c.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
