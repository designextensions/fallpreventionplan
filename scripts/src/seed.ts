import {
  db,
  modulesTable,
  liveSessionsTable,
  libraryItemsTable,
  usersTable,
  invoicesTable,
  conciergeNotesTable,
  conciergeCheckInsTable,
} from "@workspace/db";

const MODULES = [
  {
    slug: "intro-orientation",
    title: "Welcome & Orientation",
    subtitle: "How this program works and how to use it",
    order: 0,
    planSection: "intro",
    durationMin: 8,
    videoEmbedUrl: "https://player.vimeo.com/video/000000000",
    body: `## Welcome

Falls are the leading cause of injury for adults over 65 in the United States — but the great majority of falls are preventable. This program is built around a simple promise: small, consistent changes in four areas (movement, vision, medications, and home environment) can meaningfully lower your risk in a matter of weeks.

This orientation walks you through how the program is organized, how long each module takes, and how to get the most out of the live sessions.

## How to use the plan

The 10-Point Plan is meant to be worked through in order, but you can revisit any module as often as you like. We recommend one module a week. Print the worksheets, do the exercises, and bring questions to the live group classes.

## A note on safety

If you have had a recent fall, are recovering from surgery, or have a medical condition that affects balance, please talk with your doctor before starting any new exercise routine.`,
    keyPoints: [
      "Most falls are preventable — small, steady changes add up.",
      "Work through the modules in order, one per week is ideal.",
      "Bring questions to the live group sessions.",
    ],
    comingSoon: false,
    freeTier: true,
    printable: true,
  },
  {
    slug: "module-1-understanding-fall-risk",
    title: "Module 1 — Understanding Your Fall Risk",
    subtitle: "The four main risk factors and what to do about each",
    order: 1,
    planSection: "ten_point",
    durationMin: 22,
    videoEmbedUrl: "https://player.vimeo.com/video/000000001",
    body: `## What this module covers

In this first module you will learn the four risk factors that account for the vast majority of falls in older adults, how each one contributes, and which ones you can change. This is the foundation everything else in the plan is built on.

### 1. Movement and balance

Strength, flexibility, and balance all decline gradually with age — but they respond beautifully to practice at any age. Even short, simple routines done two or three times a week measurably reduce fall risk within six to eight weeks.

### 2. Vision

Poor vision is one of the most under-recognized contributors to falls. Bifocals and progressives, in particular, can distort your perception of stairs and curbs. Annual eye exams matter.

### 3. Medications

Many common medications — including some prescribed for blood pressure, sleep, anxiety, and pain — can cause dizziness or unsteadiness, especially in combination. A medication review with your pharmacist is one of the highest-leverage things you can do.

### 4. Home environment

The home is where most falls happen. Loose rugs, poor lighting, missing grab bars, and clutter are common culprits. Module 8 covers a full room-by-room walkthrough.

## Your homework for this module

1. Take the Fall Risk Self-Assessment if you have not already.
2. Note which of the four areas you scored highest in. That is where your plan starts.
3. Bring your top concern to the next live Q&A session.

## Printable

A one-page summary of this module is available to download below.`,
    keyPoints: [
      "Four risk factors cause most falls: movement, vision, medications, home environment.",
      "All four are modifiable — none are inevitable.",
      "Start with the area where you scored highest in the self-assessment.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "module-2-balance-foundations",
    title: "Module 2 — Balance Foundations",
    subtitle: "Daily five-minute practice",
    order: 2,
    planSection: "ten_point",
    durationMin: 18,
    body: null,
    keyPoints: [],
    comingSoon: true,
    freeTier: false,
    printable: false,
  },
  {
    slug: "module-3-strength",
    title: "Module 3 — Building Lower-Body Strength",
    subtitle: "Sit-to-stand, calf raises, and the wall squat",
    order: 3,
    planSection: "ten_point",
    durationMin: 20,
    body: null,
    keyPoints: [],
    comingSoon: true,
    freeTier: false,
    printable: false,
  },
  {
    slug: "module-4-vision",
    title: "Module 4 — Vision and Eyewear",
    subtitle: "Why your glasses might be working against you",
    order: 4,
    planSection: "ten_point",
    durationMin: 14,
    body: null,
    keyPoints: [],
    comingSoon: true,
    freeTier: false,
    printable: false,
  },
  {
    slug: "module-5-medications",
    title: "Module 5 — The Medication Review",
    subtitle: "A conversation with your pharmacist",
    order: 5,
    planSection: "ten_point",
    durationMin: 16,
    body: null,
    keyPoints: [],
    comingSoon: true,
    freeTier: false,
    printable: false,
  },
  {
    slug: "module-6-footwear",
    title: "Module 6 — Footwear That Works",
    subtitle: "What to look for, what to throw out",
    order: 6,
    planSection: "ten_point",
    durationMin: 12,
    body: null,
    keyPoints: [],
    comingSoon: true,
    freeTier: false,
    printable: false,
  },
  {
    slug: "module-7-nutrition",
    title: "Module 7 — Nutrition for Bone and Muscle",
    subtitle: "Protein, vitamin D, and hydration",
    order: 7,
    planSection: "ten_point",
    durationMin: 15,
    body: null,
    keyPoints: [],
    comingSoon: true,
    freeTier: false,
    printable: false,
  },
  {
    slug: "module-8-home-walkthrough",
    title: "Module 8 — Room-by-Room Home Walkthrough",
    subtitle: "Bathroom, bedroom, stairs, kitchen",
    order: 8,
    planSection: "ten_point",
    durationMin: 28,
    body: null,
    keyPoints: [],
    comingSoon: true,
    freeTier: false,
    printable: false,
  },
  {
    slug: "module-9-getting-up",
    title: "Module 9 — How to Get Up After a Fall",
    subtitle: "The technique everyone should practice once",
    order: 9,
    planSection: "ten_point",
    durationMin: 11,
    body: null,
    keyPoints: [],
    comingSoon: true,
    freeTier: false,
    printable: false,
  },
  {
    slug: "module-10-staying-the-course",
    title: "Module 10 — Staying the Course",
    subtitle: "Habits, routines, and asking for help",
    order: 10,
    planSection: "ten_point",
    durationMin: 17,
    body: null,
    keyPoints: [],
    comingSoon: true,
    freeTier: false,
    printable: false,
  },
  {
    slug: "five-point-quickstart",
    title: "5-Point Quick Start",
    subtitle: "The short version when you only have one afternoon",
    order: 20,
    planSection: "five_point",
    durationMin: 25,
    body: null,
    keyPoints: [],
    comingSoon: true,
    freeTier: false,
    printable: false,
  },
  {
    slug: "appendix-a-printable-worksheets",
    title: "Appendix A — Printable Worksheets",
    subtitle: "Every worksheet in one place",
    order: 30,
    planSection: "appendix_a",
    durationMin: null,
    body: null,
    keyPoints: [],
    comingSoon: true,
    freeTier: false,
    printable: false,
  },
  {
    slug: "appendix-b-resources",
    title: "Appendix B — Resources & Further Reading",
    subtitle: "Trusted books, sites, and organizations",
    order: 31,
    planSection: "appendix_b",
    durationMin: null,
    body: null,
    keyPoints: [],
    comingSoon: true,
    freeTier: false,
    printable: false,
  },
];

function daysFromNow(d: number, hour = 10): Date {
  const x = new Date();
  x.setDate(x.getDate() + d);
  x.setHours(hour, 0, 0, 0);
  return x;
}

const SESSIONS = [
  {
    kind: "class",
    title: "Live Balance Class with Dr. Hennessy",
    description:
      "A guided 45-minute session of seated and standing balance work. Suitable for all levels. Camera optional.",
    startsAt: daysFromNow(3, 10),
    durationMin: 45,
    host: "Dr. Anna Hennessy, DPT",
    joinUrl: "stub://zoom/balance-class",
  },
  {
    kind: "qa",
    title: "Members Q&A — Medications and Dizziness",
    description:
      "Bring your medication list. Bring your questions. Pharmacist Tom Reyes will join us for the full hour.",
    startsAt: daysFromNow(6, 13),
    durationMin: 60,
    host: "Tom Reyes, PharmD",
    joinUrl: "stub://zoom/qa-meds",
  },
  {
    kind: "class",
    title: "Home Walkthrough — What to Look For",
    description:
      "A camera-on session where we walk through a real apartment together and spot hazards in real time.",
    startsAt: daysFromNow(10, 11),
    durationMin: 45,
    host: "Marian Holloway, RN",
    joinUrl: "stub://zoom/home-walkthrough",
  },
];

const LIBRARY = [
  {
    title: "Recording — Last Month's Balance Class",
    kind: "recording",
    summary:
      "If you missed the live session in April, the full recording is here. Skip ahead with chapter markers.",
    publishedAt: daysFromNow(-12, 10),
    durationMin: 47,
  },
  {
    title: "Article — Why Bifocals Cause Falls (and What to Do)",
    kind: "article",
    summary:
      "A short, practical piece on how progressive lenses distort your view of stairs, and the simple two-glasses trick that helps.",
    publishedAt: daysFromNow(-21, 9),
    durationMin: 6,
  },
  {
    title: "Interview — A Conversation with Dr. Steven Wolf",
    kind: "interview",
    summary:
      "Dr. Wolf, one of the country's leading researchers on Tai Chi for fall prevention, joins us for a long-form conversation about what actually works.",
    publishedAt: daysFromNow(-34, 14),
    durationMin: 38,
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

async function main() {
  console.log("Seeding modules...");
  for (const m of MODULES) {
    await db
      .insert(modulesTable)
      .values(m as never)
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

  console.log("Seeding live sessions...");
  for (const s of SESSIONS) {
    await db.insert(liveSessionsTable).values(s as never);
  }

  console.log("Seeding library items...");
  for (const li of LIBRARY) {
    await db.insert(libraryItemsTable).values(li as never);
  }

  console.log("Seeding demo members...");
  for (const member of SEED_MEMBERS) {
    await db
      .insert(usersTable)
      .values(member as never)
      .onConflictDoNothing();
  }

  console.log("Seeding sample invoices and concierge data...");
  const allUsers = await db.select().from(usersTable);
  for (const u of allUsers) {
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
        fromName: "Marian Holloway, RN",
        message:
          "Checking in after our home walkthrough — how did installing the bathroom grab bar go? Let me know if you'd like help finding a handyman.",
      });
      await db.insert(conciergeNotesTable).values({
        userId: u.id,
        authorName: "Marian Holloway, RN",
        body: "Completed initial intake call. Member's daughter joined. Identified bathroom and bedside lighting as top priorities.",
      });
      await db.insert(conciergeNotesTable).values({
        userId: u.id,
        authorName: "Marian Holloway, RN",
        body: "Scheduled medication review with Tom Reyes for next week.",
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
