"use client";

import { Lightbulb, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Insight } from "@/lib/insights";

const iconMap = {
  positive: TrendingUp,
  negative: TrendingDown,
  neutral: Minus,
} as const;

const colorMap = {
  positive: "text-green-500",
  negative: "text-red-500",
  neutral: "text-muted-foreground",
} as const;

const bgMap = {
  positive: "bg-green-500/10",
  negative: "bg-red-500/10",
  neutral: "bg-muted",
} as const;

interface RepoInsightsProps {
  insights: Insight[];
}

export function RepoInsights({ insights }: RepoInsightsProps) {
  if (!insights.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="size-4 text-yellow-500" />
          Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {insights.map((insight, i) => {
            const Icon = iconMap[insight.type];
            return (
              <div
                key={i}
                className={`flex items-start gap-2.5 rounded-lg p-3 ${bgMap[insight.type]}`}
              >
                <Icon className={`mt-0.5 size-4 shrink-0 ${colorMap[insight.type]}`} />
                <span className="text-sm leading-snug">{insight.text}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
