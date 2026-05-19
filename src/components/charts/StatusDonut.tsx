"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { DarkTooltip } from "./ChartTooltip";
import type { StatusSlice } from "@/lib/insights";

export function StatusDonut({ data }: { data: StatusSlice[] }) {
  const total = data.reduce((sum, s) => sum + s.value, 0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative h-64 w-full">
      {mounted && (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="62%"
            outerRadius="92%"
            paddingAngle={2}
            stroke="rgba(0,0,0,0.5)"
            strokeWidth={1}
            isAnimationActive={false}
          >
            {data.map((s, i) => (
              <Cell key={i} fill={s.color} />
            ))}
          </Pie>
          <Tooltip content={<DarkTooltip />} cursor={false} />
        </PieChart>
      </ResponsiveContainer>
      )}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="num text-3xl font-semibold text-zinc-100">{total}</div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          tools total
        </div>
      </div>
    </div>
  );
}

export function StatusLegend({ data }: { data: StatusSlice[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-xs">
      {data.map((s) => (
        <div
          key={s.name}
          className="rounded-md border border-white/5 bg-white/[0.02] px-2 py-1.5"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: s.color }}
            />
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              {s.name}
            </span>
          </div>
          <div className="num mt-0.5 text-base font-semibold text-zinc-100">
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}
