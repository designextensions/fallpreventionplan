import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const liveSessionsTable = pgTable("live_sessions", {
  id: serial("id").primaryKey(),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  durationMin: integer("duration_min").notNull(),
  host: text("host").notNull(),
  joinUrl: text("join_url"),
});

export type LiveSessionRow = typeof liveSessionsTable.$inferSelect;
export type InsertLiveSession = typeof liveSessionsTable.$inferInsert;
