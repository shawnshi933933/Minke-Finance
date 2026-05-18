import { useState } from "react";
import { Link, useLocation } from "wouter";
import Sidebar from "./Sidebar";
import { Menu, X, BookOpen, ExternalLink } from "lucide-react";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center px-4 gap-3">
          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>

          <Link href="/" className="flex items-center gap-2 mr-4">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground text-sm">
              Minke Finance
            </span>
            <span className="text-muted-foreground text-sm hidden sm:inline">
              / Docs
            </span>
          </Link>

          <div className="flex-1" />

          <a
            href="https://minke.finance"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            minke.finance
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-border bg-sidebar">
          <Sidebar onNavigate={() => {}} />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-border shadow-xl overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-semibold text-foreground text-sm">
                  Documentation
                </span>
                <button
                  className="p-1.5 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-6 py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
