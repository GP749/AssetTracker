import Link from "next/link";
import { prisma } from "@/lib/db";
import { createMember, deleteMember } from "@/lib/actions/members";
import { changeMyPassword } from "@/lib/actions/auth";
import { getCurrentMemberId } from "@/lib/session";

const inputCls =
  "flex-1 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30";

export default async function MembersPage() {
  const [members, sessionMemberId] = await Promise.all([
    prisma.member.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { checkouts: true } } },
    }),
    getCurrentMemberId(),
  ]);
  const signedIn = Boolean(sessionMemberId);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400">
          team.list
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Team members
        </h1>
      </div>

      {!signedIn ? (
        <Link
          href="/login?next=/members"
          className="block rounded-lg border border-blue-500/30 bg-blue-500/[0.08] p-3 text-sm text-blue-100 hover:bg-blue-500/[0.14]"
        >
          Sign in to add new members or change your password.
        </Link>
      ) : (
        <form
          action={createMember}
          className="space-y-3 rounded-xl border border-white/5 bg-white/[0.02] p-4"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400">
            team.add
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="block">
              <div className="mb-1 text-xs font-medium text-zinc-300">
                Display name
              </div>
              <input
                name="name"
                required
                placeholder="e.g. Pat"
                className={inputCls}
              />
            </label>
            <label className="block">
              <div className="mb-1 text-xs font-medium text-zinc-300">
                Username
              </div>
              <input
                name="username"
                required
                placeholder="pat"
                className={inputCls}
              />
            </label>
            <label className="block">
              <div className="mb-1 text-xs font-medium text-zinc-300">
                Password
              </div>
              <input
                name="password"
                type="password"
                required
                minLength={4}
                placeholder="min 4 chars"
                className={inputCls}
              />
            </label>
          </div>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_4px_16px_-4px_rgba(59,130,246,0.5)] hover:bg-blue-500"
          >
            Add member
          </button>
          <div className="font-mono text-[10px] text-zinc-500">
            username: 2–20 chars, lowercase letters / digits / underscore.
          </div>
        </form>
      )}

      <ul className="divide-y divide-white/5 rounded-xl border border-white/5 bg-white/[0.02]">
        {members.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-zinc-500">
            no members yet
          </li>
        )}
        {members.map((m) => {
          const isMe = m.id === sessionMemberId;
          return (
            <li key={m.id} className="px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-100">
                      {m.name}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      @{m.username}
                    </span>
                    {isMe && (
                      <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-300">
                        you
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    <span className="num">{m._count.checkouts}</span>{" "}
                    checkout{m._count.checkouts === 1 ? "" : "s"} on record
                  </div>
                </div>
                {signedIn && !isMe && (
                  <form action={deleteMember}>
                    <input type="hidden" name="id" value={m.id} />
                    <button
                      type="submit"
                      disabled={m._count.checkouts > 0}
                      title={
                        m._count.checkouts > 0
                          ? "Member has checkout history — kept to preserve the audit log."
                          : "Remove this member"
                      }
                      className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-zinc-300 hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </form>
                )}
              </div>

              {isMe && (
                <details className="mt-3 rounded-md border border-white/5 bg-black/20 p-3">
                  <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-wider text-zinc-400 hover:text-zinc-200">
                    ▸ change my password
                  </summary>
                  <form
                    action={changeMyPassword}
                    className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3"
                  >
                    <input type="hidden" name="memberId" value={m.id} />
                    <input
                      name="currentPassword"
                      type="password"
                      placeholder="current password"
                      required
                      autoComplete="current-password"
                      className={inputCls}
                    />
                    <input
                      name="newPassword"
                      type="password"
                      placeholder="new password (min 4)"
                      required
                      minLength={4}
                      autoComplete="new-password"
                      className={inputCls}
                    />
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="confirm new password"
                      required
                      minLength={4}
                      autoComplete="new-password"
                      className={inputCls}
                    />
                    <button
                      type="submit"
                      className="sm:col-span-3 rounded-md border border-blue-500/40 bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-100 hover:bg-blue-500/20"
                    >
                      Update password
                    </button>
                  </form>
                </details>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
