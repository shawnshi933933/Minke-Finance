const base = import.meta.env.BASE_URL;

export default function Solution() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(24,95,234,0.18) 0%, rgba(0,0,0,0) 60%)",
        }}
      />

      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.5vh] w-auto opacity-80" />
        <div className="font-mono text-[1.2vw] text-muted tracking-widest">04 / SOLUTION</div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] top-[13vh]">
        <div className="font-mono text-[1.3vw] text-primary tracking-[0.3em] mb-[2.5vh]">THE MINKE PROTOCOL</div>
        <h2 className="font-display font-bold text-[5vw] leading-[0.98] tracking-tight text-text" style={{ textWrap: "balance" }}>
          Two instruments. One liquidity layer.
        </h2>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[7vh] grid grid-cols-2 gap-[2vw]">
        <div className="bg-bg-elevated rounded-[1.5vh] p-[3.5vh] border border-border relative overflow-hidden">
          <div className="absolute -top-[6vh] -right-[6vh] w-[20vh] h-[20vh] rounded-full bg-primary/15 blur-2xl" />
          <div className="relative">
            <div className="flex items-baseline gap-[1vw]">
              <div className="font-display font-bold text-[5vw] leading-none text-primary">VT</div>
              <div className="font-display font-medium text-[1.6vw] text-text/80">Vest Token</div>
            </div>
            <div className="mt-[1vh] font-mono text-[1.1vw] text-muted tracking-widest">FOR DRI ASSETS</div>
            <p className="mt-[2.5vh] text-[1.6vw] text-text/90 leading-snug">
              Tokenize a vesting position once. Trade, transfer, collateralize or claim it like any ERC-20.
            </p>
            <div className="mt-[3vh] flex flex-col gap-[1vh] text-[1.4vw] text-muted">
              <div className="flex gap-[0.8vw]"><span className="text-primary">&rarr;</span> 1:1 redemption against the underlying token at maturity.</div>
              <div className="flex gap-[0.8vw]"><span className="text-primary">&rarr;</span> Streaming claims as the schedule vests.</div>
              <div className="flex gap-[0.8vw]"><span className="text-primary">&rarr;</span> Composable liquidity on every major DEX.</div>
            </div>
          </div>
        </div>

        <div className="bg-bg-elevated rounded-[1.5vh] p-[3.5vh] border border-border relative overflow-hidden">
          <div className="absolute -top-[6vh] -right-[6vh] w-[20vh] h-[20vh] rounded-full bg-accent/15 blur-2xl" />
          <div className="relative">
            <div className="flex items-baseline gap-[1vw]">
              <div className="font-display font-bold text-[5vw] leading-none text-accent">YT</div>
              <div className="font-display font-medium text-[1.6vw] text-text/80">Yield Token</div>
            </div>
            <div className="mt-[1vh] font-mono text-[1.1vw] text-muted tracking-widest">FOR NON-DRI YIELD</div>
            <p className="mt-[2.5vh] text-[1.6vw] text-text/90 leading-snug">
              Strip the variable yield off staking, restaking, LP and lending positions and price it on its own market.
            </p>
            <div className="mt-[3vh] flex flex-col gap-[1vh] text-[1.4vw] text-muted">
              <div className="flex gap-[0.8vw]"><span className="text-accent">&rarr;</span> Speculate on rates, or lock in fixed yield today.</div>
              <div className="flex gap-[0.8vw]"><span className="text-accent">&rarr;</span> Hedge protocol revenue against rate compression.</div>
              <div className="flex gap-[0.8vw]"><span className="text-accent">&rarr;</span> Modular: works with any yield-bearing asset.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
