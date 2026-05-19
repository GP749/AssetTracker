export function overdueDays(): number {
  const n = Number(process.env.OVERDUE_DAYS);
  return Number.isFinite(n) && n > 0 ? n : 14;
}

export function overdueCutoff(): Date {
  return new Date(Date.now() - overdueDays() * 24 * 60 * 60 * 1000);
}

export function isOverdue(checkedOutAt: Date | string): boolean {
  const t = typeof checkedOutAt === "string"
    ? new Date(checkedOutAt)
    : checkedOutAt;
  return t.getTime() < overdueCutoff().getTime();
}

export function daysSince(checkedOutAt: Date | string): number {
  const t = typeof checkedOutAt === "string"
    ? new Date(checkedOutAt)
    : checkedOutAt;
  return Math.floor((Date.now() - t.getTime()) / (24 * 60 * 60 * 1000));
}
