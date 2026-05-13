const base = import.meta.env.BASE_URL;

export default function Cover() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 80% 50%, rgba(24,95,234,0.35) 0%, rgba(24,95,234,0) 60%), radial-gradient(ellipse 50% 50% at 0% 100%, rgba(74,138,255,0.18) 0%, rgba(0,0,0,0) 50%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #4A8AFF 1px, transparent 1px), linear-gradient(to bottom, #4A8AFF 1px, transparent 1px)",
          backgroundSize: "8vh 8vh",
        }}
      />

      <div className="absolute top-[5vh] left-[5vw] flex items-center gap-[1vw]">
        <img
          src={`${base}minke-logo.svg`}
          crossOrigin="anonymous"
          alt="Minke Finance"
          className="h-[4.5vh] w-auto"
        />
      </div>

      <div className="absolute top-[5vh] right-[5vw] font-mono text-[1.5vw] text-muted tracking-wider">
        MINKE FINANCE / 2026
      </div>

      <div className="absolute left-[5vw] top-[28vh] max-w-[55vw]">
        <div className="font-mono text-[1.4vw] text-primary tracking-[0.3em] mb-[3vh]">
          DEFI LIQUIDITY INFRASTRUCTURE
        </div>
        <h1 className="font-display font-bold text-[7vw] leading-[0.95] tracking-[-0.04em] text-text">
          Unlocking
        </h1>
        <h1 className="font-display font-bold text-[7vw] leading-[0.95] tracking-[-0.04em] text-text">
          the Value of
        </h1>
        <h1 className="font-display font-bold text-[7vw] leading-[0.95] tracking-[-0.04em] text-primary">
          Locked Assets.
        </h1>
        <p className="mt-[5vh] text-[1.8vw] text-muted max-w-[45vw] leading-snug">
          A protocol turning vesting tokens, SAFTs, node licenses and other
          time-locked assets into liquid, tradable on-chain instruments.
        </p>
      </div>

      <img
        src={`${base}hero-illustration.png`}
        crossOrigin="anonymous"
        alt=""
        className="absolute right-[4vw] top-1/2 -translate-y-1/2 h-[70vh] w-auto opacity-90"
      />

      <div className="absolute bottom-[4vh] left-[5vw] right-[5vw] flex justify-between items-end">
        <div className="font-mono text-[1.3vw] text-muted tracking-wider">
          minke.finance
        </div>
        <div className="font-mono text-[1.3vw] text-muted tracking-wider">
          INVESTOR &amp; PARTNER DECK
        </div>
      </div>
    </div>
  );
}
