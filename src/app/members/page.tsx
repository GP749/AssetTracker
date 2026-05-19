import { prisma } from "@/lib/db";
import { createMember, deleteMember } from "@/lib/actions/members";

export default async function MembersPage() {
  const members = await prisma.member.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { checkouts: true } } },
  });

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Team members</h1>

      <form
        action={createMember}
        className="flex gap-2 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <input
          name="name"
          required
          placeholder="New member name"
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        />
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Add
        </button>
      </form>

      <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
        {members.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No members yet.
          </li>
        )}
        {members.map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <div>
              <div className="font-medium">{m.name}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {m._count.checkouts} checkout
                {m._count.checkouts === 1 ? "" : "s"} on record
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
                className="rounded-md border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
