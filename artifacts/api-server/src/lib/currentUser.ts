import type { Request } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, type User } from "@workspace/db";

export type Tier = "guest" | "one_time" | "subscription" | "concierge" | "admin";

export interface CurrentUser {
  signedIn: boolean;
  tier: Tier;
  user: User | null;
}

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "admin@fallpreventionplan.com")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
);

function parseDemoAuth(req: Request): { email: string; name: string | null; tier: Tier } | null {
  const header = req.header("authorization");
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  let payload: { email?: string; name?: string | null; tier?: Tier };
  try {
    payload = JSON.parse(atob(match[1]!));
  } catch {
    return null;
  }
  const email = (payload.email ?? "").trim().toLowerCase();
  if (!email) return null;
  const tier: Tier = ADMIN_EMAILS.has(email)
    ? "admin"
    : (payload.tier ?? "subscription");
  return { email, name: payload.name ?? null, tier };
}

export async function getCurrentUser(req: Request): Promise<CurrentUser> {
  const demo = parseDemoAuth(req);
  if (!demo) {
    return { signedIn: false, tier: "guest", user: null };
  }

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, demo.email))
    .limit(1);

  if (existing.length > 0) {
    const user = existing[0]!;
    // Keep tier in sync when admin email is configured.
    const desiredTier = ADMIN_EMAILS.has(demo.email) ? "admin" : user.tier;
    const [updated] = await db
      .update(usersTable)
      .set({ lastLoginAt: new Date(), tier: desiredTier, name: demo.name ?? user.name })
      .where(eq(usersTable.id, user.id))
      .returning();
    return { signedIn: true, tier: (updated?.tier as Tier) ?? "guest", user: updated ?? user };
  }

  const [created] = await db
    .insert(usersTable)
    .values({ email: demo.email, name: demo.name, tier: demo.tier })
    .returning();

  return { signedIn: true, tier: demo.tier, user: created ?? null };
}
