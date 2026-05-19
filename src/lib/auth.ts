/**
 * Lightweight auth primitives — password hashing (scrypt) and signed session
 * cookies (HMAC-SHA256). No third-party deps; all from Node's built-in crypto.
 *
 * Session cookie format:  base64url(`<memberId>.<expiresAt>`) + "." + base64url(sig)
 * where sig = HMAC-SHA256(secret, `<memberId>.<expiresAt>`).
 */

import {
  scryptSync,
  randomBytes,
  timingSafeEqual,
  createHmac,
} from "node:crypto";
import { cookies } from "next/headers";

const SCRYPT_KEYLEN = 64;
const SCRYPT_SALT_BYTES = 16;
const COOKIE_NAME = "session";
const SESSION_MAX_AGE_S = 60 * 60 * 24 * 30; // 30 days

// ---------- Password hashing ----------

export function hashPassword(plain: string): string {
  if (!plain || plain.length < 4) {
    throw new Error("Password must be at least 4 characters.");
  }
  const salt = randomBytes(SCRYPT_SALT_BYTES);
  const hash = scryptSync(plain, salt, SCRYPT_KEYLEN);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  if (!stored?.startsWith("scrypt$")) return false;
  const [, saltHex, hashHex] = stored.split("$");
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const candidate = scryptSync(plain, salt, expected.length);
  return (
    candidate.length === expected.length && timingSafeEqual(candidate, expected)
  );
}

// ---------- Session cookie ----------

function getSecret(): Buffer {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short (need 32+ random chars). Run `node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"` and paste into .env.",
    );
  }
  return Buffer.from(s, "utf8");
}

function b64u(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64uDecode(s: string): Buffer {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

function sign(payload: string): string {
  const secret = getSecret();
  const sig = createHmac("sha256", secret).update(payload).digest();
  return b64u(sig);
}

export function buildSessionCookie(memberId: string): {
  value: string;
  maxAge: number;
} {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_S;
  const payload = `${memberId}.${exp}`;
  const value = `${b64u(Buffer.from(payload))}.${sign(payload)}`;
  return { value, maxAge: SESSION_MAX_AGE_S };
}

export function parseSessionCookie(
  cookieValue: string | undefined,
): { memberId: string } | null {
  if (!cookieValue) return null;
  const [payloadB64, sigB64] = cookieValue.split(".");
  if (!payloadB64 || !sigB64) return null;
  let payload: string;
  try {
    payload = b64uDecode(payloadB64).toString("utf8");
  } catch {
    return null;
  }
  const expected = sign(payload);
  // Constant-time compare
  const a = Buffer.from(sigB64);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const [memberId, expStr] = payload.split(".");
  const exp = Number(expStr);
  if (!memberId || !Number.isFinite(exp)) return null;
  if (exp * 1000 < Date.now()) return null; // expired
  return { memberId };
}

// ---------- Session reading + writing (Next cookies) ----------

export async function getSessionMemberId(): Promise<string | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  const parsed = parseSessionCookie(raw);
  return parsed?.memberId ?? null;
}

export async function setSession(memberId: string): Promise<void> {
  const { value, maxAge } = buildSessionCookie(memberId);
  const jar = await cookies();
  jar.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

// ---------- Action guard ----------

export async function requireSession(): Promise<string> {
  const id = await getSessionMemberId();
  if (!id) {
    throw new Error("You must be signed in to do that.");
  }
  return id;
}
