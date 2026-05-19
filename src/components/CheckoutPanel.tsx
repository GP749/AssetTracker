import { checkoutTool, returnTool } from "@/lib/actions/checkouts";

type Props = {
  toolId: string;
  status: "AVAILABLE" | "CHECKED_OUT" | "MAINTENANCE";
  hasMember: boolean;
  currentHolderName?: string;
  isCurrentMemberHolder?: boolean;
};

const inputCls =
  "w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30";

export function CheckoutPanel({
  toolId,
  status,
  hasMember,
  currentHolderName,
  isCurrentMemberHolder,
}: Props) {
  if (!hasMember) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-zinc-300">
        Pick yourself in the header above to check this tool out.
      </div>
    );
  }

  if (status === "MAINTENANCE") return null;

  if (status === "AVAILABLE") {
    return (
      <form action={checkoutTool} className="space-y-3">
        <input type="hidden" name="toolId" value={toolId} />
        <textarea
          name="note"
          rows={2}
          placeholder="optional note (e.g. taking it to the workshop)"
          className={inputCls}
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-500 px-4 py-3 text-base font-semibold text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_8px_28px_-8px_rgba(16,185,129,0.6)] transition hover:bg-emerald-400 active:translate-y-px"
        >
          ▸ Check out
        </button>
      </form>
    );
  }

  // CHECKED_OUT
  return (
    <form action={returnTool} className="space-y-3">
      <input type="hidden" name="toolId" value={toolId} />
      {!isCurrentMemberHolder && currentHolderName && (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-2 text-xs text-amber-200">
          Returning on behalf of {currentHolderName}.
        </div>
      )}
      <input
        type="text"
        name="condition"
        placeholder="condition (good, broken, missing battery…)"
        className={inputCls}
      />
      <textarea
        name="note"
        rows={2}
        placeholder="optional note"
        className={inputCls}
      />
      <label className="flex cursor-pointer items-start gap-2 rounded-md border border-red-500/20 bg-red-500/[0.04] p-2.5 text-xs">
        <input
          type="checkbox"
          name="damaged"
          className="mt-0.5 h-3.5 w-3.5 accent-red-500"
        />
        <span className="text-zinc-300">
          <span className="font-medium text-red-200">Tool is damaged</span> —
          route to maintenance instead of marking available.
        </span>
      </label>
      <button
        type="submit"
        className="w-full rounded-lg bg-amber-500 px-4 py-3 text-base font-semibold text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_8px_28px_-8px_rgba(245,158,11,0.6)] transition hover:bg-amber-400 active:translate-y-px"
      >
        ▸ Return
      </button>
    </form>
  );
}
