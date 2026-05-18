import { Link, useLocation } from "wouter";
import { sidebar, groupBySection } from "@/lib/sidebar";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface SidebarProps {
  onNavigate: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [location] = useLocation();
  const currentSlug = location.replace(/^\//, "");
  const sections = groupBySection(sidebar);

  return (
    <nav className="p-4 space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 mb-1.5">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = currentSlug === item.slug;
              return (
                <li key={item.slug}>
                  {item.comingSoon ? (
                    <span className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground/50 cursor-default select-none">
                      <span className="flex-1 truncate">{item.title}</span>
                      <Clock className="w-3 h-3 shrink-0" />
                    </span>
                  ) : (
                    <Link
                      href={`/${item.slug}`}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center px-2 py-1.5 rounded-md text-sm transition-colors",
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
        </div>
      ))}
    </nav>
  );
}
