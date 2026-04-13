"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { mockConsumption } from "@/lib/mock-data";

export function ConsumptionChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={mockConsumption} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#6B7280", fontSize: 12 }}
          axisLine={{ stroke: "#1F2937" }}
          tickLine={false}
        />
        <YAxis
          yAxisId="kwh"
          tick={{ fill: "#6B7280", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          yAxisId="cost"
          orientation="right"
          tick={{ fill: "#6B7280", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111827",
            border: "1px solid #1F2937",
            borderRadius: "8px",
            color: "#F9FAFB",
            fontSize: 13,
          }}
          formatter={(value, name) => {
            const v = Number(value);
            return name === "kwh"
              ? [`${v.toLocaleString()} kWh`, "Consumo"]
              : [`$${v.toLocaleString()}`, "Costo"];
          }}
        />
        <Area
          yAxisId="kwh"
          type="monotone"
          dataKey="kwh"
          stroke="#0EA5E9"
          strokeWidth={2}
          fill="url(#colorKwh)"
        />
        <Area
          yAxisId="cost"
          type="monotone"
          dataKey="cost"
          stroke="#10B981"
          strokeWidth={2}
          fill="url(#colorCost)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
