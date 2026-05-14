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
            Trillions are{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(120deg, #0088FE 0%, #59B9FF 100%)" }}
            >
              locked
            </span>{" "}
            on-chain &mdash; and stuck there.
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
            t: "SAFTs & Vesting",
            d: "VCs, teams and advisors hold tokens that vest over years. Capital is dead until each cliff unlocks.",
          },
          {
            t: "No Hedging",
            d: "Holders cannot exit, hedge, or borrow against locked positions — price risk runs unmitigated for years.",
          },
          {
            t: "Broken Price Discovery",
            d: "FDV vastly exceeds circulating cap. Markets price phantom supply; locked holders price nothing at all.",
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
