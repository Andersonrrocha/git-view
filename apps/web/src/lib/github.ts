import type {
  Repository,
  Contributor,
  CommitActivity,
  LanguageBreakdown,
  Issue,
  PullRequest,
} from "@/types/github";

const GITHUB_API = "https://api.github.com";

async function githubFetch<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function fetchUserRepos(token: string): Promise<Repository[]> {
  return githubFetch<Repository[]>("/user/repos?per_page=100&sort=pushed&direction=desc", token);
}

export async function fetchRepoDetails(
  token: string,
  owner: string,
  repo: string,
): Promise<Repository> {
  return githubFetch<Repository>(`/repos/${owner}/${repo}`, token);
}

export async function fetchRepoLanguages(
  token: string,
  owner: string,
  repo: string,
): Promise<LanguageBreakdown> {
  return githubFetch<LanguageBreakdown>(`/repos/${owner}/${repo}/languages`, token);
}

export async function fetchRepoContributors(
  token: string,
  owner: string,
  repo: string,
): Promise<Contributor[]> {
  return githubFetch<Contributor[]>(`/repos/${owner}/${repo}/contributors?per_page=100`, token);
}

export async function fetchCommitActivity(
  token: string,
  owner: string,
  repo: string,
): Promise<CommitActivity[]> {
  return githubFetch<CommitActivity[]>(`/repos/${owner}/${repo}/stats/commit_activity`, token);
}

export async function fetchIssues(token: string, owner: string, repo: string): Promise<Issue[]> {
  return githubFetch<Issue[]>(`/repos/${owner}/${repo}/issues?state=all&per_page=100`, token);
}

export async function fetchPullRequests(
  token: string,
  owner: string,
  repo: string,
): Promise<PullRequest[]> {
  return githubFetch<PullRequest[]>(`/repos/${owner}/${repo}/pulls?state=all&per_page=100`, token);
}
