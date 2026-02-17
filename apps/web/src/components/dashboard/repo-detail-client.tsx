"use client";

import { useRepoMetrics } from "@/hooks/use-repo-metrics";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { CommitChart } from "@/components/dashboard/commit-chart";
import { LanguageChart } from "@/components/dashboard/language-chart";
import { IssuesChart } from "@/components/dashboard/issues-chart";
import { RepoDetailSkeleton } from "@/components/dashboard/skeleton-dashboard";

interface RepoDetailClientProps {
  owner: string;
  repo: string;
}

export function RepoDetailClient({ owner, repo }: RepoDetailClientProps) {
  const { data, isLoading } = useRepoMetrics(owner, repo);

  if (isLoading || !data) return <RepoDetailSkeleton />;

  const { languages, contributors, commitActivity, issues, pullRequests } = data;

  const totalCommits = Array.isArray(commitActivity)
    ? commitActivity.reduce((sum, week) => sum + week.total, 0)
    : 0;

  const languageEntries = Object.entries(languages);
  const topLanguage =
    languageEntries.length > 0 ? languageEntries.sort(([, a], [, b]) => b - a)[0][0] : null;

  const openIssues = issues.filter((i) => i.state === "open" && !i.pull_request).length;
  const closedIssues = issues.filter((i) => i.state === "closed" && !i.pull_request).length;
  const openPRs = pullRequests.filter((pr) => pr.state === "open").length;
  const closedPRs = pullRequests.filter((pr) => pr.state === "closed").length;

  return (
    <>
      <MetricsCards
        totalCommits={totalCommits}
        totalContributors={contributors.length}
        openIssues={openIssues}
        closedIssues={closedIssues}
        openPRs={openPRs}
        closedPRs={closedPRs}
        topLanguage={topLanguage}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.isArray(commitActivity) && commitActivity.length > 0 && (
          <CommitChart data={commitActivity} />
        )}
        {Object.keys(languages).length > 0 && <LanguageChart data={languages} />}
      </div>

      <IssuesChart
        openIssues={openIssues}
        closedIssues={closedIssues}
        openPRs={openPRs}
        closedPRs={closedPRs}
      />
    </>
  );
}
