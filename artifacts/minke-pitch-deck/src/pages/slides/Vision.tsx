const base = import.meta.env.BASE_URL;

export default function Vision() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-minke-hero">
      <div className="absolute inset-0 bg-minke-dot opacity-50" />

      <div className="absolute left-[2vw] top-[5vh] divider-text text-[20vw] pointer-events-none select-none">
        VISION
      </div>

      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.8vh] w-auto" />
        <div className="font-mono text-[1.1vw] text-muted tracking-widest">08 / VISION</div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] top-[22vh] grid grid-cols-12 gap-[2vw] items-center">
        <div className="col-span-7">
          <div className="font-mono text-[1.2vw] text-primary tracking-[0.3em] mb-[2vh]">VISION</div>
          <h2 className="font-display font-extrabold text-[6vw] leading-[0.92] tracking-[-0.03em] text-text" style={{ textWrap: "balance" }}>
            The liquidity layer for every{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(120deg, #0088FE 0%, #59B9FF 100%)" }}
            >
              locked token
            </span>{" "}
            on-chain.
          </h2>
          <p className="mt-[3vh] text-[1.6vw] text-muted leading-snug max-w-[55vw]">
            Minke makes Deterministic Future Income a first-class asset class &mdash; tradable,
            composable, and ubiquitous across every chain that issues vesting tokens.
          </p>
        </div>
        <div className="col-span-5 flex justify-center">
          <img
            src={`${base}illus-vision.png`}
            crossOrigin="anonymous"
            alt=""
            className="h-[44vh] w-auto drop-shadow-[0_30px_60px_rgba(0,136,254,0.2)]"
          />
        </div>
      </div>

      <div className="absolute bottom-[5vh] left-[5vw] right-[5vw] grid grid-cols-3 gap-[2vw]">
        {[
          { t: "Universal standard", d: "One ERC for every vesting position, every chain." },
          { t: "Composable liquidity", d: "VT and YT plug into lending, AMMs, and structured products." },
          { t: "Capital efficiency", d: "Trillions of dormant value, finally productive." },
        ].map((c) => (
          <div key={c.t} className="border-t-2 border-primary pt-[1.8vh]">
            <div className="font-display font-extrabold text-[2vw] leading-tight text-text">{c.t}</div>
            <div className="mt-[1vh] text-[1.3vw] text-muted leading-snug">{c.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
