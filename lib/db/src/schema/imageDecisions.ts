import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Dr. Angell's yes/no decisions on generated image candidates, captured from
// /admin/images so a remote review can be pulled into the manifest with
// tools/apply-image-decisions.py --url.
export const imageDecisionsTable = pgTable("image_decisions", {
  slotId: text("slot_id").primaryKey(),          // e.g. IMG-32
  decision: text("decision").notNull(),          // approve | reject
  file: text("file"),                            // chosen candidate path when approved
  notes: text("notes"),
  reviewer: text("reviewer"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ImageDecisionRow = typeof imageDecisionsTable.$inferSelect;
