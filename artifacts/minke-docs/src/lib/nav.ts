export interface NavItem {
  slug: string;
  title: string;
  section: string;
  order: number;
  comingSoon?: boolean | null;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export function groupBySection(pages: NavItem[]): NavSection[] {
  const sectionOrder = [
    "Introduction",
    "Protocol",
    "Use Cases",
    "Integration Guide",
    "User 101",
    "Vision",
  ];

  const map = new Map<string, NavItem[]>();
  for (const page of pages) {
    const list = map.get(page.section) ?? [];
    list.push(page);
    map.set(page.section, list);
  }

  return sectionOrder
    .filter((s) => map.has(s))
    .map((s) => ({
      title: s,
      items: (map.get(s) ?? []).sort((a, b) => a.order - b.order),
    }));
}
