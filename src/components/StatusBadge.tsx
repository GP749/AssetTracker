import type { ToolStatus } from "@/generated/prisma/enums";
import { statusLabel } from "@/lib/format";

const styles: Record<ToolStatus, string> = {
  AVAILABLE:
    "bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800",
  CHECKED_OUT:
    "bg-amber-100 text-amber-900 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:ring-amber-800",
  MAINTENANCE:
    "bg-zinc-200 text-zinc-700 ring-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700",
};

export function StatusBadge({
  status,
  size = "sm",
}: {
  status: ToolStatus;
  size?: "sm" | "md";
}) {
  const sizing =
    size === "md" ? "text-sm px-3 py-1" : "text-xs px-2 py-0.5";
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ring-1 ring-inset ${styles[status]} ${sizing}`}
    >
      {statusLabel(status)}
    </span>
  );
}
