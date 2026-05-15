import { motion, useInView, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HeroCanvas } from "../components/HeroCanvas";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 2000,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const updateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(easeOutExpo * value));
      if (progress < 1) requestAnimationFrame(updateNumber);
    };
    requestAnimationFrame(updateNumber);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function Home() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  function handleHeroMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    setMouse({ x: cx / rect.width, y: cy / rect.height });
  }

  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="relative min-h-[100dvh] flex items-center justify-center pt-20 pb-12 overflow-hidden bg-minke-hero bg-minke-dot"
      >
        <HeroCanvas />
        
        <div className="container relative z-10 mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="font-mono text-primary text-sm font-semibold tracking-wider mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-primary rounded-full"></span>
              FUTURE INCOME &rarr; PRESENT VALUE
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-text mb-8">
              Unravel the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">time value of money</span> onchain.
            </h1>
            
            <p className="text-xl text-muted leading-relaxed mb-8 max-w-xl font-sans">
              A protocol that turns deterministic future income — SAFTs, vesting, staking, mining, fixed-term saving and bonds — into present value, tradable on-chain today.
            </p>

            {/* DFI concept cards */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              className="grid grid-cols-3 gap-x-4 mb-10 pt-4 border-t border-border"
            >
              {[
                {
                  letter: "D",
                  title: "Deterministic",
                  sub: "Known amounts, regular schedules",
                  delay: 0.6,
                },
                {
                  letter: "F",
                  title: "Future",
                  sub: "Tomorrow's cash flows, priced today",
                  delay: 0.75,
                },
                {
                  letter: "I",
                  title: "Income",
                  sub: "SAFTs · Vesting · Staking · Bonds",
                  delay: 0.9,
                },
              ].map(({ letter, title, sub, delay }) => (
                <motion.div
                  key={letter}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay, ease: "easeOut" }}
                  className="flex items-start gap-3"
                >
                  <span className="font-display font-black text-2xl text-transparent bg-clip-text bg-gradient-to-b from-primary to-accent leading-none mt-0.5">
                    {letter}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-sans font-semibold text-sm text-text leading-none">{title}</span>
                    <span className="font-mono text-xs text-muted tracking-wide mt-1">{sub}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <button className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-full font-sans font-medium shadow-lg hover:shadow-xl transition-all pointer-events-none">
                Coming Soon
              </button>
              <a href="#" className="text-text font-medium hover:text-primary transition-colors flex items-center gap-2 group">
                Read the doc
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </a>
            </div>
          </motion.div>
          
          {/* Whale illustration with mouse-parallax + float */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            style={{
              transform: `translate(${mouse.x * 18}px, ${mouse.y * 12}px)`,
              transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
            className="relative lg:h-[600px] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, -22, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[150%] h-[150%] rotate-[40deg]"
            >
              <img
                src={`${import.meta.env.BASE_URL}illus-cover-calendar-whale-v1.png`}
                alt="Minke Whale Illustration"
                className="w-full h-full object-contain"
              />

            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section id="shift" className="relative overflow-hidden bg-white py-12 md:py-16">
        {/* Dot grid */}
        <div className="absolute inset-0 bg-minke-dot opacity-40 pointer-events-none" />
        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 55% at 75% 50%, rgba(0,136,254,0.06) 0%, transparent 70%)" }} />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left: content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="font-mono text-xs tracking-[0.3em] uppercase text-primary mb-10">
                  The Problem
                </div>
              </motion.div>

              {/* $1T+ as visual center */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="mb-8"
              >
                <div
                  className="text-[5.5rem] md:text-[7.5rem] font-display font-black tracking-tighter leading-none"
                  style={{
                    background: "linear-gradient(120deg, #0088FE 0%, #59B9FF 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  $<AnimatedNumber value={1000} suffix="B+" duration={2500} />
                </div>
                <div className="font-mono text-xs tracking-[0.2em] uppercase text-muted mt-3">
                  in on-chain future income — without a Present Value rail
                </div>
              </motion.div>

              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.22 }}
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: 0.28, ease: "easeOut" }}
                  className="h-px mb-7"
                  style={{
                    background: "linear-gradient(to right, #0088FE, transparent)",
                    transformOrigin: "left",
                  }}
                />
                <p className="text-lg font-sans leading-relaxed text-muted">
                  SAFTs, vesting schedules, staking rewards, bond coupons — over a trillion in value sits illiquid, non-tradable, and invisible on any balance sheet. No way to hedge it, price it, or put it to work while the clock runs down.
                </p>
              </motion.div>
            </div>

            {/* Right: illustration — larger */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
            >
              <div
                className="absolute w-[28rem] h-[28rem] rounded-full blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(0,136,254,0.12) 0%, transparent 70%)" }}
              />
              <motion.img
                src={`${import.meta.env.BASE_URL}illus-problem.png`}
                alt="The Problem"
                className="relative w-full max-w-2xl"
                animate={{ y: [0, -18, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ filter: "drop-shadow(0 40px 60px rgba(0,136,254,0.18))" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONCEPT SECTION */}
      <section id="concept" className="relative overflow-hidden bg-elevated py-14 md:py-20">
        {/* Soft gradient fade from white above */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-16 z-10"
          style={{ background: "linear-gradient(to bottom, #ffffff, transparent)" }} />
        <div className="pointer-events-none absolute inset-0 bg-minke-dot opacity-30" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left: typographic statement */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-16 lg:pl-20 xl:pl-28"
            >
              <div className="font-mono text-xs tracking-[0.3em] uppercase text-primary mb-1">
                The Solution
              </div>
              <div className="font-mono text-xs tracking-[0.2em] uppercase text-muted mb-8">
                A new asset class
              </div>

              {/* DFI. — character-by-character reveal */}
              <h2 className="font-display font-black leading-none tracking-tight text-text mb-5"
                style={{ fontSize: "clamp(5rem, 10vw, 9rem)" }}>
                {"DFI.".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </h2>

              <div className="text-xl font-display font-semibold text-text/70 mb-6 leading-snug">
                Deterministic Future Income.
              </div>

              <p className="text-muted font-sans leading-relaxed mb-10 max-w-sm">
                The answer to the $1,000B+ problem. Minke introduces DFI — making future income tradable, priceable, and composable on-chain for the first time.
              </p>

              <div
                className="inline-flex items-center px-4 py-2 rounded-lg font-mono text-sm text-white shadow-lg"
                style={{ background: "linear-gradient(120deg, #0088FE 0%, #59B9FF 100%)" }}
              >
                Minke's original framework.
              </div>
            </motion.div>

            {/* Right: cards only */}
            <div className="flex flex-col gap-5 pt-4">

              {/* DFI Card — hover reveals tags */}
              <motion.div
                className="relative bg-white rounded-2xl p-8 border border-border overflow-hidden shadow-sm cursor-default"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover="hover"
                animate="rest"
              >
                {/* Animated left border — draws down on scroll */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                  style={{ background: "linear-gradient(to bottom, #0088FE, #59B9FF)", transformOrigin: "top" }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, ease: "easeOut", delay: 0.2 }}
                />
                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
                  transition={{ duration: 0.25 }}
                  style={{ background: "linear-gradient(135deg, rgba(0,136,254,0.04) 0%, transparent 60%)" }}
                />
                <div className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase mb-3">
                  DFI — Deterministic Future Income
                </div>
                <h3 className="font-display font-extrabold text-xl text-text mb-3">
                  Predictable amount. Regular schedule.
                </h3>
                <p className="text-muted font-sans text-sm leading-relaxed mb-5">
                  SAFTs, team and advisor vesting, scheduled treasury unlocks, fixed-term staking rewards, node licenses, on-chain bonds and tokenized fixed-income RWA.
                </p>
                {/* Tags — hidden by default, stagger-pop on hover */}
                <motion.div
                  className="flex flex-wrap gap-2 overflow-hidden"
                  variants={{
                    rest: { transition: { staggerChildren: 0.05 } },
                    hover: { transition: { staggerChildren: 0.06 } },
                  }}
                >
                  {["SAFTs", "Vesting", "Treasury unlocks", "Staking rewards", "Node licenses", "On-chain bonds"].map((tag) => (
                    <motion.span
                      key={tag}
                      variants={{
                        rest: { opacity: 0, scale: 0.75, y: 6 },
                        hover: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
                      }}
                      className="px-3 py-1 rounded-full text-xs font-mono bg-tint text-primary border border-primary/20"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>

              {/* VFI Card — hover reveals tags */}
              <motion.div
                className="relative bg-white rounded-2xl p-8 border border-border overflow-hidden shadow-sm cursor-default"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover="hover"
                animate="rest"
              >
                {/* Animated left border */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-muted/30"
                  style={{ transformOrigin: "top" }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, ease: "easeOut", delay: 0.35 }}
                />
                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
                  transition={{ duration: 0.25 }}
                  style={{ background: "linear-gradient(135deg, rgba(107,122,153,0.04) 0%, transparent 60%)" }}
                />
                <div className="font-mono text-[10px] text-muted tracking-[0.2em] uppercase mb-3">
                  VFI — Variable Future Income
                </div>
                <h3 className="font-display font-extrabold text-xl text-text mb-3">
                  Yield that varies.
                </h3>
                <p className="text-muted font-sans text-sm leading-relaxed mb-5">
                  Yield-farming returns, variable lending APY, governance-token rewards, NFT royalties — size and timing both shaped by the market.
                </p>
                {/* Tags — hidden by default, stagger-pop on hover */}
                <motion.div
                  className="flex flex-wrap gap-2 overflow-hidden"
                  variants={{
                    rest: { transition: { staggerChildren: 0.05 } },
                    hover: { transition: { staggerChildren: 0.06 } },
                  }}
                >
                  {["Yield farming", "Variable APY", "Governance rewards", "NFT royalties"].map((tag) => (
                    <motion.span
                      key={tag}
                      variants={{
                        rest: { opacity: 0, scale: 0.75, y: 6 },
                        hover: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
                      }}
                      className="px-3 py-1 rounded-full text-xs font-mono bg-elevated text-muted border border-border"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
                <div className="mt-5 font-mono text-[10px] text-muted/40 tracking-widest uppercase">
                  VFI support planned for v2
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 md:py-32 bg-elevated border-y border-border">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="mb-20 text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">How it works</h2>
            <p className="text-xl text-muted font-sans">
              Positions are illiquid, non-tradable, sit off-balance-sheet; no way to hedge, borrow against them, or recycle capital while waiting for payout. Until now.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { num: "01", title: "Deposit a DFI position", icon: "icon-deposit.png" },
              { num: "02", title: "Receive VT instantly", icon: "icon-receive.png" },
              { num: "03", title: "Trade, hold or claim", icon: "icon-trade.png" },
              { num: "04", title: "1:1 redemption claim", icon: "icon-redemption.png" }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="text-6xl font-display font-black text-tint mb-8 select-none">
                  {step.num}
                </div>
                <div className="w-16 h-16 mb-6">
                  <img src={`${import.meta.env.BASE_URL}${step.icon}`} alt={`Step ${step.num}`} className="w-full h-full object-contain" />
                </div>
                <h4 className="text-xl font-bold leading-tight">{step.title}</h4>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MARKET STATS */}
      <section id="market" className="py-24 md:py-32 bg-white bg-minke-dot relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8">The Market is Massive.</h2>
              <p className="text-xl text-muted font-sans leading-relaxed mb-10">
                Vesting pipelines, staking and restaking floats, mining and node emissions, fixed-term savings and on-chain bonds all need one solution: a discounting market for future cash flow.
              </p>
              
              <div className="space-y-8">
                <div>
                  <div className="text-4xl font-display font-black text-primary mb-2">
                    ~$<AnimatedNumber value={200} suffix="B" />
                  </div>
                  <div className="font-mono text-sm text-text">Vesting & SAFTs</div>
                </div>
                
                <div className="w-full h-[1px] bg-border"></div>
                
                <div>
                  <div className="text-4xl font-display font-black text-primary mb-2">
                    ~$<AnimatedNumber value={500} suffix="B" />
                  </div>
                  <div className="font-mono text-sm text-text">Staking & Restaking</div>
                </div>
                
                <div className="w-full h-[1px] bg-border"></div>
                
                <div>
                  <div className="text-4xl font-display font-black text-primary mb-2">
                    ~$<AnimatedNumber value={50} suffix="B/yr" />
                  </div>
                  <div className="font-mono text-sm text-text">Mining & Node Emissions</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="bg-gradient-to-br from-primary to-[#0066CC] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              
              <h3 className="text-2xl font-bold mb-12 opacity-90">TradFi and Beyond</h3>
              <div className="text-7xl md:text-8xl font-display font-black mb-8 tracking-tighter">
                $<AnimatedNumber value={1} suffix="T+" />
              </div>
              <p className="text-lg opacity-80 font-sans leading-relaxed">
                The ultimate frontier. Real-world assets, traditional fixed-income markets, and institutional cash flows making their way onchain.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-text text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,136,254,0.3)_0%,transparent_70%)]"></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight">The future is tradable.</h2>
            <p className="text-xl text-white/70 font-sans mb-12">
              Join the protocol that unlocks the time value of money.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="bg-gradient-to-r from-primary to-accent text-white px-10 py-4 rounded-full font-sans font-medium shadow-lg hover:shadow-xl transition-all pointer-events-none w-full sm:w-auto">
                Coming Soon
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
