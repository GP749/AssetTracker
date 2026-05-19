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
  LabelList,
} from "recharts";
import { DarkTooltip } from "./ChartTooltip";
import type { BorrowerRow } from "@/lib/insights";

export function TopBorrowersBar({ data }: { data: BorrowerRow[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="h-56 w-full">
      {mounted && (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 28, left: 4, bottom: 4 }}
        >
          <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#52525b"
            tick={{
              fontSize: 12,
              fontFamily: "var(--font-geist-sans)",
              fill: "#d4d4d8",
            }}
            tickLine={false}
            axisLine={false}
            width={88}
          />
          <Tooltip
            content={<DarkTooltip />}
            cursor={{ fill: "rgba(59,130,246,0.08)" }}
          />
          <Bar
            dataKey="count"
            name="checkouts"
            fill="#3b82f6"
            radius={[3, 3, 3, 3]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="count"
              position="right"
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 11,
                fill: "#a1a1aa",
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}
