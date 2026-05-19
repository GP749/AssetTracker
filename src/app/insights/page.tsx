import Link from "next/link";
import { getInsights } from "@/lib/insights";
import { StatusDonut, StatusLegend } from "@/components/charts/StatusDonut";
import { CategoryStackedBar } from "@/components/charts/CategoryStackedBar";
import { DailyActivityChart } from "@/components/charts/DailyActivityChart";
import { TopBorrowersBar } from "@/components/charts/TopBorrowersBar";
import { formatDateTime } from "@/lib/format";

export const metadata = { title: "Insights — Asset Tracker" };

export default async function InsightsPage() {
  const {
    kpis,
    statusBreakdown,
    byCategory,
    daily,
    topBorrowers,
    loaned,
  } = await getInsights();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400">
            insights.dashboard
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Stock &amp; loan analytics
          </h1>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          activity window · last 30d
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiTile label="total stock" value={kpis.total} accent="text-zinc-100" />
        <KpiTile
          label="available"
          value={kpis.available}
          accent="text-emerald-300"
          dot="bg-emerald-400"
        />
        <KpiTile
          label="loaned out"
          value={kpis.loaned}
          accent="text-amber-300"
          dot="bg-amber-400"
        />
        <KpiTile
          label="maintenance"
          value={kpis.maintenance}
          accent="text-zinc-300"
          dot="bg-zinc-400"
        />
        <KpiTile
          label={`overdue · >${kpis.overdueDays}d`}
          value={kpis.overdue}
          accent={kpis.overdue > 0 ? "text-red-300" : "text-zinc-100"}
          dot={kpis.overdue > 0 ? "bg-red-400" : "bg-zinc-600"}
          glow={kpis.overdue > 0}
        />
        <KpiTile
          label="total checkouts"
          value={kpis.totalCheckouts}
          accent="text-blue-300"
          dot="bg-blue-400"
        />
      </div>

      {/* Charts grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="status.breakdown"
          subtitle="Current inventory by status"
          className="lg:col-span-1"
        >
          {statusBreakdown.length === 0 ? (
            <Empty />
          ) : (
            <>
              <StatusDonut data={statusBreakdown} />
              <div className="mt-3">
                <StatusLegend data={statusBreakdown} />
              </div>
            </>
          )}
        </Panel>

        <Panel
          title="by.category"
          subtitle="Stock per category, stacked by status"
          className="lg:col-span-2"
        >
          {byCategory.length === 0 ? (
            <Empty />
          ) : (
            <CategoryStackedBar data={byCategory} />
          )}
        </Panel>

        <Panel
          title="activity.daily"
          subtitle={`Checkouts opened per day, last ${daily.length}d`}
          className="lg:col-span-2"
        >
          <DailyActivityChart data={daily} />
        </Panel>

        <Panel
          title="top.borrowers"
          subtitle="Most-frequent checkout count, all-time"
          className="lg:col-span-1"
        >
          {topBorrowers.length === 0 ? (
            <Empty />
          ) : (
            <TopBorrowersBar data={topBorrowers} />
          )}
        </Panel>
      </div>

      {/* Currently loaned table */}
      <Panel
        title="currently.loaned"
        subtitle={`${loaned.length} open checkout${loaned.length === 1 ? "" : "s"}`}
      >
        {loaned.length === 0 ? (
          <Empty label="nothing checked out right now" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                <tr className="border-b border-white/5">
                  <th className="px-3 py-2 font-normal">tool</th>
                  <th className="px-3 py-2 font-normal">category</th>
                  <th className="px-3 py-2 font-normal">location</th>
                  <th className="px-3 py-2 font-normal">with</th>
                  <th className="px-3 py-2 font-normal">since</th>
                  <th className="px-3 py-2 font-normal text-right">days out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loaned.map((l) => (
                  <tr
                    key={l.id}
                    className={
                      l.overdue
                        ? "bg-red-500/[0.04] hover:bg-red-500/[0.07]"
                        : "hover:bg-white/[0.02]"
                    }
                  >
                    <td className="px-3 py-2.5">
                      <Link
                        href={`/tools/${l.toolId}`}
                        className="font-medium text-zinc-100 hover:text-blue-400"
                      >
                        {l.toolName}
                      </Link>
                      {l.note && (
                        <div className="truncate text-xs text-zinc-500">
                          &ldquo;{l.note}&rdquo;
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-zinc-400">{l.category}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-zinc-500">
                      {l.location ?? "—"}
                    </td>
                    <td className="px-3 py-2.5 text-zinc-200">
                      {l.memberName}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap num text-xs text-zinc-400">
                      {formatDateTime(l.checkedOutAt)}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span
                        className={`num inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[11px] ${
                          l.overdue
                            ? "border-red-500/40 bg-red-500/10 text-red-200"
                            : "border-white/10 bg-white/[0.02] text-zinc-300"
                        }`}
                      >
                        {l.overdue && (
                          <span className="h-1 w-1 rounded-full bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.9)]" />
                        )}
                        {l.daysOut}d
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}

function KpiTile({
  label,
  value,
  accent,
  dot,
  glow,
}: {
  label: string;
  value: number;
  accent?: string;
  dot?: string;
  glow?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
      <div className="flex items-center gap-1.5">
        {dot && (
          <span
            className={`h-1.5 w-1.5 rounded-full ${dot} ${glow ? "shadow-[0_0_6px_rgba(248,113,113,0.9)]" : ""}`}
          />
        )}
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          {label}
        </span>
      </div>
      <div className={`num mt-1 text-2xl font-semibold ${accent ?? "text-zinc-100"}`}>
        {value}
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-white/5 bg-white/[0.02] p-4 ${className ?? ""}`}
    >
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400">
          {title}
        </h2>
        {subtitle && (
          <span className="truncate text-[11px] text-zinc-500">
            {subtitle}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function Empty({ label = "no data yet" }: { label?: string }) {
  return (
    <div className="flex h-48 items-center justify-center text-sm text-zinc-500">
      {label}
    </div>
  );
}
