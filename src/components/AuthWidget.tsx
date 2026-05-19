import Link from "next/link";
import { signOut } from "@/lib/actions/auth";
import { getCurrentMember } from "@/lib/session";

export async function AuthWidget() {
  const me = await getCurrentMember();

  if (!me) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-200 hover:bg-blue-500/20"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
        Sign in
      </Link>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
      <span className="text-zinc-500">you</span>
      <span className="font-medium text-zinc-100">{me.name}</span>
      <form action={signOut} className="ml-1">
        <button
          type="submit"
          className="rounded border border-white/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
          title="Sign out"
        >
          out
        </button>
      </form>
    </div>
  );
}
