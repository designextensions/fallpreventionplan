import type { Request } from "express";
import { getAuth, clerkClient } from "@clerk/express";
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

export async function getCurrentUser(req: Request): Promise<CurrentUser> {
  const auth = getAuth(req);
  const clerkUserId: string | undefined =
    (auth?.sessionClaims as { userId?: string } | undefined)?.userId ?? auth?.userId ?? undefined;

  if (!clerkUserId) {
    return { signedIn: false, tier: "guest", user: null };
  }

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkId, clerkUserId))
    .limit(1);

  if (existing.length > 0) {
    const user = existing[0]!;
    await db
      .update(usersTable)
      .set({ lastLoginAt: new Date() })
      .where(eq(usersTable.id, user.id));
    return { signedIn: true, tier: user.tier as Tier, user };
  }

  let email = "";
  let name: string | null = null;
  try {
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    email =
      clerkUser.primaryEmailAddress?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress ??
      "";
    const parts = [clerkUser.firstName, clerkUser.lastName]
      .filter((s): s is string => !!s)
      .join(" ");
    name = parts || clerkUser.username || null;
  } catch {
    // best-effort
  }

  const tier: Tier = ADMIN_EMAILS.has(email.toLowerCase())
    ? "admin"
    : "guest";

  const [created] = await db
    .insert(usersTable)
    .values({ clerkId: clerkUserId, email, name, tier })
    .returning();

  return { signedIn: true, tier, user: created ?? null };
}
