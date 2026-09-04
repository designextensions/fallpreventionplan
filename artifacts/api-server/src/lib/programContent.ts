import { db, modulesTable, notInArray, sql } from "@workspace/db";
import { logger } from "./logger";
// content/program.json is generated from Dr. Angell's "FPP WEBSITE TEMPLATE.docx" by
// tools/extract-template.py + tools/build-content.py (see replit.md, "Content pipeline").
// esbuild inlines this JSON into the API bundle, so the deployment carries its content.
import program from "../../../../content/program.json";

type ModuleSeed = {
  slug: string;
  title: string;
  subtitle: string | null;
  order: number;
  planSection: string;
  chapter: number | null;
  durationMin: number | null;
  videoEmbedUrl: string | null;
  body: string;
  keyPoints: string[];
  comingSoon: boolean;
  freeTier: boolean;
  printable: boolean;
};

const MODULES = (program as { modules: ModuleSeed[] }).modules;

/**
 * Bring the `modules` table in line with content/program.json on boot.
 *
 * The published deployment uses its own database, which the workspace seed never
 * touches, and Replit's post-merge hook does not run on deploy. Seeding here means a
 * push + publish is enough to ship content: idempotent upsert by slug, then prune
 * sections that no longer exist. Set SEED_ON_BOOT=0 to skip.
 */
export async function ensureProgramContent(): Promise<void> {
  if (process.env["SEED_ON_BOOT"] === "0") return;
  for (const m of MODULES) {
    const { chapter: _chapter, ...row } = m;
    await db
      .insert(modulesTable)
      .values(row)
      .onConflictDoUpdate({
        target: modulesTable.slug,
        set: {
          title: row.title,
          subtitle: row.subtitle,
          order: row.order,
          planSection: row.planSection,
          durationMin: row.durationMin,
          videoEmbedUrl: row.videoEmbedUrl,
          body: row.body,
          keyPoints: row.keyPoints,
          comingSoon: row.comingSoon,
          freeTier: row.freeTier,
          printable: row.printable,
        },
      });
  }
  const removed = await db
    .delete(modulesTable)
    .where(notInArray(modulesTable.slug, MODULES.map((m) => m.slug)))
    .returning({ slug: modulesTable.slug });
  logger.info(
    { modules: MODULES.length, removed: removed.map((r) => r.slug) },
    "Program content synced from content/program.json",
  );
}

/** The deployment database gets no migration step, so create small new tables on boot. */
export async function ensureTables(): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS image_decisions (
      slot_id text PRIMARY KEY,
      decision text NOT NULL,
      file text,
      notes text,
      reviewer text,
      updated_at timestamptz NOT NULL DEFAULT now()
    )`);
}
