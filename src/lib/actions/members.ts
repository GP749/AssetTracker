"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { hashPassword, requireSession } from "@/lib/auth";

export async function createMember(formData: FormData) {
  await requireSession();
  const name = String(formData.get("name") ?? "").trim();
  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name) throw new Error("Name is required.");
  if (!username) throw new Error("Username is required.");
  if (!/^[a-z0-9_]{2,20}$/.test(username)) {
    throw new Error(
      "Username must be 2–20 chars, lowercase letters / digits / underscore.",
    );
  }
  if (password.length < 4) {
    throw new Error("Password must be at least 4 characters.");
  }
  const existing = await prisma.member.findUnique({ where: { username } });
  if (existing) throw new Error("That username is already taken.");

  await prisma.member.create({
    data: {
      name,
      username,
      passwordHash: hashPassword(password),
    },
  });
  revalidatePath("/members");
  revalidatePath("/");
}

export async function deleteMember(formData: FormData) {
  const sessionMemberId = await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing member id.");
  if (id === sessionMemberId) {
    throw new Error("You can't remove yourself while signed in.");
  }
  const count = await prisma.checkout.count({ where: { memberId: id } });
  if (count > 0) {
    throw new Error(
      `Can't delete — this member has ${count} checkout(s) in the history. Leave them in the team list to preserve the audit log.`,
    );
  }
  await prisma.member.delete({ where: { id } });
  revalidatePath("/members");
  revalidatePath("/");
}
