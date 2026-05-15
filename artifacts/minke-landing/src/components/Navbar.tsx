import { useEffect, useState } from "react";
import { Link } from "wouter";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md border-b border-border/50 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}minke-logo.svg`} alt="Minke Logo" className="h-8 w-auto" />
        </Link>
        
        <div className="hidden md:flex items-center gap-8 font-mono text-sm tracking-tight text-text">
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
          <a href="#concept" className="hover:text-primary transition-colors">Concept</a>
          <a href="#market" className="hover:text-primary transition-colors">Market</a>
          
          <div className="flex items-center gap-4">
            <a 
              href="/minke-pitch-deck/" 
              className="font-sans font-medium text-text hover:text-primary transition-colors"
            >
              Read the deck &rarr;
            </a>
            <button className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 rounded-full font-sans font-medium text-sm shadow-md pointer-events-none opacity-90">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
