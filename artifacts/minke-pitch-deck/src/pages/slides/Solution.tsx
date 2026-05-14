const base = import.meta.env.BASE_URL;

export default function Solution() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-minke-hero">
      <div className="absolute inset-0 bg-minke-dot opacity-40" />

      <div className="absolute left-[2vw] top-[6vh] divider-text text-[16vw] pointer-events-none select-none">
        SOLUTION
      </div>

      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.8vh] w-auto" />
        <div className="font-mono text-[1.1vw] text-muted tracking-widest">04 / SOLUTION</div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] top-[15vh]">
        <div className="font-mono text-[1.2vw] text-primary tracking-[0.3em] mb-[2vh]">THE MINKE PROTOCOL</div>
        <h2 className="font-display font-extrabold text-[4.6vw] leading-[0.98] tracking-tight text-text" style={{ textWrap: "balance" }}>
          Two instruments. One protocol.
        </h2>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[6vh] grid grid-cols-2 gap-[2vw]">
        {[
          {
            tag: "VT",
            name: "Vesting Token",
            sub: "FOR DFI POSITIONS",
            body: "Map a Deterministic Future Income position to an instant, tradable token. Each VT is 1:1 anchored to its underlying future token.",
            bullets: [
              "1:1 redemption — every VT claims on one underlying future token.",
              "Claim happens at each scheduled income event.",
              "Perpetual income supported — VT keeps redeeming for as long as income flows.",
            ],
            primary: true,
          },
          {
            tag: "YT",
            name: "Yield Token",
            sub: "FOR VFI YIELD",
            body: "Strip variable future yield off staking, restaking, LP and lending positions, and let the market price it on its own.",
            bullets: [
              "YT holders receive the protocol-distributed variable income.",
              "Open-market price discovery for yield expectations.",
              "Speculate on rates, hedge revenue, or fix forward yield today.",
            ],
            primary: false,
          },
        ].map((c) => (
          <div
            key={c.tag}
            className="relative overflow-hidden rounded-[1.6vh] p-[3.5vh] border bg-bg-elevated shadow-[0_12px_36px_rgba(0,136,254,0.1)]"
            style={{ borderColor: c.primary ? "#0088FE" : "#59B9FF" }}
          >
            <div
              className="absolute -top-[8vh] -right-[8vh] w-[26vh] h-[26vh] rounded-full opacity-30 blur-2xl"
              style={{ background: c.primary ? "#0088FE" : "#59B9FF" }}
            />
            <div className="relative">
              <div className="flex items-baseline gap-[1vw]">
                <div
                  className="font-display font-extrabold text-[5vw] leading-none bg-clip-text text-transparent"
                  style={{
                    backgroundImage: c.primary
                      ? "linear-gradient(120deg, #0088FE 0%, #59B9FF 100%)"
                      : "linear-gradient(120deg, #59B9FF 0%, #0088FE 100%)",
                  }}
                >
                  {c.tag}
                </div>
                <div className="font-display font-semibold text-[1.6vw] text-text/80">{c.name}</div>
              </div>
              <div className="mt-[1vh] font-mono text-[1vw] text-muted tracking-widest">{c.sub}</div>
              <p className="mt-[2.5vh] text-[1.5vw] text-text/85 leading-snug">{c.body}</p>
              <div className="mt-[2.5vh] flex flex-col gap-[1vh] text-[1.3vw] text-muted">
                {c.bullets.map((b) => (
                  <div key={b} className="flex gap-[0.8vw]">
                    <span className="text-primary font-bold">&rarr;</span> {b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
