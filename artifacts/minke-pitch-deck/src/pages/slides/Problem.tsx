const base = import.meta.env.BASE_URL;

export default function Problem() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-minke-soft">
      <div className="absolute inset-0 bg-minke-dot opacity-50" />

      {/* Giant divider text */}
      <div className="absolute right-[2vw] top-[8vh] divider-text text-[18vw] pointer-events-none select-none">
        PROBLEM
      </div>

      {/* Top bar */}
      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.8vh] w-auto" />
        <div className="font-mono text-[1.1vw] text-muted tracking-widest">01 / PROBLEM</div>
      </div>

      {/* Title + illustration */}
      <div className="absolute left-[5vw] right-[5vw] top-[15vh] grid grid-cols-12 gap-[2vw] items-center">
        <div className="col-span-7">
          <div className="font-mono text-[1.2vw] text-primary tracking-[0.3em] mb-[2.5vh]">THE PROBLEM</div>
          <h2 className="font-display font-extrabold text-[5vw] leading-[0.98] tracking-tight text-text" style={{ textWrap: "balance" }}>
            Trillions of{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(120deg, #0088FE 0%, #59B9FF 100%)" }}
            >
              future income
            </span>{" "}
            on-chain &mdash; still without a Present Value rail.
          </h2>
        </div>
        <div className="col-span-5 flex justify-center">
          <img src={`${base}illus-problem.png`} crossOrigin="anonymous" alt="" className="h-[44vh] w-auto" />
        </div>
      </div>

      {/* Three problem cards */}
      <div className="absolute left-[5vw] right-[5vw] bottom-[6vh] grid grid-cols-3 gap-[1.8vw]">
        {[
          {
            t: "No Present Value",
            d: "SAFTs, vesting, staking and node emissions all promise tomorrow's tokens — holders cannot price, sell or use that value today.",
          },
          {
            t: "No Hedging or Collateral",
            d: "These positions sit off-balance-sheet. No way to hedge, no way to borrow against them, no way to recycle capital while waiting for payout.",
          },
          {
            t: "Broken Price Discovery",
            d: "FDV runs orders of magnitude above circulating cap. Spot markets price phantom supply; future-income holders price nothing at all.",
          },
        ].map((c, i) => (
          <div key={i} className="bg-bg-elevated rounded-[1.6vh] p-[2.5vh] border border-border shadow-[0_8px_24px_rgba(0,136,254,0.06)]">
            <div className="font-mono text-[1vw] text-primary tracking-widest">0{i + 1}</div>
            <div className="mt-[1.4vh] font-display font-extrabold text-[2.4vw] leading-tight text-text">{c.t}</div>
            <div className="mt-[1.4vh] text-[1.3vw] text-muted leading-snug">{c.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
