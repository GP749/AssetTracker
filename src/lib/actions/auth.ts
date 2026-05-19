"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  clearSession,
  hashPassword,
  setSession,
  verifyPassword,
} from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function signIn(formData: FormData) {
  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/");

  if (!username || !password) {
    throw new Error("Username and password are required.");
  }

  const member = await prisma.member.findUnique({ where: { username } });
  if (!member || !verifyPassword(password, member.passwordHash)) {
    // Same error to avoid leaking which usernames exist.
    throw new Error("Invalid username or password.");
  }

  await setSession(member.id);
  redirect(safeNext(next));
}

export async function signOut() {
  await clearSession();
  revalidatePath("/");
  redirect("/");
}

export async function changeMyPassword(formData: FormData) {
  const memberId = String(formData.get("memberId") ?? "");
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!memberId) throw new Error("Missing memberId.");
  if (newPassword.length < 4)
    throw new Error("New password must be at least 4 characters.");
  if (newPassword !== confirmPassword)
    throw new Error("New password and confirmation don't match.");

  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (!member) throw new Error("Member not found.");
  if (!verifyPassword(currentPassword, member.passwordHash))
    throw new Error("Current password is incorrect.");

  await prisma.member.update({
    where: { id: memberId },
    data: { passwordHash: hashPassword(newPassword) },
  });
  revalidatePath("/members");
}

function safeNext(next: string): string {
  // Only allow same-origin internal paths.
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }
  return next;
}
