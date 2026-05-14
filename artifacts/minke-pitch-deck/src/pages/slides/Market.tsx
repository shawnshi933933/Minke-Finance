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
            The FDV &mdash; Market Cap Gap.
          </h2>
          <p className="mt-[2.5vh] text-[1.5vw] text-muted leading-snug max-w-[52vw]">
            Across the crypto market, fully diluted valuation exceeds circulating market cap by orders
            of magnitude. That gap is dormant capital waiting for a liquidity rail.
          </p>
        </div>
        <div className="col-span-5 flex justify-center">
          <img src={`${base}illus-market.png`} crossOrigin="anonymous" alt="" className="h-[36vh] w-auto" />
        </div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[6vh] grid grid-cols-4 gap-[1.4vw]">
        {[
          { l: "CIRCULATING MC", v: "~$2.5T", d: "Total crypto market cap, on-chain liquid supply.", primary: false },
          { l: "FULLY DILUTED VAL.", v: "~$4T+", d: "Market cap if every locked token were live today.", primary: false },
          { l: "THE GAP", v: "$1.5T+", d: "Locked, illiquid, and unaddressable by spot markets.", primary: true },
          { l: "2024-25 UNLOCKS", v: "$150B", d: "Token unlock pipeline already scheduled across major projects.", primary: false },
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
              className={`mt-[1.4vh] font-display font-extrabold text-[3.4vw] leading-none ${c.primary ? "text-white" : "text-text"}`}
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
