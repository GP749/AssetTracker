import { prisma } from "@/lib/db";
import { ToolCard } from "@/components/ToolCard";
import type { ToolStatus } from "@/generated/prisma/enums";

const VALID_STATUSES: ReadonlySet<ToolStatus> = new Set([
  "AVAILABLE",
  "CHECKED_OUT",
  "MAINTENANCE",
]);

const inputCls =
  "rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30";

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

  const [tools, categories, counts] = await Promise.all([
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
    prisma.tool.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const totals = {
    AVAILABLE: counts.find((c) => c.status === "AVAILABLE")?._count._all ?? 0,
    CHECKED_OUT:
      counts.find((c) => c.status === "CHECKED_OUT")?._count._all ?? 0,
    MAINTENANCE:
      counts.find((c) => c.status === "MAINTENANCE")?._count._all ?? 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400">
            tools.list
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Inventory
          </h1>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs text-zinc-400">
          <StatPill
            label="avail"
            value={totals.AVAILABLE}
            dot="bg-emerald-400"
          />
          <StatPill
            label="out"
            value={totals.CHECKED_OUT}
            dot="bg-amber-400"
          />
          <StatPill
            label="maint"
            value={totals.MAINTENANCE}
            dot="bg-zinc-500"
          />
        </div>
      </div>

      <form
        method="GET"
        className="grid grid-cols-1 gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 sm:grid-cols-4"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="search name or description…"
          className={`${inputCls} sm:col-span-2`}
        />
        <select
          name="status"
          defaultValue={statusParam}
          className={inputCls}
        >
          <option value="">any status</option>
          <option value="AVAILABLE">available</option>
          <option value="CHECKED_OUT">checked out</option>
          <option value="MAINTENANCE">maintenance</option>
        </select>
        <select
          name="category"
          defaultValue={category}
          className={inputCls}
        >
          <option value="">any category</option>
          {categories.map((c) => (
            <option key={c.category} value={c.category}>
              {c.category}
            </option>
          ))}
        </select>
        <div className="flex gap-2 sm:col-span-4">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_4px_16px_-4px_rgba(59,130,246,0.5)] hover:bg-blue-500"
          >
            Apply
          </button>
          {(q || status || category) && (
            <a
              href="/"
              className="rounded-md border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-white"
            >
              Clear
            </a>
          )}
          <div className="ml-auto self-center font-mono text-xs text-zinc-500 num">
            {tools.length} of {counts.reduce((a, c) => a + c._count._all, 0)}{" "}
            shown
          </div>
        </div>
      </form>

      {tools.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 p-12 text-center text-sm text-zinc-500">
          no tools match the current filters
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

function StatPill({
  label,
  value,
  dot,
}: {
  label: string;
  value: number;
  dot: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/5 bg-white/[0.02] px-2 py-1">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span className="num text-zinc-100">{value}</span>
      <span className="uppercase tracking-wider text-zinc-500">{label}</span>
    </span>
  );
}
