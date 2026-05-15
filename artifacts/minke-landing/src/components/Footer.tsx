export function Footer() {
  return (
    <footer className="border-t border-border bg-white py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src={`${import.meta.env.BASE_URL}minke-logo.svg`} alt="Minke Logo" className="h-8 w-auto grayscale opacity-50" />
          <span className="font-sans text-muted text-sm">&copy; 2026 Minke Finance</span>
        </div>

        <div className="font-mono text-xs text-muted/60 tracking-wider">
          FUTURE INCOME &rarr; PRESENT VALUE
        </div>

        <div className="flex items-center gap-6 text-sm font-sans text-muted">
          <span className="opacity-60">minke.finance — coming soon</span>
        </div>
      </div>
    </footer>
  );
}
