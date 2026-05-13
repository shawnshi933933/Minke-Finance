const base = import.meta.env.BASE_URL;

export default function Contact() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 100% 50%, rgba(24,95,234,0.32) 0%, rgba(0,0,0,0) 60%), radial-gradient(ellipse 40% 50% at 0% 0%, rgba(74,138,255,0.16) 0%, rgba(0,0,0,0) 55%)",
        }}
      />

      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.5vh] w-auto opacity-80" />
        <div className="font-mono text-[1.2vw] text-muted tracking-widest">09 / CONTACT</div>
      </div>

      <div className="absolute left-[5vw] top-[24vh] max-w-[55vw]">
        <div className="font-mono text-[1.3vw] text-primary tracking-[0.3em] mb-[3vh]">LET&rsquo;S BUILD THE LIQUIDITY LAYER.</div>
        <h2 className="font-display font-bold text-[6.5vw] leading-[0.95] tracking-[-0.03em] text-text" style={{ textWrap: "balance" }}>
          Talk to us.
        </h2>
        <p className="mt-[3vh] text-[1.7vw] text-muted leading-snug max-w-[45vw]">
          Open to investors, ecosystem partners, integrations, and projects with deterministic future income to unlock.
        </p>
      </div>

      <div className="absolute right-[5vw] top-[26vh] bottom-[10vh] w-[34vw] flex flex-col gap-[2vh] justify-center">
        <div className="bg-bg-elevated rounded-[1vh] p-[2.5vh] border border-border">
          <div className="font-mono text-[1.1vw] text-muted tracking-widest">WEBSITE</div>
          <a href="https://minke.finance" target="_blank" rel="noopener noreferrer" className="mt-[1vh] block font-display font-semibold text-[2.4vw] leading-none text-text hover:text-primary">
            minke.finance
          </a>
        </div>
        <div className="bg-bg-elevated rounded-[1vh] p-[2.5vh] border border-border">
          <div className="font-mono text-[1.1vw] text-muted tracking-widest">TWITTER / X</div>
          <a href="https://x.com/minkefinance" target="_blank" rel="noopener noreferrer" className="mt-[1vh] block font-display font-semibold text-[2.4vw] leading-none text-text hover:text-primary">
            @minkefinance
          </a>
        </div>
        <div className="bg-primary/15 rounded-[1vh] p-[2.5vh] border border-primary">
          <div className="font-mono text-[1.1vw] text-primary tracking-widest">EMAIL</div>
          <a href="mailto:hello@minke.finance" className="mt-[1vh] block font-display font-semibold text-[2.4vw] leading-none text-text hover:text-primary">
            hello@minke.finance
          </a>
        </div>
      </div>

      <div className="absolute bottom-[4vh] left-[5vw] right-[5vw] flex justify-between items-center font-mono text-[1.2vw] text-muted tracking-wider">
        <div>MINKE FINANCE / 2026</div>
        <div>UNLOCKING THE VALUE OF LOCKED ASSETS.</div>
      </div>
    </div>
  );
}
