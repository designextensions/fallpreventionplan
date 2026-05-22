import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";

export const conciergeNotesTable = pgTable("concierge_notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  authorName: text("author_name").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const conciergeCheckInsTable = pgTable("concierge_check_ins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  fromName: text("from_name").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ConciergeNoteRow = typeof conciergeNotesTable.$inferSelect;
export type ConciergeCheckInRow = typeof conciergeCheckInsTable.$inferSelect;
