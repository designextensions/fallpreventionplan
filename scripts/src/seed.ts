import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  db,
  notInArray,
  modulesTable,
  liveSessionsTable,
  libraryItemsTable,
  usersTable,
  invoicesTable,
  conciergeNotesTable,
  conciergeCheckInsTable,
} from "@workspace/db";

// ---------------------------------------------------------------------------
// CONTENT SOURCE OF TRUTH
//
// Program content comes from ../../content/program.json, which is generated from
// Dr. Angell's Aug 10 2026 "FPP WEBSITE TEMPLATE.docx" by
//   ../../../tools/extract-template.py  ->  ../../../FPP-WEBSITE-TEMPLATE.md
//   ../../../tools/build-content.py     ->  content/program.json
// Never hand-edit content here. His corrections go into the docx, then re-run both
// tools and re-seed. Authoring conventions (idea blocks, image/video/printout slots)
// are documented in FPP-WEBSITE-TEMPLATE.md and rendered by BlockRenderer.tsx.
// ---------------------------------------------------------------------------

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

const here = path.dirname(fileURLToPath(import.meta.url));
const program = JSON.parse(
  readFileSync(path.resolve(here, "../../content/program.json"), "utf8"),
) as { modules: ModuleSeed[] };
const MODULES: ModuleSeed[] = program.modules;

function daysFromNow(d: number, hour = 10): Date {
  const x = new Date();
  x.setDate(x.getDate() + d);
  x.setHours(hour, 0, 0, 0);
  return x;
}

// Tier 2 (subscription) includes regular exercise classes and a weekly Q&A.
// Geoff's classes are recorded so members can follow along anytime (he did NOT
// want them framed as "live"). Representative upcoming/recurring sessions.
const SESSIONS = [
  {
    kind: "class",
    title: "Balance Class",
    description:
      "A guided session working through the Fall Prevention Plan balance programs. Suitable for all levels — follow along at your own program level. Camera optional.",
    startsAt: daysFromNow(1, 10),
    durationMin: 45,
    host: "Dr. Geoff Angell, DPT",
    joinUrl: "stub://zoom/balance-class",
  },
  {
    kind: "class",
    title: "Strength Class",
    description:
      "A guided strength session based on the Home Exercise Programs — strength, flexibility, and endurance for fall prevention.",
    startsAt: daysFromNow(2, 10),
    durationMin: 45,
    host: "Dr. Geoff Angell, DPT",
    joinUrl: "stub://zoom/strength-class",
  },
  {
    kind: "qa",
    title: "Weekly Members Q&A",
    description:
      "Bring your questions about any step of the plan — footwear, medications, home safety, exercises, and more.",
    startsAt: daysFromNow(4, 13),
    durationMin: 60,
    host: "Dr. Geoff Angell, DPT",
    joinUrl: "stub://zoom/weekly-qa",
  },
];

const LIBRARY = [
  {
    title: "Recording — Balance Class",
    kind: "recording",
    summary:
      "Missed the balance class? The full recording is available here to follow along anytime.",
    publishedAt: daysFromNow(-7, 10),
    durationMin: 45,
  },
  {
    title: "Recording — Strength Class",
    kind: "recording",
    summary:
      "A recorded strength session based on the Home Exercise Programs, ready to follow along with at home.",
    publishedAt: daysFromNow(-5, 10),
    durationMin: 45,
  },
  {
    title: "Recording — Members Q&A",
    kind: "recording",
    summary:
      "A recording of a recent members Q&A covering medications, footwear, and home safety questions.",
    publishedAt: daysFromNow(-3, 13),
    durationMin: 60,
  },
];

const SEED_MEMBERS = [
  { email: "evelyn.harper@example.com", name: "Evelyn Harper", tier: "subscription" },
  { email: "raymond.osei@example.com", name: "Raymond Osei", tier: "concierge" },
  { email: "barbara.kim@example.com", name: "Barbara Kim", tier: "one_time" },
  { email: "joseph.delgado@example.com", name: "Joseph Delgado", tier: "subscription" },
  { email: "marion.fitzgerald@example.com", name: "Marion Fitzgerald", tier: "guest" },
  { email: "admin@fallpreventionplan.com", name: "Admin Demo", tier: "admin" },
];

// CONTENT_ONLY seeds just the real program (modules) — used in production /
// post-merge so a deploy gets Dr. Angell's content with no demo members,
// sample classes, or fake billing. The full seed (demo data) is for local dev.
const CONTENT_ONLY = process.env.SEED_CONTENT_ONLY === "1";

async function main() {
  console.log(`Seeding modules${CONTENT_ONLY ? " (content-only)" : ""}...`);
  for (const m of MODULES) {
    const { chapter: _chapter, ...row } = m;
    await db
      .insert(modulesTable)
      .values(row)
      .onConflictDoUpdate({
        target: modulesTable.slug,
        set: {
          title: m.title,
          subtitle: m.subtitle,
          order: m.order,
          planSection: m.planSection,
          durationMin: m.durationMin,
          videoEmbedUrl: m.videoEmbedUrl ?? null,
          body: m.body,
          keyPoints: m.keyPoints,
          comingSoon: m.comingSoon,
          freeTier: m.freeTier,
          printable: m.printable,
        },
      });
  }
  // Sections that no longer exist in the Aug 10 content (e.g. the June "react-after-a-fall"
  // module, now folded into "Minimizing the Risk of a Fall-Related Injury").
  const keep = MODULES.map((m) => m.slug);
  const removed = await db
    .delete(modulesTable)
    .where(notInArray(modulesTable.slug, keep))
    .returning({ slug: modulesTable.slug });
  if (removed.length) console.log(`Removed ${removed.length} superseded module(s): ${removed.map((r) => r.slug).join(", ")}`);

  if (CONTENT_ONLY) {
    console.log(`Done. Seeded ${MODULES.length} program modules (content-only).`);
    return;
  }

  // Classes/library are demo data — only seed when empty so re-running the seed
  // (e.g. on production) never creates duplicates.
  const existingSessions = await db.select().from(liveSessionsTable);
  if (existingSessions.length === 0) {
    console.log("Seeding live sessions...");
    for (const s of SESSIONS) {
      await db.insert(liveSessionsTable).values(s as never);
    }
  } else {
    console.log(`Live sessions already present (${existingSessions.length}) — skipping.`);
  }

  const existingLibrary = await db.select().from(libraryItemsTable);
  if (existingLibrary.length === 0) {
    console.log("Seeding library items...");
    for (const li of LIBRARY) {
      await db.insert(libraryItemsTable).values(li as never);
    }
  } else {
    console.log(`Library items already present (${existingLibrary.length}) — skipping.`);
  }

  console.log("Seeding demo members...");
  for (const member of SEED_MEMBERS) {
    await db
      .insert(usersTable)
      .values(member as never)
      .onConflictDoNothing();
  }

  // Sample invoices/concierge data — ONLY for the demo seed accounts (never real
  // signups), and only when no invoices exist yet (idempotent).
  const demoEmails = new Set(SEED_MEMBERS.map((m) => m.email));
  const existingInvoices = await db.select().from(invoicesTable);
  const demoUsers =
    existingInvoices.length === 0
      ? (await db.select().from(usersTable)).filter((u) => demoEmails.has(u.email))
      : [];
  if (existingInvoices.length === 0) {
    console.log("Seeding sample invoices and concierge data...");
  } else {
    console.log("Invoices already present — skipping sample billing/concierge data.");
  }
  for (const u of demoUsers) {
    if (u.tier === "one_time") {
      await db.insert(invoicesTable).values({
        userId: u.id,
        description: "Lifetime access — Fall Prevention Plan",
        amountCents: 5000,
        paidAt: daysFromNow(-40, 9),
      });
    } else if (u.tier === "subscription") {
      await db.insert(invoicesTable).values({
        userId: u.id,
        description: "Monthly Membership",
        amountCents: 1900,
        paidAt: daysFromNow(-30, 9),
      });
      await db.insert(invoicesTable).values({
        userId: u.id,
        description: "Monthly Membership",
        amountCents: 1900,
        paidAt: daysFromNow(-60, 9),
      });
    } else if (u.tier === "concierge") {
      await db.insert(invoicesTable).values({
        userId: u.id,
        description: "Concierge Program — monthly",
        amountCents: 29900,
        paidAt: daysFromNow(-15, 9),
      });
      await db.insert(conciergeCheckInsTable).values({
        userId: u.id,
        fromName: "Dr. Geoff Angell, DPT",
        message:
          "Checking in after our home walkthrough — how did installing the bathroom grab bars go? Let me know if you'd like help finding a handyman.",
      });
      await db.insert(conciergeNotesTable).values({
        userId: u.id,
        authorName: "Dr. Geoff Angell, DPT",
        body: "Completed initial intake call. Member's daughter joined. Identified bathroom and bedside lighting as top priorities.",
      });
      await db.insert(conciergeNotesTable).values({
        userId: u.id,
        authorName: "Dr. Geoff Angell, DPT",
        body: "Reviewed the TUG self-assessment result and recommended starting the Level 3 balance program.",
      });
    }
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
