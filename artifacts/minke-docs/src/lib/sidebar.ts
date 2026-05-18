import rawSidebar from "../docs/sidebar.json";

export interface NavItem {
  slug: string;
  title: string;
  section: string;
  order: number;
  comingSoon?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const sidebar: NavItem[] = rawSidebar as NavItem[];

export const SECTION_ORDER = [
  "Introduction",
  "Protocol",
  "Use Cases",
  "Technical Reference",
  "Integration Guide",
  "User 101",
  "Vision",
];

export function groupBySection(pages: NavItem[]): NavSection[] {
  const map = new Map<string, NavItem[]>();
  for (const page of pages) {
    const list = map.get(page.section) ?? [];
    list.push(page);
    map.set(page.section, list);
  }
  return SECTION_ORDER.filter((s) => map.has(s)).map((s) => ({
    title: s,
    items: (map.get(s) ?? []).sort((a, b) => a.order - b.order),
  }));
}

export function getPageBySlug(slug: string): NavItem | undefined {
  return sidebar.find((p) => p.slug === slug);
}

export function getAdjacentPages(slug: string): { prev?: NavItem; next?: NavItem } {
  const sorted = [...sidebar].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((p) => p.slug === slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? sorted[idx - 1] : undefined,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : undefined,
  };
}
