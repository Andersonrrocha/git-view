import { useQuery } from "@tanstack/react-query";
import type {
  Repository,
  LanguageBreakdown,
  Contributor,
  CommitActivity,
  Issue,
  PullRequest,
} from "@/types/github";

interface RepoMetrics {
  details: Repository;
  languages: LanguageBreakdown;
  contributors: Contributor[];
  commitActivity: CommitActivity[];
  issues: Issue[];
  pullRequests: PullRequest[];
}

async function fetchRepoMetrics(owner: string, repo: string): Promise<RepoMetrics> {
  const res = await fetch(`/api/github/repos/${owner}/${repo}`);
  if (!res.ok) throw new Error("Failed to fetch repository metrics");
  return res.json();
}

export function useRepoMetrics(owner: string, repo: string) {
  return useQuery({
    queryKey: ["repo-metrics", owner, repo],
    queryFn: () => fetchRepoMetrics(owner, repo),
  });
}
