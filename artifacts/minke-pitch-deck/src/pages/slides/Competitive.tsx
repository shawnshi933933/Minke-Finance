const base = import.meta.env.BASE_URL;

export default function Competitive() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-minke-soft">
      <div className="absolute inset-0 bg-minke-dot opacity-40" />

      <div className="absolute right-[2vw] top-[6vh] divider-text text-[14vw] pointer-events-none select-none leading-none">
        VS
        <br />
        OTC
      </div>

      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.8vh] w-auto" />
        <div className="font-mono text-[1.1vw] text-muted tracking-widest">07 / COMPETITIVE</div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] top-[14vh] grid grid-cols-12 gap-[2vw] items-start">
        <div className="col-span-7">
          <div className="font-mono text-[1.2vw] text-primary tracking-[0.3em] mb-[2vh]">WHY MINKE WINS</div>
          <h2 className="font-display font-extrabold text-[4.4vw] leading-[0.98] tracking-tight text-text" style={{ textWrap: "balance" }}>
            The end of OTC for future-income positions.
          </h2>
        </div>
        <div className="col-span-5 flex justify-center">
          <img src={`${base}illus-competitive.png`} crossOrigin="anonymous" alt="" className="h-[26vh] w-auto" />
        </div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[6vh] grid grid-cols-2 gap-[2vw]">
        <div className="bg-bg-elevated rounded-[1.4vh] p-[3vh] border border-border h-[48vh] flex flex-col shadow-[0_6px_18px_rgba(10,21,48,0.05)]">
          <div className="font-mono text-[1.1vw] text-muted tracking-widest">TRADITIONAL OTC DESKS</div>
          <div className="mt-[1.4vh] font-display font-extrabold text-[2.4vw] leading-tight text-muted">
            Slow. Opaque. Off-chain.
          </div>
          <div className="mt-[2.5vh] flex flex-col gap-[1.4vh] text-[1.35vw] text-muted leading-snug">
            {[
              "Weeks of bilateral negotiation per future-income ticket.",
              "Steep counterparty and settlement risk.",
              "Discounts of 30-70% off spot, opaque to the seller.",
              "No price discovery, no secondary market, no composability.",
              "Only accessible to a handful of large holders.",
            ].map((b) => (
              <div key={b} className="flex gap-[0.8vw]">
                <span className="text-muted/50 font-bold">&times;</span> {b}
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-[1.4vh] p-[3vh] border-2 border-primary h-[48vh] flex flex-col shadow-[0_16px_40px_rgba(0,136,254,0.22)] text-white relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, #0088FE 0%, #59B9FF 100%)" }}
        >
          <div className="absolute -top-[8vh] -right-[8vh] w-[28vh] h-[28vh] rounded-full bg-white/20 blur-2xl" />
          <div className="relative font-mono text-[1.1vw] text-white/85 tracking-widest">MINKE PROTOCOL</div>
          <div className="relative mt-[1.4vh] font-display font-extrabold text-[2.4vw] leading-tight text-white">
            Instant. Transparent. On-chain.
          </div>
          <div className="relative mt-[2.5vh] flex flex-col gap-[1.4vh] text-[1.35vw] text-white/95 leading-snug">
            {[
              "One transaction from future income to present value.",
              "Smart-contract enforced — no counterparty risk.",
              "Open-market price discovery on every DEX.",
              "Composable: collateral, lending, structured products.",
              "Permissionless — from $1k vest to $100M SAFT.",
            ].map((b) => (
              <div key={b} className="flex gap-[0.8vw]">
                <span className="text-white font-bold">&rarr;</span> {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
