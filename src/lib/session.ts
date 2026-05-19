/**
 * Session helpers. Delegates to lib/auth for cookie signing/verification,
 * and adds Prisma lookups for the current member.
 */

import { prisma } from "./db";
import { getSessionMemberId } from "./auth";

export async function getCurrentMember() {
  const id = await getSessionMemberId();
  if (!id) return null;
  return prisma.member.findUnique({ where: { id } });
}

export async function getCurrentMemberId(): Promise<string | null> {
  return getSessionMemberId();
}
