import { RateLimiterPrisma } from "rate-limiter-flexible";
import db from "./db";
import { auth } from "@clerk/nextjs/server";

export const FREE_POINTS = 5;
export const PRO_POINTS = 100;
export const DURATION = 30 * 24 * 60 * 60; // 30 days
export const GENERATION_COST = 1;

export async function getUsageTracker() {
  const { has } = await auth();

  // Clerk's `has` expects `plan`, not `plane`.
  const hasProAccess = has({ plan: "pro" });

  const usageTracker = new RateLimiterPrisma({
    storeClient: db,
    tableName: "Usage",
    points: hasProAccess ? PRO_POINTS : FREE_POINTS,
    duration: DURATION,
  });

  return usageTracker;
}

export async function consumeCredits() {
  const { userId } = await auth();

  if (!userId) throw new Error("Not authenticated");

  const usageTracker = await getUsageTracker();

  const result = await usageTracker.consume(userId, GENERATION_COST);

  return result;
}

export async function getUsageStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const usageTracker = await getUsageTracker();

  try {
    const result = await usageTracker.get(userId);

    // The result has to actually be returned, otherwise every caller sees
    // `undefined` and treats the user as if they had never consumed credits.
    return result ?? null;
  } catch (error) {
    console.error("Error getting usage status:", error);
    return null;
  }
}
