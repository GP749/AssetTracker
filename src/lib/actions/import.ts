"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Papa from "papaparse";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

type CsvRow = {
  name?: string;
  category?: string;
  location?: string;
  description?: string;
};

export async function importToolsCSV(formData: FormData) {
  await requireSession();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No CSV file uploaded.");
  }

  const text = await file.text();
  const parsed = Papa.parse<CsvRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  if (parsed.errors.length > 0) {
    const e = parsed.errors[0];
    throw new Error(
      `CSV parse error at row ${e.row !== undefined ? e.row + 1 : "?"}: ${e.message}`,
    );
  }

  const rows = parsed.data
    .map((r, i) => ({
      lineNo: i + 2, // 1 = header
      name: (r.name ?? "").toString().trim(),
      category: (r.category ?? "").toString().trim(),
      location: (r.location ?? "").toString().trim() || null,
      description: (r.description ?? "").toString().trim() || null,
    }))
    .filter((r) => r.name || r.category);

  const bad = rows.filter((r) => !r.name || !r.category);
  if (bad.length > 0) {
    throw new Error(
      `${bad.length} row(s) missing name or category (first: line ${bad[0].lineNo}). Fix the CSV and try again.`,
    );
  }
  if (rows.length === 0) {
    throw new Error("CSV contains no data rows.");
  }

  await prisma.tool.createMany({
    data: rows.map((r) => ({
      name: r.name,
      category: r.category,
      location: r.location,
      description: r.description,
    })),
  });

  revalidatePath("/");
  redirect(`/?imported=${rows.length}`);
}
