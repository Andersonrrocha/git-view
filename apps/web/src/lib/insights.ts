import type { CommitActivity, Contributor, Issue, PullRequest } from "@/types/github";

export interface Insight {
  type: "positive" | "negative" | "neutral";
  text: string;
}

interface InsightInput {
  commitActivity: CommitActivity[];
  contributors: Contributor[];
  issues: Issue[];
  pullRequests: PullRequest[];
}

export function generateInsights({
  commitActivity,
  contributors,
  issues,
  pullRequests,
}: InsightInput): Insight[] {
  const insights: Insight[] = [];

  if (Array.isArray(commitActivity) && commitActivity.length >= 8) {
    activityTrend(commitActivity, insights);
    mostActiveDay(commitActivity, insights);
    staleDetection(commitActivity, insights);
  }

  if (contributors.length > 0) {
    contributorDominance(contributors, insights);
  }

  if (issues.length > 0) {
    issueCloseRate(issues, insights);
  }

  if (pullRequests.length > 0) {
    prMergeRate(pullRequests, insights);
  }

  return insights;
}

function activityTrend(data: CommitActivity[], out: Insight[]) {
  const len = data.length;
  const recent4 = data.slice(len - 4).reduce((s, w) => s + w.total, 0);
  const previous4 = data.slice(len - 8, len - 4).reduce((s, w) => s + w.total, 0);

  if (previous4 === 0 && recent4 > 0) {
    out.push({
      type: "positive",
      text: `Commit activity resumed with ${recent4} commits in the last 4 weeks`,
    });
    return;
  }

  if (previous4 === 0) return;

  const change = ((recent4 - previous4) / previous4) * 100;
  const absChange = Math.abs(Math.round(change));

  if (absChange < 10) return;

  if (change > 0) {
    out.push({
      type: "positive",
      text: `Commit activity increased by ${absChange}% in the last month`,
    });
  } else {
    out.push({
      type: "negative",
      text: `Commit activity decreased by ${absChange}% in the last month`,
    });
  }
}

function mostActiveDay(data: CommitActivity[], out: Insight[]) {
  const dayTotals = [0, 0, 0, 0, 0, 0, 0];
  const dayNames = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];

  for (const week of data) {
    for (let d = 0; d < 7; d++) {
      dayTotals[d] += week.days[d];
    }
  }

  const totalAll = dayTotals.reduce((a, b) => a + b, 0);
  if (totalAll === 0) return;

  const maxIdx = dayTotals.indexOf(Math.max(...dayTotals));
  const pct = Math.round((dayTotals[maxIdx] / totalAll) * 100);

  if (pct > 20) {
    out.push({
      type: "neutral",
      text: `${dayNames[maxIdx]} are the most active day with ${pct}% of commits`,
    });
  }
}

function staleDetection(data: CommitActivity[], out: Insight[]) {
  const recent4 = data.slice(-4).reduce((s, w) => s + w.total, 0);
  if (recent4 === 0) {
    out.push({
      type: "negative",
      text: "No commit activity in the last 4 weeks",
    });
  }
}

function contributorDominance(contributors: Contributor[], out: Insight[]) {
  const total = contributors.reduce((s, c) => s + c.contributions, 0);
  if (total === 0) return;

  const sorted = [...contributors].sort((a, b) => b.contributions - a.contributions);
  const topPct = Math.round((sorted[0].contributions / total) * 100);

  if (topPct >= 70) {
    out.push({
      type: "neutral",
      text: `${sorted[0].login} authored ${topPct}% of all commits`,
    });
  }
}

function issueCloseRate(issues: Issue[], out: Insight[]) {
  const realIssues = issues.filter((i) => !i.pull_request);
  if (realIssues.length === 0) return;

  const closed = realIssues.filter((i) => i.state === "closed").length;
  const pct = Math.round((closed / realIssues.length) * 100);

  if (pct >= 50) {
    out.push({
      type: "positive",
      text: `${pct}% of issues have been resolved`,
    });
  } else {
    out.push({
      type: "negative",
      text: `Only ${pct}% of issues have been resolved`,
    });
  }
}

function prMergeRate(prs: PullRequest[], out: Insight[]) {
  if (prs.length === 0) return;

  const merged = prs.filter((pr) => pr.merged_at !== null).length;
  const pct = Math.round((merged / prs.length) * 100);

  if (pct >= 70) {
    out.push({
      type: "positive",
      text: `${pct}% of pull requests have been merged`,
    });
  } else if (pct > 0) {
    out.push({
      type: "neutral",
      text: `${pct}% of pull requests have been merged`,
    });
  }
}
