import { prisma } from "./db";
import { overdueCutoff, overdueDays } from "./overdue";

export type StatusKey = "AVAILABLE" | "CHECKED_OUT" | "MAINTENANCE";

export type KPIs = {
  total: number;
  available: number;
  loaned: number;
  maintenance: number;
  overdue: number;
  totalCheckouts: number;
  overdueDays: number;
};

export type StatusSlice = { name: string; value: number; color: string };
export type CategoryRow = {
  category: string;
  available: number;
  loaned: number;
  maintenance: number;
  total: number;
};
export type DailyRow = { date: string; label: string; count: number };
export type BorrowerRow = { name: string; count: number };
export type LoanedRow = {
  id: string;
  toolId: string;
  toolName: string;
  category: string;
  location: string | null;
  memberName: string;
  checkedOutAt: Date;
  daysOut: number;
  overdue: boolean;
  note: string | null;
};

const ACTIVITY_DAYS = 30;

export async function getInsights(): Promise<{
  kpis: KPIs;
  statusBreakdown: StatusSlice[];
  byCategory: CategoryRow[];
  daily: DailyRow[];
  topBorrowers: BorrowerRow[];
  loaned: LoanedRow[];
}> {
  const od = overdueCutoff();

  const [
    toolCounts,
    overdueCount,
    totalCheckouts,
    byCategoryRaw,
    activityCheckouts,
    borrowersRaw,
    loansRaw,
    members,
  ] = await Promise.all([
    prisma.tool.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.tool.count({
      where: {
        status: "CHECKED_OUT",
        checkouts: {
          some: { returnedAt: null, checkedOutAt: { lt: od } },
        },
      },
    }),
    prisma.checkout.count(),
    prisma.tool.groupBy({
      by: ["category", "status"],
      _count: { _all: true },
      orderBy: { category: "asc" },
    }),
    prisma.checkout.findMany({
      where: {
        checkedOutAt: {
          gt: new Date(Date.now() - ACTIVITY_DAYS * 24 * 60 * 60 * 1000),
        },
      },
      select: { checkedOutAt: true },
    }),
    prisma.checkout.groupBy({
      by: ["memberId"],
      _count: { _all: true },
      orderBy: { _count: { memberId: "desc" } },
      take: 6,
    }),
    prisma.checkout.findMany({
      where: { returnedAt: null },
      orderBy: { checkedOutAt: "asc" },
      include: {
        tool: {
          select: { id: true, name: true, category: true, location: true },
        },
        member: { select: { id: true, name: true } },
      },
    }),
    prisma.member.findMany({ select: { id: true, name: true } }),
  ]);

  const totals = {
    AVAILABLE: 0,
    CHECKED_OUT: 0,
    MAINTENANCE: 0,
  } as Record<StatusKey, number>;
  for (const row of toolCounts) totals[row.status] = row._count._all;
  const total =
    totals.AVAILABLE + totals.CHECKED_OUT + totals.MAINTENANCE;

  const kpis: KPIs = {
    total,
    available: totals.AVAILABLE,
    loaned: totals.CHECKED_OUT,
    maintenance: totals.MAINTENANCE,
    overdue: overdueCount,
    totalCheckouts,
    overdueDays: overdueDays(),
  };

  const statusBreakdown: StatusSlice[] = [
    { name: "Available", value: totals.AVAILABLE, color: "#10b981" },
    { name: "Loaned", value: totals.CHECKED_OUT, color: "#f59e0b" },
    { name: "Maintenance", value: totals.MAINTENANCE, color: "#71717a" },
  ].filter((s) => s.value > 0);

  // Pivot category × status
  const catMap = new Map<string, CategoryRow>();
  for (const row of byCategoryRaw) {
    const entry =
      catMap.get(row.category) ??
      {
        category: row.category,
        available: 0,
        loaned: 0,
        maintenance: 0,
        total: 0,
      };
    if (row.status === "AVAILABLE") entry.available = row._count._all;
    if (row.status === "CHECKED_OUT") entry.loaned = row._count._all;
    if (row.status === "MAINTENANCE") entry.maintenance = row._count._all;
    entry.total = entry.available + entry.loaned + entry.maintenance;
    catMap.set(row.category, entry);
  }
  const byCategory = Array.from(catMap.values()).sort(
    (a, b) => b.total - a.total,
  );

  // Build a contiguous list of last N days
  const days = new Map<string, number>();
  for (let i = ACTIVITY_DAYS - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.set(toDayKey(d), 0);
  }
  for (const c of activityCheckouts) {
    const k = toDayKey(c.checkedOutAt);
    if (days.has(k)) days.set(k, (days.get(k) ?? 0) + 1);
  }
  const dayLabelFmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });
  const daily: DailyRow[] = Array.from(days.entries()).map(([k, v]) => ({
    date: k,
    label: dayLabelFmt.format(new Date(k)),
    count: v,
  }));

  const memberMap = new Map(members.map((m) => [m.id, m.name]));
  const topBorrowers: BorrowerRow[] = borrowersRaw
    .map((b) => ({
      name: memberMap.get(b.memberId) ?? "Unknown",
      count: b._count._all,
    }))
    .filter((b) => b.count > 0);

  const now = Date.now();
  const loaned: LoanedRow[] = loansRaw.map((c) => {
    const daysOut = Math.floor(
      (now - c.checkedOutAt.getTime()) / (24 * 60 * 60 * 1000),
    );
    return {
      id: c.id,
      toolId: c.tool.id,
      toolName: c.tool.name,
      category: c.tool.category,
      location: c.tool.location,
      memberName: c.member.name,
      checkedOutAt: c.checkedOutAt,
      daysOut,
      overdue: c.checkedOutAt.getTime() < od.getTime(),
      note: c.checkoutNote,
    };
  });

  return { kpis, statusBreakdown, byCategory, daily, topBorrowers, loaned };
}

function toDayKey(d: Date): string {
  // YYYY-MM-DD in local time, no timezone math.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
