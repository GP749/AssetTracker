"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

function parseIds(formData: FormData): string[] {
  const raw = String(formData.get("ids") ?? "");
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function bulkRelocate(formData: FormData) {
  const ids = parseIds(formData);
  const location = String(formData.get("location") ?? "").trim() || null;
  if (ids.length === 0) throw new Error("No tools selected.");

  await prisma.tool.updateMany({
    where: { id: { in: ids } },
    data: { location },
  });

  revalidatePath("/");
}

export async function bulkSendToMaintenance(formData: FormData) {
  const ids = parseIds(formData);
  const reason = String(formData.get("reason") ?? "").trim() || null;
  if (ids.length === 0) throw new Error("No tools selected.");

  // Don't send currently-checked-out tools to maintenance.
  const blocked = await prisma.tool.count({
    where: { id: { in: ids }, status: "CHECKED_OUT" },
  });
  if (blocked > 0) {
    throw new Error(
      `${blocked} of the selected tool(s) are currently checked out — return them first.`,
    );
  }

  await prisma.tool.updateMany({
    where: { id: { in: ids } },
    data: {
      status: "MAINTENANCE",
      maintenanceReason: reason,
      maintenanceStartedAt: new Date(),
    },
  });

  revalidatePath("/");
}
