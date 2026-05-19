import { markForMaintenance, completeMaintenance } from "@/lib/actions/tools";

const inputCls =
  "w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30";

type Props = {
  toolId: string;
  status: "AVAILABLE" | "CHECKED_OUT" | "MAINTENANCE";
  reason?: string | null;
  startedAt?: Date | string | null;
};

export function MaintenancePanel({ toolId, status, reason, startedAt }: Props) {
  if (status === "MAINTENANCE") {
    const since =
      startedAt instanceof Date
        ? startedAt
        : startedAt
          ? new Date(startedAt)
          : null;
    return (
      <div className="space-y-3 rounded-lg border border-zinc-600/30 bg-zinc-500/[0.08] p-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
            in.maintenance
          </div>
          {reason && (
            <div className="mt-1 text-sm text-zinc-200">{reason}</div>
          )}
          {since && (
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500 num">
              since {since.toLocaleString()}
            </div>
          )}
        </div>
        <form action={completeMaintenance}>
          <input type="hidden" name="toolId" value={toolId} />
          <button
            type="submit"
            className="w-full rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_4px_16px_-6px_rgba(16,185,129,0.6)] hover:bg-emerald-400"
          >
            ▸ Mark serviced
          </button>
        </form>
      </div>
    );
  }

  if (status === "CHECKED_OUT") return null;

  // AVAILABLE
  return (
    <details className="group rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <summary className="cursor-pointer text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-zinc-200">
        ▸ mark for maintenance
      </summary>
      <form action={markForMaintenance} className="mt-3 space-y-2">
        <input type="hidden" name="toolId" value={toolId} />
        <textarea
          name="reason"
          rows={2}
          placeholder="reason (e.g. battery won't charge, blade needs replacing)"
          className={inputCls}
        />
        <button
          type="submit"
          className="w-full rounded-md border border-zinc-500/30 bg-zinc-500/10 px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-500/20"
        >
          Send to maintenance
        </button>
      </form>
    </details>
  );
}
