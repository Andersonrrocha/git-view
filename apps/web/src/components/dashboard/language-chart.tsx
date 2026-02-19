"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LanguageBreakdown } from "@/types/github";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

interface LanguageChartProps {
  data: LanguageBreakdown;
}

export function LanguageChart({ data }: LanguageChartProps) {
  const totalBytes = Object.values(data).reduce((sum, bytes) => sum + bytes, 0);

  const chartData = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, bytes]) => ({
      name,
      value: bytes,
      pct: ((bytes / totalBytes) * 100).toFixed(1),
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Languages</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={(props: PieLabelRenderProps) => {
                const entry = chartData.find((d) => d.name === props.name);
                return entry ? `${entry.name} ${entry.pct}%` : "";
              }}
              labelLine={{ stroke: "var(--muted-foreground)" }}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${((Number(value) / totalBytes) * 100).toFixed(1)}%`}
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--card-foreground)",
              }}
              itemStyle={{ color: "var(--card-foreground)" }}
            />
            <Legend
              wrapperStyle={{ color: "var(--foreground)" }}
              formatter={(value) => <span style={{ color: "var(--foreground)" }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
