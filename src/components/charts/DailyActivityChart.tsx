"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DarkTooltip } from "./ChartTooltip";
import type { DailyRow } from "@/lib/insights";

export function DailyActivityChart({ data }: { data: DailyRow[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="h-56 w-full">
      {mounted && (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          barCategoryGap={2}
        >
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#52525b"
            tick={{
              fontSize: 10,
              fontFamily: "var(--font-geist-mono)",
              fill: "#52525b",
            }}
            interval="preserveStartEnd"
            minTickGap={24}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#52525b"
            tick={{
              fontSize: 10,
              fontFamily: "var(--font-geist-mono)",
              fill: "#52525b",
            }}
            allowDecimals={false}
            width={32}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={<DarkTooltip />}
            cursor={{ fill: "rgba(59,130,246,0.08)" }}
          />
          <Bar
            dataKey="count"
            name="checkouts"
            radius={[2, 2, 0, 0]}
            isAnimationActive={false}
          >
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={
                  d.count === 0
                    ? "rgba(255,255,255,0.05)"
                    : d.count >= max * 0.7
                      ? "#3b82f6"
                      : "rgba(59,130,246,0.55)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}
