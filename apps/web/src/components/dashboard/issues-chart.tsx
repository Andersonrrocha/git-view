"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IssuesChartProps {
  openIssues: number;
  closedIssues: number;
  openPRs: number;
  closedPRs: number;
}

export function IssuesChart({ openIssues, closedIssues, openPRs, closedPRs }: IssuesChartProps) {
  const chartData = [
    { name: "Issues", open: openIssues, closed: closedIssues },
    { name: "Pull Requests", open: openPRs, closed: closedPRs },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Issues & Pull Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              stroke="var(--border)"
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              stroke="var(--border)"
            />
            <Tooltip
              cursor={{ fill: "var(--accent)", opacity: 0.5 }}
              contentStyle={{
                backgroundColor: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
              }}
              labelStyle={{ color: "var(--popover-foreground)" }}
              itemStyle={{ color: "var(--popover-foreground)" }}
            />
            <Legend
              wrapperStyle={{ color: "var(--foreground)" }}
              formatter={(value) => <span style={{ color: "var(--foreground)" }}>{value}</span>}
            />
            <Bar dataKey="open" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Open" />
            <Bar dataKey="closed" fill="var(--chart-2)" radius={[4, 4, 0, 0]} name="Closed" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
