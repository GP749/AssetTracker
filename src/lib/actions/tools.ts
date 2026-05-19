"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { savePhoto } from "@/lib/upload";
import { searchPhoto } from "@/lib/unsplash";

export async function createTool(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description =
    String(formData.get("description") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const photoFile = formData.get("photo");
  const fetchUnsplash = formData.get("fetchUnsplash") === "on";

  if (!name) throw new Error("Name is required.");
  if (!category) throw new Error("Category is required.");

  let photoUrl: string | null = null;
  if (photoFile instanceof File && photoFile.size > 0) {
    photoUrl = await savePhoto(photoFile);
  } else if (fetchUnsplash && process.env.UNSPLASH_ACCESS_KEY) {
    try {
      photoUrl = await searchPhoto(name);
    } catch {
      // ignore — fall through with no photo
    }
  }

  const tool = await prisma.tool.create({
    data: { name, category, description, location, photoUrl },
  });

  revalidatePath("/");
  redirect(`/tools/${tool.id}`);
}

export async function editTool(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing tool id.");
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description =
    String(formData.get("description") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const photoFile = formData.get("photo");

  if (!name) throw new Error("Name is required.");
  if (!category) throw new Error("Category is required.");

  let photoUrl: string | undefined;
  if (photoFile instanceof File && photoFile.size > 0) {
    photoUrl = (await savePhoto(photoFile)) ?? undefined;
  }

  await prisma.tool.update({
    where: { id },
    data: {
      name,
      category,
      description,
      location,
      ...(photoUrl !== undefined ? { photoUrl } : {}),
    },
  });

  revalidatePath("/");
  revalidatePath(`/tools/${id}`);
  redirect(`/tools/${id}`);
}

export async function deleteTool(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing tool id.");
  const openCount = await prisma.checkout.count({
    where: { toolId: id, returnedAt: null },
  });
  if (openCount > 0) {
    throw new Error("Return the tool before deleting it.");
  }
  // Delete history first (no cascade on the schema).
  await prisma.checkout.deleteMany({ where: { toolId: id } });
  await prisma.tool.delete({ where: { id } });
  revalidatePath("/");
  redirect("/");
}

export async function markForMaintenance(formData: FormData) {
  const id = String(formData.get("toolId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim() || null;
  if (!id) throw new Error("Missing tool id.");

  const tool = await prisma.tool.findUnique({ where: { id } });
  if (!tool) throw new Error("Tool not found.");
  if (tool.status === "CHECKED_OUT") {
    throw new Error("Return the tool before marking it for maintenance.");
  }
  await prisma.tool.update({
    where: { id },
    data: {
      status: "MAINTENANCE",
      maintenanceReason: reason,
      maintenanceStartedAt: new Date(),
    },
  });
  revalidatePath("/");
  revalidatePath(`/tools/${id}`);
}

export async function completeMaintenance(formData: FormData) {
  const id = String(formData.get("toolId") ?? "");
  if (!id) throw new Error("Missing tool id.");
  await prisma.tool.update({
    where: { id },
    data: {
      status: "AVAILABLE",
      maintenanceReason: null,
      maintenanceStartedAt: null,
    },
  });
  revalidatePath("/");
  revalidatePath(`/tools/${id}`);
}
