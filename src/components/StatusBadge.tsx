import type { ToolStatus } from "@/generated/prisma/enums";
import { statusLabel } from "@/lib/format";

const styles: Record<
  ToolStatus,
  { pill: string; dot: string; glow: string }
> = {
  AVAILABLE: {
    pill: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400",
    glow: "shadow-[0_0_6px_rgba(52,211,153,0.8)]",
  },
  CHECKED_OUT: {
    pill: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    dot: "bg-amber-400",
    glow: "shadow-[0_0_6px_rgba(251,191,36,0.8)]",
  },
  MAINTENANCE: {
    pill: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
    dot: "bg-zinc-400",
    glow: "",
  },
};

export function StatusBadge({
  status,
  size = "sm",
}: {
  status: ToolStatus;
  size?: "sm" | "md";
}) {
  const s = styles[status];
  const sizing =
    size === "md" ? "text-sm px-3 py-1 gap-2" : "text-[11px] px-2 py-0.5 gap-1.5";
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium uppercase tracking-wide ${s.pill} ${sizing}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${s.glow}`} />
      {statusLabel(status)}
    </span>
  );
}
