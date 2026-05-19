import { prisma } from "@/lib/db";
import { createMember, deleteMember } from "@/lib/actions/members";

const inputCls =
  "flex-1 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30";

export default async function MembersPage() {
  const members = await prisma.member.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { checkouts: true } } },
  });

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400">
          team.list
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Team members
        </h1>
      </div>

      <form
        action={createMember}
        className="flex gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3"
      >
        <input
          name="name"
          required
          placeholder="new member name"
          className={inputCls}
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_4px_16px_-4px_rgba(59,130,246,0.5)] hover:bg-blue-500"
        >
          Add
        </button>
      </form>

      <ul className="divide-y divide-white/5 rounded-xl border border-white/5 bg-white/[0.02]">
        {members.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-zinc-500">
            no members yet
          </li>
        )}
        {members.map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <div>
              <div className="font-medium text-zinc-100">{m.name}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                <span className="num">{m._count.checkouts}</span>{" "}
                checkout{m._count.checkouts === 1 ? "" : "s"} on record
              </div>
            </div>
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
          </li>
        ))}
      </ul>
    </div>
  );
}
