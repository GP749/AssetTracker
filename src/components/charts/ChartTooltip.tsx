"use client";

import type { TooltipProps } from "recharts";

export function DarkTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-md border border-white/10 bg-zinc-950/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      {label !== undefined && label !== "" && (
        <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          {label}
        </div>
      )}
      {payload.map((p) => (
        <div
          key={String(p.dataKey)}
          className="flex items-center gap-2 text-zinc-200"
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-zinc-400">{p.name}</span>
          <span className="num ml-auto font-medium text-zinc-100">
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
}
