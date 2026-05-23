import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc, asc, gte } from "drizzle-orm";
import {
  db,
  usersTable,
  assessmentsTable,
  modulesTable,
  liveSessionsTable,
  libraryItemsTable,
  invoicesTable,
  conciergeNotesTable,
  conciergeCheckInsTable,
} from "@workspace/db";
import {
  GetMeResponse,
  GetAssessmentQuestionsResponse,
  SubmitAssessmentBody,
  SubmitAssessmentResponse,
  GetMyAssessmentResponse,
  ListModulesResponse,
  GetModuleParams,
  GetModuleResponse,
  ListUpcomingSessionsResponse,
  ListLibraryItemsResponse,
  GetBillingSummaryResponse,
  MockCheckoutBody,
  MockCheckoutResponse,
  CancelSubscriptionResponse,
  GetMyConciergeDashboardResponse,
  ListAdminMembersResponse,
  GetAdminStatsResponse,
  ListAdminModulesResponse,
  GetAdminModuleResponse,
  GetAdminModuleParams,
  CreateAdminModuleBody,
  CreateAdminModuleResponse,
  UpdateAdminModuleBody,
  UpdateAdminModuleParams,
  UpdateAdminModuleResponse,
  DeleteAdminModuleParams,
  DeleteAdminModuleResponse,
} from "@workspace/api-zod";
import { getCurrentUser, type Tier } from "../lib/currentUser";
import { assessmentQuestions, scoreAssessment } from "../lib/questions";

const router: IRouter = Router();

function unlockedFor(tier: Tier, freeTier: boolean): boolean {
  if (tier === "guest") return false;
  if (freeTier) return true;
  return tier === "one_time" || tier === "subscription" || tier === "concierge" || tier === "admin";
}

router.get("/me", async (req: Request, res: Response): Promise<void> => {
  const me = await getCurrentUser(req);
  res.json(
    GetMeResponse.parse({
      signedIn: me.signedIn,
      tier: me.tier,
      email: me.user?.email ?? null,
      name: me.user?.name ?? null,
      joinedAt: me.user?.createdAt ?? null,
    }),
  );
});

router.get("/assessment/questions", async (_req, res): Promise<void> => {
  res.json(GetAssessmentQuestionsResponse.parse(assessmentQuestions));
});

router.post("/assessment/submit", async (req, res): Promise<void> => {
  const parsed = SubmitAssessmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const scored = scoreAssessment(parsed.data.answers);
  const me = await getCurrentUser(req);

  const [saved] = await db
    .insert(assessmentsTable)
    .values({
      userId: me.user?.id ?? null,
      guestEmail: parsed.data.email ?? null,
      guestName: parsed.data.name ?? null,
      answers: parsed.data.answers,
      score: scored.score,
      level: scored.level,
    })
    .returning();

  res.json(
    SubmitAssessmentResponse.parse({
      score: scored.score,
      level: scored.level,
      headline: scored.headline,
      summary: scored.summary,
      recommendations: scored.recommendations,
      completedAt: saved!.completedAt,
    }),
  );
});

router.get("/assessment/me", async (req, res): Promise<void> => {
  const me = await getCurrentUser(req);
  if (!me.user) {
    res.json(null);
    return;
  }
  const [latest] = await db
    .select()
    .from(assessmentsTable)
    .where(eq(assessmentsTable.userId, me.user.id))
    .orderBy(desc(assessmentsTable.completedAt))
    .limit(1);

  if (!latest) {
    res.json(null);
    return;
  }

  const scored = scoreAssessment((latest.answers as { questionId: string; value: string }[]) ?? []);
  res.json(
    GetMyAssessmentResponse.parse({
      score: latest.score,
      level: latest.level,
      headline: scored.headline,
      summary: scored.summary,
      recommendations: scored.recommendations,
      completedAt: latest.completedAt,
    }),
  );
});

router.get("/modules", async (req, res): Promise<void> => {
  const me = await getCurrentUser(req);
  const rows = await db.select().from(modulesTable).orderBy(asc(modulesTable.order));
  const out = rows.map((m) => ({
    slug: m.slug,
    title: m.title,
    subtitle: m.subtitle,
    order: m.order,
    planSection: m.planSection as "intro" | "ten_point" | "five_point" | "appendix_a" | "appendix_b",
    durationMin: m.durationMin,
    locked: !unlockedFor(me.tier, m.freeTier),
    comingSoon: m.comingSoon,
  }));
  res.json(ListModulesResponse.parse(out));
});

router.get("/modules/:slug", async (req, res): Promise<void> => {
  const params = GetModuleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const me = await getCurrentUser(req);
  const [row] = await db
    .select()
    .from(modulesTable)
    .where(eq(modulesTable.slug, params.data.slug));

  if (!row) {
    res.status(404).json({ error: "Module not found" });
    return;
  }

  const unlocked = unlockedFor(me.tier, row.freeTier);
  res.json(
    GetModuleResponse.parse({
      slug: row.slug,
      title: row.title,
      subtitle: row.subtitle,
      order: row.order,
      planSection: row.planSection,
      durationMin: row.durationMin,
      locked: !unlocked,
      comingSoon: row.comingSoon,
      videoEmbedUrl: unlocked ? row.videoEmbedUrl : null,
      body: unlocked ? row.body : null,
      keyPoints: row.keyPoints ?? [],
      printable: row.printable,
    }),
  );
});

router.get("/sessions/upcoming", async (_req, res): Promise<void> => {
  const now = new Date();
  const rows = await db
    .select()
    .from(liveSessionsTable)
    .where(gte(liveSessionsTable.startsAt, now))
    .orderBy(asc(liveSessionsTable.startsAt));
  res.json(ListUpcomingSessionsResponse.parse(rows));
});

router.get("/library", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(libraryItemsTable)
    .orderBy(desc(libraryItemsTable.publishedAt));
  res.json(ListLibraryItemsResponse.parse(rows));
});

function priceLabelFor(tier: Tier): string | null {
  switch (tier) {
    case "one_time":
      return "One-Time — Lifetime access ($50)";
    case "subscription":
      return "Monthly Membership — $19/month";
    case "concierge":
      return "Concierge — $299/month";
    case "admin":
      return "Administrator";
    default:
      return null;
  }
}

function nextChargeFor(tier: Tier): Date | null {
  if (tier === "subscription" || tier === "concierge") {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  }
  return null;
}

router.get("/billing/summary", async (req, res): Promise<void> => {
  const me = await getCurrentUser(req);
  const invoices = me.user
    ? await db
        .select()
        .from(invoicesTable)
        .where(eq(invoicesTable.userId, me.user.id))
        .orderBy(desc(invoicesTable.paidAt))
    : [];
  res.json(
    GetBillingSummaryResponse.parse({
      tier: me.tier,
      priceLabel: priceLabelFor(me.tier),
      nextChargeAt: nextChargeFor(me.tier),
      invoices,
    }),
  );
});

router.post("/billing/checkout", async (req, res): Promise<void> => {
  const parsed = MockCheckoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const me = await getCurrentUser(req);
  if (!me.user) {
    res.status(401).json({ error: "Please sign in to complete checkout." });
    return;
  }

  const tierMap: Record<typeof parsed.data.plan, Tier> = {
    one_time: "one_time",
    subscription: "subscription",
    concierge: "concierge",
  };
  const newTier = tierMap[parsed.data.plan];
  const amount = parsed.data.plan === "one_time" ? 5000 : parsed.data.plan === "subscription" ? 1900 : 29900;
  const description =
    parsed.data.plan === "one_time"
      ? "Lifetime access — Fall Prevention Plan"
      : parsed.data.plan === "subscription"
        ? "Monthly Membership"
        : "Concierge Program — initial month";

  await db.update(usersTable).set({ tier: newTier }).where(eq(usersTable.id, me.user.id));
  await db
    .insert(invoicesTable)
    .values({ userId: me.user.id, description, amountCents: amount });

  const invoices = await db
    .select()
    .from(invoicesTable)
    .where(eq(invoicesTable.userId, me.user.id))
    .orderBy(desc(invoicesTable.paidAt));

  res.json(
    MockCheckoutResponse.parse({
      tier: newTier,
      priceLabel: priceLabelFor(newTier),
      nextChargeAt: nextChargeFor(newTier),
      invoices,
    }),
  );
});

router.post("/billing/cancel", async (req, res): Promise<void> => {
  const me = await getCurrentUser(req);
  if (!me.user) {
    res.status(401).json({ error: "Please sign in." });
    return;
  }
  await db.update(usersTable).set({ tier: "guest" }).where(eq(usersTable.id, me.user.id));
  const invoices = await db
    .select()
    .from(invoicesTable)
    .where(eq(invoicesTable.userId, me.user.id))
    .orderBy(desc(invoicesTable.paidAt));
  res.json(
    CancelSubscriptionResponse.parse({
      tier: "guest",
      priceLabel: null,
      nextChargeAt: null,
      invoices,
    }),
  );
});

router.get("/concierge/me", async (req, res): Promise<void> => {
  const me = await getCurrentUser(req);

  const memberName = me.user?.name ?? "Friend";
  const nextOutreach = new Date();
  nextOutreach.setDate(nextOutreach.getDate() + 3);
  nextOutreach.setHours(10, 0, 0, 0);

  let latestCheckIn = {
    id: 0,
    fromName: "Marian Holloway, RN",
    message:
      "Just checking in after our last call. Remember to do your evening balance routine — even five minutes makes a difference. I'll see you Thursday at 10.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
  };
  let notes: { id: number; authorName: string; body: string; createdAt: Date }[] = [
    {
      id: 1,
      authorName: "Marian Holloway, RN",
      body: "Confirmed home assessment for next week. Member will email photos of the bathroom in advance.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: 2,
      authorName: "Marian Holloway, RN",
      body: "Reviewed medication list with member's daughter. Flagged two prescriptions to discuss with PCP.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    },
  ];

  if (me.user) {
    const checkIns = await db
      .select()
      .from(conciergeCheckInsTable)
      .where(eq(conciergeCheckInsTable.userId, me.user.id))
      .orderBy(desc(conciergeCheckInsTable.createdAt))
      .limit(1);
    if (checkIns[0]) latestCheckIn = checkIns[0];

    const noteRows = await db
      .select()
      .from(conciergeNotesTable)
      .where(eq(conciergeNotesTable.userId, me.user.id))
      .orderBy(desc(conciergeNotesTable.createdAt));
    if (noteRows.length > 0) notes = noteRows;
  }

  res.json(
    GetMyConciergeDashboardResponse.parse({
      memberName,
      nextOutreachAt: nextOutreach,
      latestCheckIn,
      notes,
    }),
  );
});

router.get("/admin/members", async (req, res): Promise<void> => {
  const me = await getCurrentUser(req);
  if (me.tier !== "admin") {
    res.status(403).json({ error: "Admin access required." });
    return;
  }
  const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
  const out = await Promise.all(
    users.map(async (u) => {
      const [latest] = await db
        .select()
        .from(assessmentsTable)
        .where(eq(assessmentsTable.userId, u.id))
        .orderBy(desc(assessmentsTable.completedAt))
        .limit(1);
      return {
        id: u.id,
        name: u.name ?? u.email.split("@")[0] ?? "Member",
        email: u.email,
        tier: u.tier,
        signupDate: u.createdAt,
        lastLogin: u.lastLoginAt,
        assessmentScore: latest?.score ?? null,
        riskLevel: latest ? (latest.level as "low" | "moderate" | "high") : null,
      };
    }),
  );
  res.json(ListAdminMembersResponse.parse(out));
});

router.get("/admin/stats", async (req, res): Promise<void> => {
  const me = await getCurrentUser(req);
  if (me.tier !== "admin") {
    res.status(403).json({ error: "Admin access required." });
    return;
  }
  const users = await db.select().from(usersTable);
  const assessments = await db.select().from(assessmentsTable);
  let mrr = 0;
  let oneTime = 0;
  let sub = 0;
  let con = 0;
  for (const u of users) {
    if (u.tier === "subscription") {
      sub += 1;
      mrr += 1900;
    } else if (u.tier === "concierge") {
      con += 1;
      mrr += 29900;
    } else if (u.tier === "one_time") {
      oneTime += 1;
    }
  }
  res.json(
    GetAdminStatsResponse.parse({
      totalMembers: users.length,
      subscriptionMembers: sub,
      conciergeMembers: con,
      oneTimeMembers: oneTime,
      assessmentsCompleted: assessments.length,
      mrrCents: mrr,
    }),
  );
});

// ---------- Admin: Course (module) management ----------

async function requireAdmin(req: Request, res: Response): Promise<boolean> {
  const me = await getCurrentUser(req);
  if (me.tier !== "admin") {
    res.status(403).json({ error: "Admin access required." });
    return false;
  }
  return true;
}

function toAdminModule(row: typeof modulesTable.$inferSelect) {
  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    order: row.order,
    planSection: row.planSection as
      | "intro"
      | "ten_point"
      | "five_point"
      | "appendix_a"
      | "appendix_b",
    durationMin: row.durationMin,
    videoEmbedUrl: row.videoEmbedUrl,
    body: row.body,
    keyPoints: row.keyPoints ?? [],
    comingSoon: row.comingSoon,
    freeTier: row.freeTier,
    printable: row.printable,
  };
}

router.get("/admin/modules", async (req, res): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;
  const rows = await db.select().from(modulesTable).orderBy(asc(modulesTable.order));
  res.json(ListAdminModulesResponse.parse(rows.map(toAdminModule)));
});

router.get("/admin/modules/:slug", async (req, res): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;
  const params = GetAdminModuleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(modulesTable)
    .where(eq(modulesTable.slug, params.data.slug));
  if (!row) {
    res.status(404).json({ error: "Module not found" });
    return;
  }
  res.json(GetAdminModuleResponse.parse(toAdminModule(row)));
});

router.post("/admin/modules", async (req, res): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;
  const body = CreateAdminModuleBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const existing = await db
    .select({ id: modulesTable.id })
    .from(modulesTable)
    .where(eq(modulesTable.slug, body.data.slug));
  if (existing.length > 0) {
    res.status(409).json({ error: "A module with that slug already exists." });
    return;
  }
  const [created] = await db
    .insert(modulesTable)
    .values({
      slug: body.data.slug,
      title: body.data.title,
      subtitle: body.data.subtitle ?? null,
      order: body.data.order,
      planSection: body.data.planSection,
      durationMin: body.data.durationMin ?? null,
      videoEmbedUrl: body.data.videoEmbedUrl ?? null,
      body: body.data.body ?? null,
      keyPoints: body.data.keyPoints ?? [],
      comingSoon: body.data.comingSoon ?? false,
      freeTier: body.data.freeTier ?? false,
      printable: body.data.printable ?? false,
    })
    .returning();
  res.json(CreateAdminModuleResponse.parse(toAdminModule(created)));
});

router.put("/admin/modules/:slug", async (req, res): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;
  const params = UpdateAdminModuleParams.safeParse(req.params);
  const body = UpdateAdminModuleBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({
      error: !params.success ? params.error.message : body.error!.message,
    });
    return;
  }
  const [existing] = await db
    .select()
    .from(modulesTable)
    .where(eq(modulesTable.slug, params.data.slug));
  if (!existing) {
    res.status(404).json({ error: "Module not found" });
    return;
  }
  // If slug is being changed, ensure new slug is unique.
  if (body.data.slug !== params.data.slug) {
    const conflict = await db
      .select({ id: modulesTable.id })
      .from(modulesTable)
      .where(eq(modulesTable.slug, body.data.slug));
    if (conflict.length > 0) {
      res.status(409).json({ error: "Another module already uses that slug." });
      return;
    }
  }
  const [updated] = await db
    .update(modulesTable)
    .set({
      slug: body.data.slug,
      title: body.data.title,
      subtitle: body.data.subtitle ?? null,
      order: body.data.order,
      planSection: body.data.planSection,
      durationMin: body.data.durationMin ?? null,
      videoEmbedUrl: body.data.videoEmbedUrl ?? null,
      body: body.data.body ?? null,
      keyPoints: body.data.keyPoints ?? [],
      comingSoon: body.data.comingSoon ?? false,
      freeTier: body.data.freeTier ?? false,
      printable: body.data.printable ?? false,
    })
    .where(eq(modulesTable.id, existing.id))
    .returning();
  res.json(UpdateAdminModuleResponse.parse(toAdminModule(updated)));
});

router.delete("/admin/modules/:slug", async (req, res): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;
  const params = DeleteAdminModuleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const result = await db
    .delete(modulesTable)
    .where(eq(modulesTable.slug, params.data.slug))
    .returning({ id: modulesTable.id });
  if (result.length === 0) {
    res.status(404).json({ error: "Module not found" });
    return;
  }
  res.json(DeleteAdminModuleResponse.parse({ ok: true }));
});

export default router;
