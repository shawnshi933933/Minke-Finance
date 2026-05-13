const base = import.meta.env.BASE_URL;

export default function Market() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 100% 0%, rgba(24,95,234,0.22) 0%, rgba(0,0,0,0) 60%)",
        }}
      />

      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.5vh] w-auto opacity-80" />
        <div className="font-mono text-[1.2vw] text-muted tracking-widest">02 / MARKET</div>
      </div>

      <div className="absolute left-[5vw] top-[14vh] max-w-[60vw]">
        <div className="font-mono text-[1.3vw] text-primary tracking-[0.3em] mb-[2.5vh]">MARKET OPPORTUNITY</div>
        <h2 className="font-display font-bold text-[5vw] leading-[0.98] tracking-tight text-text" style={{ textWrap: "balance" }}>
          The FDV &mdash; Market Cap Gap.
        </h2>
        <p className="mt-[2.5vh] text-[1.7vw] text-muted leading-snug max-w-[55vw]">
          Across the crypto market, fully diluted valuation exceeds circulating market cap by orders of magnitude. That gap is dormant capital waiting for a liquidity rail.
        </p>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[6vh]">
        <div className="grid grid-cols-4 gap-[1.5vw]">
          <div className="bg-bg-elevated rounded-[1vh] p-[2.5vh] border border-border">
            <div className="font-mono text-[1.1vw] text-muted tracking-widest">CIRCULATING MC</div>
            <div className="mt-[1.5vh] font-display font-bold text-[3.8vw] leading-none text-text">~$2.5T</div>
            <div className="mt-[1vh] text-[1.3vw] text-muted leading-snug">Total crypto market cap, on-chain liquid supply.</div>
          </div>
          <div className="bg-bg-elevated rounded-[1vh] p-[2.5vh] border border-border">
            <div className="font-mono text-[1.1vw] text-muted tracking-widest">FULLY DILUTED VAL.</div>
            <div className="mt-[1.5vh] font-display font-bold text-[3.8vw] leading-none text-text">~$4T+</div>
            <div className="mt-[1vh] text-[1.3vw] text-muted leading-snug">Market cap if every locked token were live today.</div>
          </div>
          <div className="bg-primary/15 rounded-[1vh] p-[2.5vh] border border-primary">
            <div className="font-mono text-[1.1vw] text-primary tracking-widest">THE GAP</div>
            <div className="mt-[1.5vh] font-display font-bold text-[3.8vw] leading-none text-primary">$1.5T+</div>
            <div className="mt-[1vh] text-[1.3vw] text-text/80 leading-snug">Locked, illiquid, and unaddressable by spot markets.</div>
          </div>
          <div className="bg-bg-elevated rounded-[1vh] p-[2.5vh] border border-border">
            <div className="font-mono text-[1.1vw] text-muted tracking-widest">2024-25 UNLOCKS</div>
            <div className="mt-[1.5vh] font-display font-bold text-[3.8vw] leading-none text-text">$150B</div>
            <div className="mt-[1vh] text-[1.3vw] text-muted leading-snug">Token unlock pipeline already scheduled across major projects.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
