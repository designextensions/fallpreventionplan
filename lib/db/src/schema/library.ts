import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const libraryItemsTable = pgTable("library_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  kind: text("kind").notNull(),
  summary: text("summary"),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  durationMin: integer("duration_min"),
});

export type LibraryItemRow = typeof libraryItemsTable.$inferSelect;
export type InsertLibraryItem = typeof libraryItemsTable.$inferInsert;
