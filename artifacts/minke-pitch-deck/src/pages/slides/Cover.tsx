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

      {/* Eyebrow + headline */}
      <div className="absolute left-[5vw] top-[20vh] max-w-[48vw]">
        <div className="font-mono text-[1.2vw] text-primary tracking-[0.32em] mb-[2.5vh]">
          FUTURE INCOME &rarr; PRESENT VALUE
        </div>
        <h1 className="font-display font-extrabold text-[6vw] leading-[0.98] tracking-[-0.04em] text-text">
          Unravel
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(120deg, #0088FE 0%, #59B9FF 100%)" }}
          >
            time value
          </span>
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(120deg, #0088FE 0%, #59B9FF 100%)" }}
          >
            of money
          </span>
          <br />
          onchain.
        </h1>
        <p className="mt-[3.5vh] text-[1.45vw] text-muted max-w-[42vw] leading-snug">
          A protocol that turns deterministic future income &mdash; SAFTs, vesting, staking,
          mining, fixed-term saving and bonds &mdash; into present value, tradable on-chain today.
        </p>
      </div>

      {/* Hero illustration on the right */}
      <img
        src={`${base}illus-cover-calendar-whale-v1.png`}
        crossOrigin="anonymous"
        alt=""
        className="absolute right-[3vw] top-1/2 -translate-y-1/2 h-[88vh] w-auto drop-shadow-[0_30px_60px_rgba(0,136,254,0.22)]"
      />

      {/* Bottom bar */}
      <div className="absolute bottom-[4vh] left-[5vw] right-[5vw] flex justify-between items-center font-mono text-[1.1vw] text-muted tracking-wider">
        <div>minke.finance</div>
        <div>INVESTOR &amp; PARTNER DECK</div>
      </div>
    </div>
  );
}
