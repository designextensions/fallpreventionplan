import { pgTable, serial, integer, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const assessmentsTable = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  guestEmail: text("guest_email"),
  guestName: text("guest_name"),
  answers: jsonb("answers").notNull(),
  score: integer("score").notNull(),
  level: text("level").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Assessment = typeof assessmentsTable.$inferSelect;
export type InsertAssessment = typeof assessmentsTable.$inferInsert;
