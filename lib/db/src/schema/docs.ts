import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const docsPages = pgTable("docs_pages", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  section: text("section").notNull(),
  order: integer("order").notNull(),
  content: text("content").notNull(),
  comingSoon: boolean("coming_soon").default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type DocsPage = typeof docsPages.$inferSelect;
export type InsertDocsPage = typeof docsPages.$inferInsert;
