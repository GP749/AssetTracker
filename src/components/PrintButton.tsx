"use client";

export function PrintButton({
  label = "Print",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        className ??
        "rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_4px_16px_-4px_rgba(59,130,246,0.5)] hover:bg-blue-500"
      }
    >
      {label}
    </button>
  );
}
