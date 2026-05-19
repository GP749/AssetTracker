import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/actions/auth";
import { getCurrentMemberId } from "@/lib/session";

const inputCls =
  "w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30";

export const metadata = { title: "Sign in — Asset Tracker" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Already signed in? Bounce to next (or /).
  const current = await getCurrentMemberId();
  const sp = await searchParams;
  const next = typeof sp.next === "string" && sp.next.startsWith("/")
    ? sp.next
    : "/";
  if (current) redirect(next);

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400">
          auth.signin
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Use your team username and password.
        </p>
      </div>

      <form
        action={signIn}
        className="space-y-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
      >
        <input type="hidden" name="next" value={next} />
        <label className="block">
          <div className="mb-1 text-sm font-medium text-zinc-200">Username</div>
          <input
            name="username"
            required
            autoFocus
            autoComplete="username"
            placeholder="e.g. alex"
            className={inputCls}
          />
        </label>
        <label className="block">
          <div className="mb-1 text-sm font-medium text-zinc-200">Password</div>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={inputCls}
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_8px_28px_-8px_rgba(59,130,246,0.6)] transition hover:bg-blue-500 active:translate-y-px"
        >
          ▸ Sign in
        </button>
      </form>

      <div className="rounded-md border border-white/5 bg-white/[0.02] p-3 font-mono text-[11px] text-zinc-500">
        <div className="text-zinc-400">defaults</div>
        <div className="mt-1">
          Seeded members log in with username =
          <span className="text-zinc-300"> first name lowercased</span>,
          password
          <span className="text-zinc-300"> &ldquo;changeme&rdquo;</span>.
          Change it on the{" "}
          <Link
            href="/members"
            className="text-blue-400 hover:text-blue-300"
          >
            Team
          </Link>{" "}
          page after first sign-in.
        </div>
      </div>
    </div>
  );
}
