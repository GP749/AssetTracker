import { cookies } from "next/headers";
import { prisma } from "./db";

const COOKIE_NAME = "memberId";

export async function getCurrentMember() {
  const id = (await cookies()).get(COOKIE_NAME)?.value;
  if (!id) return null;
  return prisma.member.findUnique({ where: { id } });
}

export async function getCurrentMemberId(): Promise<string | null> {
  return (await cookies()).get(COOKIE_NAME)?.value ?? null;
}
