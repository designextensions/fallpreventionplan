import { pgTable, serial, text, integer, boolean, jsonb } from "drizzle-orm/pg-core";

export const modulesTable = pgTable("modules", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  order: integer("order").notNull(),
  planSection: text("plan_section").notNull(),
  durationMin: integer("duration_min"),
  videoEmbedUrl: text("video_embed_url"),
  body: text("body"),
  keyPoints: jsonb("key_points").$type<string[]>().notNull().default([]),
  comingSoon: boolean("coming_soon").notNull().default(false),
  freeTier: boolean("free_tier").notNull().default(false),
  printable: boolean("printable").notNull().default(false),
});

export type ModuleRow = typeof modulesTable.$inferSelect;
export type InsertModule = typeof modulesTable.$inferInsert;
