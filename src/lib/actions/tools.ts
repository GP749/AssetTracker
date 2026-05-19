"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { savePhoto } from "@/lib/upload";

export async function createTool(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description =
    String(formData.get("description") ?? "").trim() || null;
  const photoFile = formData.get("photo");

  if (!name) throw new Error("Name is required.");
  if (!category) throw new Error("Category is required.");

  const photoUrl =
    photoFile instanceof File ? await savePhoto(photoFile) : null;

  const tool = await prisma.tool.create({
    data: { name, category, description, photoUrl },
  });

  revalidatePath("/");
  redirect(`/tools/${tool.id}`);
}
