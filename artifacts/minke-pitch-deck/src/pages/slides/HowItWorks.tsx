const base = import.meta.env.BASE_URL;

const steps = [
  {
    n: "01",
    img: "illus-step-1.png",
    t: "Deposit a DFI position",
    d: "SAFT contract, vesting schedule, staking position, node license or RWA bond. The factory mints a position NFT.",
  },
  {
    n: "02",
    img: "illus-step-2.png",
    t: "Receive VT instantly",
    d: "Stake the NFT and mint VT — a fungible, tradable representation of the future tokens that position will deliver.",
  },
  {
    n: "03",
    img: "illus-step-3.png",
    t: "Trade, hold or claim",
    d: "Sell VT for instant present value, hold for upside, or claim the underlying tokens as the schedule plays out.",
  },
  {
    n: "04",
    img: "illus-step-4.png",
    t: "1:1 redemption claim",
    d: "Each VT has a corresponding underlying token. Whenever income is realized, VT holders redeem 1:1 — no oracles, no haircuts, no counterparty.",
    primary: true,
  },
];

export default function HowItWorks() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-minke-soft">
      <div className="absolute inset-0 bg-minke-dot opacity-40" />
      <div className="absolute right-[2vw] top-[5vh] divider-text text-[12vw] pointer-events-none select-none leading-none">
        HOW IT
        <br />
        WORKS
      </div>
      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.8vh] w-auto" />
        <div className="font-mono text-[1.1vw] text-muted tracking-widest">05 / HOW IT WORKS</div>
      </div>
      <div className="absolute left-[5vw] top-[14vh]">
        <div className="font-mono text-[1.2vw] text-primary tracking-[0.3em] mb-[2vh]">FROM FUTURE TO PRESENT</div>
        <h2 className="font-display font-extrabold text-[4vw] leading-none tracking-tight text-text">
          Four steps.
        </h2>
      </div>
      <div className="absolute left-[5vw] right-[5vw] bottom-[6vh] grid grid-cols-4 gap-[1.4vw]">
        {steps.map((s) => (
          <div
            key={s.n}
            className={
              s.primary
                ? "relative rounded-[1.4vh] p-[2.5vh] border-2 border-primary flex flex-col h-[52vh] shadow-[0_16px_36px_rgba(0,136,254,0.2)] text-white overflow-hidden"
                : "relative rounded-[1.4vh] p-[2.5vh] border border-border bg-bg-elevated flex flex-col h-[52vh] shadow-[0_8px_24px_rgba(0,136,254,0.06)]"
            }
            style={
              s.primary
                ? { background: "linear-gradient(160deg, #0088FE 0%, #59B9FF 100%)" }
                : undefined
            }
          >
            <div className="flex items-center justify-between">
              <div className={`font-mono text-[1.3vw] tracking-widest ${s.primary ? "text-white/90" : "text-primary"}`}>{s.n}</div>
              <img src={`${base}${s.img}`} crossOrigin="anonymous" alt="" className="h-[14vh] w-auto" />
            </div>
            <div className={`mt-[2vh] font-display font-extrabold text-[1.85vw] leading-tight min-h-[5.2vh] ${s.primary ? "text-white" : "text-text"}`}>
              {s.t}
            </div>
            <div className={`mt-[1.4vh] text-[1.25vw] leading-snug ${s.primary ? "text-white/90" : "text-muted"}`}>
              {s.d}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
