"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CommitActivity } from "@/types/github";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getIntensityClass(count: number): string {
  if (count === 0) return "bg-muted";
  if (count <= 2) return "bg-chart-1/30";
  if (count <= 5) return "bg-chart-1/50";
  if (count <= 9) return "bg-chart-1/75";
  return "bg-chart-1";
}

function formatDate(weekTimestamp: number, dayIndex: number): string {
  const date = new Date(weekTimestamp * 1000);
  date.setDate(date.getDate() + dayIndex);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getMonthLabel(weekTimestamp: number): string | null {
  const date = new Date(weekTimestamp * 1000);
  if (date.getDate() <= 7) {
    return date.toLocaleDateString("en-US", { month: "short" });
  }
  return null;
}

interface ActivityHeatmapProps {
  data: CommitActivity[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const { grid, months } = useMemo(() => {
    const g = data.map((week) => ({
      week: week.week,
      days: week.days,
    }));

    const m: { label: string; colStart: number }[] = [];
    g.forEach((week, i) => {
      const label = getMonthLabel(week.week);
      if (label && (m.length === 0 || m[m.length - 1].label !== label)) {
        m.push({ label, colStart: i });
      }
    });

    return { grid: g, months: m };
  }, [data]);

  if (!data.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="mb-1 flex pl-10">
              {months.map((m, i) => (
                <span
                  key={i}
                  className="text-xs text-muted-foreground"
                  style={{
                    position: "relative",
                    left: `${(m.colStart / grid.length) * 100}%`,
                  }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            <div className="flex gap-0.5">
              <div className="flex flex-col gap-0.5 pr-2">
                {DAY_LABELS.map((day, i) => (
                  <span
                    key={i}
                    className="flex h-3 items-center text-[10px] leading-none text-muted-foreground"
                  >
                    {i % 2 === 1 ? day : ""}
                  </span>
                ))}
              </div>

              <TooltipProvider delayDuration={100}>
                <div className="flex gap-0.5">
                  {grid.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-0.5">
                      {week.days.map((count, di) => (
                        <Tooltip key={di}>
                          <TooltipTrigger asChild>
                            <div
                              className={`size-3 rounded-sm ${getIntensityClass(count)} transition-colors hover:ring-1 hover:ring-foreground/30`}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            <span className="font-medium">{count} commits</span>
                            <span className="text-muted-foreground"> on {formatDate(week.week, di)}</span>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  ))}
                </div>
              </TooltipProvider>
            </div>

            <div className="mt-2 flex items-center justify-end gap-1 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="size-3 rounded-sm bg-muted" />
              <div className="size-3 rounded-sm bg-chart-1/30" />
              <div className="size-3 rounded-sm bg-chart-1/50" />
              <div className="size-3 rounded-sm bg-chart-1/75" />
              <div className="size-3 rounded-sm bg-chart-1" />
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
