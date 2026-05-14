const base = import.meta.env.BASE_URL;

export default function Contact() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-minke-hero">
      <div className="absolute inset-0 bg-minke-dot opacity-40" />

      <div className="absolute right-[1vw] bottom-[2vh] divider-text text-[14vw] pointer-events-none select-none leading-none">
        TALK
        <br />
        TO US
      </div>

      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.8vh] w-auto" />
        <div className="font-mono text-[1.1vw] text-muted tracking-widest">09 / CONTACT</div>
      </div>

      <div className="absolute left-[5vw] top-[20vh] max-w-[58vw]">
        <div className="font-mono text-[1.2vw] text-primary tracking-[0.3em] mb-[2.5vh]">
          LET&rsquo;S BUILD THE LIQUIDITY LAYER.
        </div>
        <h2
          className="font-display font-extrabold text-[6.5vw] leading-[0.92] tracking-[-0.03em] bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(120deg, #0A1530 0%, #0088FE 100%)" }}
        >
          Talk to us.
        </h2>
        <p className="mt-[3vh] text-[1.55vw] text-muted leading-snug max-w-[48vw]">
          Open to investors, ecosystem partners, integrations, and projects with deterministic
          future income to unlock.
        </p>
      </div>

      <div className="absolute right-[5vw] top-[22vh] bottom-[12vh] w-[34vw] flex flex-col gap-[1.8vh] justify-center">
        <div className="bg-bg-elevated rounded-[1.2vh] p-[2.4vh] border border-border shadow-[0_8px_24px_rgba(0,136,254,0.08)]">
          <div className="font-mono text-[1vw] text-muted tracking-widest">WEBSITE</div>
          <a href="https://minke.finance" target="_blank" rel="noopener noreferrer" className="mt-[1vh] block font-display font-extrabold text-[2.3vw] leading-none text-text hover:text-primary">
            minke.finance
          </a>
        </div>
        <div className="bg-bg-elevated rounded-[1.2vh] p-[2.4vh] border border-border shadow-[0_8px_24px_rgba(0,136,254,0.08)]">
          <div className="font-mono text-[1vw] text-muted tracking-widest">TWITTER / X</div>
          <a href="https://x.com/minkefinance" target="_blank" rel="noopener noreferrer" className="mt-[1vh] block font-display font-extrabold text-[2.3vw] leading-none text-text hover:text-primary">
            @minkefinance
          </a>
        </div>
        <div
          className="rounded-[1.2vh] p-[2.4vh] border-2 border-primary shadow-[0_16px_40px_rgba(0,136,254,0.25)] text-white"
          style={{ background: "linear-gradient(120deg, #0088FE 0%, #59B9FF 100%)" }}
        >
          <div className="font-mono text-[1vw] text-white/85 tracking-widest">EMAIL</div>
          <a href="mailto:hello@minke.finance" className="mt-[1vh] block font-display font-extrabold text-[2.3vw] leading-none text-white hover:opacity-90">
            hello@minke.finance
          </a>
        </div>
      </div>

      <div className="absolute bottom-[4vh] left-[5vw] right-[5vw] flex justify-between items-center font-mono text-[1.1vw] text-muted tracking-wider">
        <div>MINKE FINANCE / 2026</div>
        <div>UNLOCKING THE VALUE OF LOCKED ASSETS.</div>
      </div>
    </div>
  );
}
