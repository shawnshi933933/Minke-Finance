const base = import.meta.env.BASE_URL;

export default function Vision() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(24,95,234,0.28) 0%, rgba(0,0,0,0) 65%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #4A8AFF 1px, transparent 1px), linear-gradient(to bottom, #4A8AFF 1px, transparent 1px)",
          backgroundSize: "10vh 10vh",
        }}
      />

      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.5vh] w-auto opacity-80" />
        <div className="font-mono text-[1.2vw] text-muted tracking-widest">08 / VISION</div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] top-[28vh]">
        <div className="font-mono text-[1.3vw] text-primary tracking-[0.3em] mb-[3vh]">VISION</div>
        <h2 className="font-display font-bold text-[7vw] leading-[0.95] tracking-[-0.03em] text-text max-w-[80vw]" style={{ textWrap: "balance" }}>
          The liquidity layer for every <span className="text-primary">locked token</span> on-chain.
        </h2>
        <p className="mt-[5vh] text-[1.9vw] text-muted leading-snug max-w-[70vw]">
          Minke makes Deterministic Future Income a first-class asset class &mdash; tradable, composable, and ubiquitous across every chain that issues vesting tokens.
        </p>
      </div>

      <div className="absolute bottom-[6vh] left-[5vw] right-[5vw] grid grid-cols-3 gap-[2vw]">
        <div className="border-t border-primary pt-[2vh]">
          <div className="font-display font-bold text-[2.2vw] leading-tight text-text">Universal standard</div>
          <div className="mt-[1vh] text-[1.4vw] text-muted leading-snug">One ERC for every vesting position, every chain.</div>
        </div>
        <div className="border-t border-primary pt-[2vh]">
          <div className="font-display font-bold text-[2.2vw] leading-tight text-text">Composable liquidity</div>
          <div className="mt-[1vh] text-[1.4vw] text-muted leading-snug">VT and YT plug into lending, AMMs, and structured products.</div>
        </div>
        <div className="border-t border-primary pt-[2vh]">
          <div className="font-display font-bold text-[2.2vw] leading-tight text-text">Capital efficiency</div>
          <div className="mt-[1vh] text-[1.4vw] text-muted leading-snug">Trillions of dormant value, finally productive.</div>
        </div>
      </div>
    </div>
  );
}
