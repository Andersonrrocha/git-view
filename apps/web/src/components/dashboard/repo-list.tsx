"use client";

import { useMemo, useState } from "react";
import { Globe, Lock } from "lucide-react";
import { useRepositories } from "@/hooks/use-repositories";
import { RepoCard } from "@/components/dashboard/repo-card";
import { RepoListSkeleton } from "@/components/dashboard/skeleton-dashboard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Repository } from "@/types/github";

type VisibilityFilter = "all" | "public" | "private";

interface RepoListProps {
  initialData: Repository[];
}

export function RepoList({ initialData }: RepoListProps) {
  const { data: repos, isLoading } = useRepositories();
  const [filter, setFilter] = useState<VisibilityFilter>("all");

  const displayRepos = repos ?? initialData;

  const filtered = useMemo(
    () =>
      filter === "all"
        ? displayRepos
        : displayRepos.filter((r) => (filter === "private" ? r.private : !r.private)),
    [displayRepos, filter],
  );

  const counts = useMemo(
    () => ({
      all: displayRepos.length,
      public: displayRepos.filter((r) => !r.private).length,
      private: displayRepos.filter((r) => r.private).length,
    }),
    [displayRepos],
  );

  if (isLoading && !initialData.length) return <RepoListSkeleton />;

  return (
    <div className="space-y-4">
      <ToggleGroup
        type="single"
        value={filter}
        onValueChange={(v) => {
          if (v) setFilter(v as VisibilityFilter);
        }}
        className="justify-start"
      >
        <ToggleGroupItem value="all" aria-label="Show all repositories">
          All ({counts.all})
        </ToggleGroupItem>
        <ToggleGroupItem value="public" aria-label="Show public repositories">
          <Globe className="mr-1.5 size-3.5" />
          Public ({counts.public})
        </ToggleGroupItem>
        <ToggleGroupItem value="private" aria-label="Show private repositories">
          <Lock className="mr-1.5 size-3.5" />
          Private ({counts.private})
        </ToggleGroupItem>
      </ToggleGroup>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No {filter === "all" ? "" : filter} repositories found.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}
