"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function createMember(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required.");
  await prisma.member.create({ data: { name } });
  revalidatePath("/members");
  revalidatePath("/");
}

export async function deleteMember(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing member id.");
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
