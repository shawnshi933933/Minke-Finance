const base = import.meta.env.BASE_URL;

const cases = [
  {
    n: "01",
    t: "SAFTs & Team Vesting",
    d: "VCs, founders, contributors and advisors hold tokens that vest over years. Tokenize the schedule, get controlled present value without breaking vesting terms.",
  },
  {
    n: "02",
    t: "Staking & Mining Rewards",
    d: "Fixed-term staking, restaking, BTC mining and DePIN emissions all produce rule-based future income. Bring those streams forward as VT.",
  },
  {
    n: "03",
    t: "Node & License Rewards",
    d: "AI, DePIN and L1 node licenses emit on a known schedule. Tokenize the future emissions and trade them like any other instrument.",
  },
  {
    n: "04",
    t: "Tokenized RWA & Bonds",
    d: "Treasury bills, private credit and on-chain bonds with deterministic coupons fit Minke natively — one rail for every form of DFI.",
  },
];

export default function UseCases() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-minke-hero">
      <div className="absolute inset-0 bg-minke-dot opacity-40" />

      <div className="absolute left-[2vw] top-[6vh] divider-text text-[14vw] pointer-events-none select-none leading-none">
        USE
        <br />
        CASES
      </div>

      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <img src={`${base}minke-logo.svg`} crossOrigin="anonymous" alt="Minke" className="h-[3.8vh] w-auto" />
        <div className="font-mono text-[1.1vw] text-muted tracking-widest">06 / USE CASES</div>
      </div>

      <div className="absolute left-[5vw] top-[14vh] max-w-[60vw]">
        <div className="font-mono text-[1.2vw] text-primary tracking-[0.3em] mb-[2vh]">WHO USES MINKE</div>
        <h2 className="font-display font-extrabold text-[4.2vw] leading-[0.98] tracking-tight text-text" style={{ textWrap: "balance" }}>
          Anywhere future income is determined.
        </h2>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[6vh] grid grid-cols-4 gap-[1.4vw]">
        {cases.map((c) => (
          <div key={c.n} className="bg-bg-elevated rounded-[1.4vh] p-[2.6vh] border border-border h-[44vh] flex flex-col shadow-[0_8px_24px_rgba(0,136,254,0.06)]">
            <div className="font-mono text-[1vw] text-primary tracking-widest">{c.n}</div>
            <div className="mt-[1.4vh] font-display font-extrabold text-[2.1vw] leading-tight text-text">{c.t}</div>
            <div
              className="mt-[1.8vh] h-[1.2vh] w-[18%] rounded-full"
              style={{ background: "linear-gradient(90deg, #0088FE 0%, #59B9FF 100%)" }}
            />
            <div className="mt-[1.8vh] text-[1.3vw] text-muted leading-snug">{c.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
