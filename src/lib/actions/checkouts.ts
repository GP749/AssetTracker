"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function checkoutTool(formData: FormData) {
  const toolId = String(formData.get("toolId") ?? "");
  if (!toolId) throw new Error("Missing toolId.");
  const memberId = await requireSession();
  const note = stringOrNull(formData.get("note"));

  const tool = await prisma.tool.findUnique({ where: { id: toolId } });
  if (!tool) throw new Error("Tool not found.");
  if (tool.status !== "AVAILABLE") {
    throw new Error(`Tool is currently ${tool.status.toLowerCase()}.`);
  }

  await prisma.$transaction([
    prisma.checkout.create({
      data: { toolId, memberId, checkoutNote: note },
    }),
    prisma.tool.update({
      where: { id: toolId },
      data: { status: "CHECKED_OUT" },
    }),
  ]);

  revalidatePath(`/tools/${toolId}`);
  revalidatePath("/");
}

export async function returnTool(formData: FormData) {
  await requireSession();
  const toolId = String(formData.get("toolId") ?? "");
  if (!toolId) throw new Error("Missing toolId.");
  const note = stringOrNull(formData.get("note"));
  const condition = stringOrNull(formData.get("condition"));
  const damaged = formData.get("damaged") === "on";

  const open = await prisma.checkout.findFirst({
    where: { toolId, returnedAt: null },
  });
  if (!open) throw new Error("Tool isn't currently checked out.");

  const nextStatus = damaged ? "MAINTENANCE" : "AVAILABLE";
  const maintenanceReason = damaged
    ? note ?? condition ?? "Reported damaged on return."
    : null;
  const maintenanceStartedAt = damaged ? new Date() : null;

  await prisma.$transaction([
    prisma.checkout.update({
      where: { id: open.id },
      data: {
        returnedAt: new Date(),
        returnNote: note,
        returnCondition: condition,
        damageReported: damaged,
      },
    }),
    prisma.tool.update({
      where: { id: toolId },
      data: {
        status: nextStatus,
        maintenanceReason,
        maintenanceStartedAt,
      },
    }),
  ]);

  revalidatePath(`/tools/${toolId}`);
  revalidatePath("/");
}

function stringOrNull(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed.length > 0 ? trimmed : null;
}
