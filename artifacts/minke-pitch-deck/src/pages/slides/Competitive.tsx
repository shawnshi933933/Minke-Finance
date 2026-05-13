const base = import.meta.env.BASE_URL;

export default function Competitive() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 0% 0%, rgba(24,95,234,0.16) 0%, rgba(0,0,0,0) 60%)",
        }}
      />

      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.5vh] w-auto opacity-80" />
        <div className="font-mono text-[1.2vw] text-muted tracking-widest">07 / COMPETITIVE</div>
      </div>

      <div className="absolute left-[5vw] top-[13vh] max-w-[55vw]">
        <div className="font-mono text-[1.3vw] text-primary tracking-[0.3em] mb-[2vh]">WHY MINKE WINS</div>
        <h2 className="font-display font-bold text-[4.5vw] leading-[0.98] tracking-tight text-text" style={{ textWrap: "balance" }}>
          The end of OTC for locked tokens.
        </h2>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[6vh] grid grid-cols-2 gap-[2vw]">
        <div className="bg-bg-elevated rounded-[1.2vh] p-[3.5vh] border border-border h-[52vh] flex flex-col">
          <div className="font-mono text-[1.2vw] text-muted tracking-widest">TRADITIONAL OTC DESKS</div>
          <div className="mt-[1.5vh] font-display font-bold text-[2.6vw] leading-tight text-muted">
            Slow. Opaque. Off-chain.
          </div>
          <div className="mt-[3vh] flex flex-col gap-[1.6vh] text-[1.5vw] text-muted leading-snug">
            <div className="flex gap-[1vw]"><span className="text-muted/60">&times;</span> Weeks of bilateral negotiation per ticket.</div>
            <div className="flex gap-[1vw]"><span className="text-muted/60">&times;</span> Steep counterparty and settlement risk.</div>
            <div className="flex gap-[1vw]"><span className="text-muted/60">&times;</span> Discounts of 30-70% off spot, opaque to the seller.</div>
            <div className="flex gap-[1vw]"><span className="text-muted/60">&times;</span> No price discovery, no secondary market, no composability.</div>
            <div className="flex gap-[1vw]"><span className="text-muted/60">&times;</span> Only accessible to a handful of large holders.</div>
          </div>
        </div>

        <div className="bg-primary/15 rounded-[1.2vh] p-[3.5vh] border border-primary h-[52vh] flex flex-col">
          <div className="font-mono text-[1.2vw] text-primary tracking-widest">MINKE PROTOCOL</div>
          <div className="mt-[1.5vh] font-display font-bold text-[2.6vw] leading-tight text-text">
            Instant. Transparent. On-chain.
          </div>
          <div className="mt-[3vh] flex flex-col gap-[1.6vh] text-[1.5vw] text-text/90 leading-snug">
            <div className="flex gap-[1vw]"><span className="text-primary">&rarr;</span> One transaction from locked asset to liquid token.</div>
            <div className="flex gap-[1vw]"><span className="text-primary">&rarr;</span> Smart-contract enforced &mdash; no counterparty risk.</div>
            <div className="flex gap-[1vw]"><span className="text-primary">&rarr;</span> Open-market price discovery on every DEX.</div>
            <div className="flex gap-[1vw]"><span className="text-primary">&rarr;</span> Composable: collateral, lending, structured products.</div>
            <div className="flex gap-[1vw]"><span className="text-primary">&rarr;</span> Permissionless &mdash; from $1k vest to $100M SAFT.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
