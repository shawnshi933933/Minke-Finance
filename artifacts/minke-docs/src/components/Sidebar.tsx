import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { sidebar, groupBySection } from "@/lib/sidebar";
import { cn } from "@/lib/utils";
import { Clock, ChevronDown } from "lucide-react";

interface SidebarProps {
  onNavigate: () => void;
}

const STORAGE_KEY = "minke-docs-sidebar-open";

function getDefaultOpen(sections: { title: string }[], currentSection: string): Record<string, boolean> {
  const stored = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, boolean>) : null;
    } catch {
      return null;
    }
  })();

  const defaults: Record<string, boolean> = {};
  for (const s of sections) {
    if (stored && s.title in stored) {
      defaults[s.title] = stored[s.title];
    } else {
      defaults[s.title] = s.title === currentSection;
    }
  }
  if (!defaults[currentSection]) {
    defaults[currentSection] = true;
  }
  return defaults;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [location] = useLocation();
  const currentSlug = location.replace(/^\//, "");
  const sections = groupBySection(sidebar);

  const currentSection =
    sections.find((s) => s.items.some((item) => item.slug === currentSlug))?.title ?? sections[0]?.title ?? "";

  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    getDefaultOpen(sections, currentSection)
  );

  useEffect(() => {
    setOpen((prev) => {
      if (!prev[currentSection]) {
        const next = { ...prev, [currentSection]: true };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
        return next;
      }
      return prev;
    });
  }, [currentSection]);

  const toggle = useCallback(
    (sectionTitle: string) => {
      setOpen((prev) => {
        const next = { ...prev, [sectionTitle]: !prev[sectionTitle] };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
        return next;
      });
    },
    []
  );

  return (
    <nav className="p-3 space-y-1">
      {sections.map((section) => {
        const isOpen = open[section.title] ?? false;
        const hasActive = section.items.some((item) => item.slug === currentSlug);

        return (
          <div key={section.title}>
            <button
              onClick={() => toggle(section.title)}
              className={cn(
                "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[0.6875rem] font-semibold uppercase tracking-widest transition-colors",
                hasActive
                  ? "text-primary/80"
                  : "text-muted-foreground/60 hover:text-muted-foreground"
              )}
              aria-expanded={isOpen}
            >
              {section.title}
              <ChevronDown
                className={cn(
                  "w-3 h-3 transition-transform duration-200",
                  isOpen ? "rotate-0" : "-rotate-90"
                )}
              />
            </button>

            {isOpen && (
              <ul className="mt-0.5 mb-2 space-y-0.5">
                {section.items.map((item) => {
                  const isActive = currentSlug === item.slug;
                  return (
                    <li key={item.slug}>
                      {item.comingSoon ? (
                        <span className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground/40 cursor-default select-none pl-3">
                          <span className="flex-1 truncate">{item.title}</span>
                          <Clock className="w-3 h-3 shrink-0" />
                        </span>
                      ) : (
                        <Link
                          href={`/${item.slug}`}
                          onClick={onNavigate}
                          className={cn(
                            "flex items-center px-2 py-1.5 pl-3 rounded-md text-sm transition-colors",
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                          )}
                        >
                          {item.title}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
