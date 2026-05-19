import { prisma } from "@/lib/db";
import { ToolCard } from "@/components/ToolCard";
import type { ToolStatus } from "@/generated/prisma/enums";

const VALID_STATUSES: ReadonlySet<ToolStatus> = new Set([
  "AVAILABLE",
  "CHECKED_OUT",
  "MAINTENANCE",
]);

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const statusParam = typeof sp.status === "string" ? sp.status : "";
  const status = VALID_STATUSES.has(statusParam as ToolStatus)
    ? (statusParam as ToolStatus)
    : undefined;
  const category = typeof sp.category === "string" ? sp.category : "";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  const [tools, categories] = await Promise.all([
    prisma.tool.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(category ? { category } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q } },
                { description: { contains: q } },
              ],
            }
          : {}),
      },
      orderBy: [{ status: "asc" }, { name: "asc" }],
      include: {
        checkouts: {
          where: { returnedAt: null },
          take: 1,
          include: { member: true },
        },
      },
    }),
    prisma.tool.findMany({
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Tools</h1>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          {tools.length} shown
        </div>
      </div>

      <form
        method="GET"
        className="grid grid-cols-1 gap-2 rounded-lg border border-zinc-200 bg-white p-3 sm:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name or description…"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none sm:col-span-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <select
          name="status"
          defaultValue={statusParam}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="">Any status</option>
          <option value="AVAILABLE">Available</option>
          <option value="CHECKED_OUT">Checked out</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>
        <select
          name="category"
          defaultValue={category}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="">Any category</option>
          {categories.map((c) => (
            <option key={c.category} value={c.category}>
              {c.category}
            </option>
          ))}
        </select>
        <div className="flex gap-2 sm:col-span-4">
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Apply
          </button>
          {(q || status || category) && (
            <a
              href="/"
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Clear
            </a>
          )}
        </div>
      </form>

      {tools.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          No tools match the current filters.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {tools.map((t) => (
            <ToolCard
              key={t.id}
              id={t.id}
              name={t.name}
              category={t.category}
              photoUrl={t.photoUrl}
              status={t.status}
              currentHolder={t.checkouts[0]?.member.name ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
