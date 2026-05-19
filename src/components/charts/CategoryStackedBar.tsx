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
  Legend,
} from "recharts";
import { DarkTooltip } from "./ChartTooltip";
import type { CategoryRow } from "@/lib/insights";

const tickStyle = {
  fontSize: 11,
  fontFamily: "var(--font-geist-mono)",
  fill: "#a1a1aa",
};

export function CategoryStackedBar({ data }: { data: CategoryRow[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="h-72 w-full">
      {mounted && (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 6, right: 12, left: 12, bottom: 24 }}
        >
          <CartesianGrid
            stroke="rgba(255,255,255,0.05)"
            horizontal={false}
          />
          <XAxis
            type="number"
            stroke="#52525b"
            tick={tickStyle}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="category"
            stroke="#52525b"
            tick={{ ...tickStyle, fontSize: 11 }}
            width={120}
          />
          <Tooltip
            content={<DarkTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
          <Legend
            wrapperStyle={{
              fontSize: 11,
              fontFamily: "var(--font-geist-mono)",
              color: "#a1a1aa",
              paddingTop: 8,
            }}
            iconType="circle"
            iconSize={8}
          />
          <Bar
            dataKey="available"
            name="available"
            stackId="status"
            fill="#10b981"
            radius={[3, 0, 0, 3]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="loaned"
            name="loaned"
            stackId="status"
            fill="#f59e0b"
            isAnimationActive={false}
          />
          <Bar
            dataKey="maintenance"
            name="maintenance"
            stackId="status"
            fill="#71717a"
            radius={[0, 3, 3, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}
