const base = import.meta.env.BASE_URL;

export default function Problem() {
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
        <div className="font-mono text-[1.2vw] text-muted tracking-widest">01 / PROBLEM</div>
      </div>

      <div className="absolute left-[5vw] top-[16vh] max-w-[55vw]">
        <div className="font-mono text-[1.3vw] text-primary tracking-[0.3em] mb-[2.5vh]">THE PROBLEM</div>
        <h2 className="font-display font-bold text-[5.5vw] leading-[0.98] tracking-tight text-text" style={{ textWrap: "balance" }}>
          Trillions of dollars are <span className="text-primary">locked</span> on-chain &mdash; and stuck there.
        </h2>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[8vh] grid grid-cols-3 gap-[2vw]">
        <div className="border-l-2 border-primary pl-[1.5vw]">
          <div className="font-display font-bold text-[3.2vw] leading-none text-text">SAFTs &amp; Vesting</div>
          <div className="mt-[1.5vh] text-[1.5vw] text-muted leading-snug">
            VCs, teams and advisors hold tokens that vest over years. Capital is dead until each cliff unlocks.
          </div>
        </div>
        <div className="border-l-2 border-primary pl-[1.5vw]">
          <div className="font-display font-bold text-[3.2vw] leading-none text-text">No Hedging</div>
          <div className="mt-[1.5vh] text-[1.5vw] text-muted leading-snug">
            Holders cannot exit, hedge, or borrow against locked positions &mdash; price risk runs unmitigated for years.
          </div>
        </div>
        <div className="border-l-2 border-primary pl-[1.5vw]">
          <div className="font-display font-bold text-[3.2vw] leading-none text-text">Broken Price Discovery</div>
          <div className="mt-[1.5vh] text-[1.5vw] text-muted leading-snug">
            FDV vastly exceeds circulating cap. Markets price phantom supply; locked holders price nothing at all.
          </div>
        </div>
      </div>
    </div>
  );
}
