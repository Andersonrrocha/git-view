"use client";

import { useRepositories } from "@/hooks/use-repositories";
import { RepoCard } from "@/components/dashboard/repo-card";
import { RepoListSkeleton } from "@/components/dashboard/skeleton-dashboard";
import type { Repository } from "@/types/github";

interface RepoListProps {
  initialData: Repository[];
}

export function RepoList({ initialData }: RepoListProps) {
  const { data: repos, isLoading } = useRepositories();
  const displayRepos = repos ?? initialData;

  if (isLoading && !initialData.length) return <RepoListSkeleton />;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {displayRepos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
