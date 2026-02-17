import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { CommitChart } from "@/components/dashboard/commit-chart";
import { LanguageChart } from "@/components/dashboard/language-chart";
import { IssuesChart } from "@/components/dashboard/issues-chart";
import {
  fetchRepoDetails,
  fetchRepoLanguages,
  fetchRepoContributors,
  fetchCommitActivity,
  fetchIssues,
  fetchPullRequests,
} from "@/lib/github";

interface RepoPageProps {
  params: Promise<{ owner: string; repo: string }>;
}

export default async function RepoPage({ params }: RepoPageProps) {
  const session = await auth();
  if (!session?.accessToken) redirect("/auth/signin");

  const { owner, repo: repoName } = await params;
  const token = session.accessToken;

  const [repoDetails, languages, contributors, commitActivity, issues, pullRequests] =
    await Promise.all([
      fetchRepoDetails(token, owner, repoName),
      fetchRepoLanguages(token, owner, repoName),
      fetchRepoContributors(token, owner, repoName),
      fetchCommitActivity(token, owner, repoName),
      fetchIssues(token, owner, repoName),
      fetchPullRequests(token, owner, repoName),
    ]);

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
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="size-8">
              <Link href="/dashboard">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              {owner}/{repoName}
            </h1>
            <Badge variant={repoDetails.private ? "secondary" : "outline"}>
              {repoDetails.private ? "Private" : "Public"}
            </Badge>
          </div>
          {repoDetails.description && (
            <p className="text-muted-foreground ml-11">{repoDetails.description}</p>
          )}
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={repoDetails.html_url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 size-4" />
            GitHub
          </a>
        </Button>
      </div>

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
    </div>
  );
}
