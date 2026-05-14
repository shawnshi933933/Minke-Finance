const base = import.meta.env.BASE_URL;

export default function Cover() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-minke-hero">
      <div className="absolute inset-0 bg-minke-dot opacity-60" />

      {/* Top bar */}
      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex items-center justify-between">
        <div className="flex items-center gap-[1vw]">
          <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[5vh] w-auto" />
          <div className="font-display font-bold text-[1.6vw] text-text tracking-tight">Minke Finance</div>
        </div>
        <div className="font-mono text-[1.1vw] text-muted tracking-wider">MINKE FINANCE / 2026</div>
      </div>

      {/* Eyebrow */}
      <div className="absolute left-[5vw] top-[24vh] max-w-[58vw]">
        <div className="font-mono text-[1.2vw] text-primary tracking-[0.32em] mb-[2.5vh]">
          DEFI LIQUIDITY INFRASTRUCTURE
        </div>
        <h1 className="font-display font-extrabold text-[7vw] leading-[0.92] tracking-[-0.04em] text-text">
          Unlocking
        </h1>
        <h1 className="font-display font-extrabold text-[7vw] leading-[0.92] tracking-[-0.04em] text-text">
          the Value of
        </h1>
        <h1
          className="font-display font-extrabold text-[7vw] leading-[0.92] tracking-[-0.04em] bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(120deg, #0088FE 0%, #59B9FF 100%)" }}
        >
          Locked Assets.
        </h1>
        <p className="mt-[4vh] text-[1.55vw] text-muted max-w-[48vw] leading-snug">
          A protocol turning vesting tokens, SAFTs, node licenses and other time-locked assets
          into liquid, tradable on-chain instruments.
        </p>
      </div>

      {/* Hero whale logo on the right */}
      <img
        src={`${base}minke-logo.svg`}
        crossOrigin="anonymous"
        alt=""
        className="absolute right-[6vw] top-1/2 -translate-y-1/2 h-[62vh] w-auto drop-shadow-[0_30px_60px_rgba(0,136,254,0.25)]"
      />

      {/* Bottom bar */}
      <div className="absolute bottom-[4vh] left-[5vw] right-[5vw] flex justify-between items-center font-mono text-[1.1vw] text-muted tracking-wider">
        <div>minke.finance</div>
        <div>INVESTOR &amp; PARTNER DECK</div>
      </div>
    </div>
  );
}
