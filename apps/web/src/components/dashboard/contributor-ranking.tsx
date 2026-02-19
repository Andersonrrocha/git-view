"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Contributor } from "@/types/github";

interface ContributorRankingProps {
  data: Contributor[];
}

export function ContributorRanking({ data }: ContributorRankingProps) {
  const top = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.contributions - a.contributions);
    return sorted.slice(0, 10);
  }, [data]);

  const maxContributions = top[0]?.contributions ?? 1;

  if (!data.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Contributors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {top.map((contributor, index) => {
          const pct = (contributor.contributions / maxContributions) * 100;
          return (
            <div key={contributor.login} className="flex items-center gap-3">
              <span className="w-5 text-right text-xs font-medium text-muted-foreground">
                {index + 1}
              </span>

              <Avatar size="sm">
                <AvatarImage
                  src={contributor.avatar_url}
                  alt={contributor.login}
                />
                <AvatarFallback>
                  {contributor.login.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <a
                    href={`https://github.com/${contributor.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm font-medium hover:underline"
                  >
                    {contributor.login}
                  </a>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {contributor.contributions} commits
                  </span>
                </div>
                <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-chart-2 h-full rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
