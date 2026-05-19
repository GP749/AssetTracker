import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ALLOWED_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function savePhoto(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_BYTES) {
    throw new Error(
      `Photo is too large (${(file.size / 1024 / 1024).toFixed(1)} MB, max 8 MB).`,
    );
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTS.has(ext)) {
    throw new Error(
      `Unsupported image type "${ext}". Use JPG, PNG, WEBP, or GIF.`,
    );
  }
  await mkdir(UPLOADS_DIR, { recursive: true });
  const filename = `${randomUUID()}${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOADS_DIR, filename), buf);
  return `/uploads/${filename}`;
}
