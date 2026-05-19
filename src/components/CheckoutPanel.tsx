import { checkoutTool, returnTool } from "@/lib/actions/checkouts";

type Props = {
  toolId: string;
  status: "AVAILABLE" | "CHECKED_OUT" | "MAINTENANCE";
  hasMember: boolean;
  currentHolderName?: string;
  isCurrentMemberHolder?: boolean;
};

export function CheckoutPanel({
  toolId,
  status,
  hasMember,
  currentHolderName,
  isCurrentMemberHolder,
}: Props) {
  if (!hasMember) {
    return (
      <div className="rounded-md border border-zinc-300 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
        Pick yourself in the header above to check this tool out.
      </div>
    );
  }

  if (status === "MAINTENANCE") {
    return (
      <div className="rounded-md border border-zinc-300 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
        This tool is in maintenance — no checkouts available.
      </div>
    );
  }

  if (status === "AVAILABLE") {
    return (
      <form action={checkoutTool} className="space-y-3">
        <input type="hidden" name="toolId" value={toolId} />
        <textarea
          name="note"
          rows={2}
          placeholder="Optional note (e.g. taking it to the workshop)"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        />
        <button
          type="submit"
          className="w-full rounded-md bg-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800"
        >
          Check out
        </button>
      </form>
    );
  }

  // CHECKED_OUT
  return (
    <form action={returnTool} className="space-y-3">
      <input type="hidden" name="toolId" value={toolId} />
      {!isCurrentMemberHolder && currentHolderName && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-100">
          Returning on behalf of {currentHolderName}.
        </div>
      )}
      <input
        type="text"
        name="condition"
        placeholder="Condition (good, broken, missing battery…)"
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
      />
      <textarea
        name="note"
        rows={2}
        placeholder="Optional note"
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
      />
      <button
        type="submit"
        className="w-full rounded-md bg-amber-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-amber-700 active:bg-amber-800"
      >
        Return
      </button>
    </form>
  );
}
