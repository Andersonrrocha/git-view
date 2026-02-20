import type {
  Repository,
  Contributor,
  CommitActivity,
  LanguageBreakdown,
  Issue,
  PullRequest,
} from "@/types/github";

const GITHUB_API = "https://api.github.com";

const defaultHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
});

async function githubFetch<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: defaultHeaders(token),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Stats endpoints return 202 while GitHub computes data in the background.
// We retry with no-cache to avoid persisting the empty response.
async function githubFetchStats<T>(path: string, token: string): Promise<T> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(`${GITHUB_API}${path}`, {
      headers: defaultHeaders(token),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    if (res.status !== 202) {
      return res.json();
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  return [] as T;
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
  return githubFetchStats<Contributor[]>(
    `/repos/${owner}/${repo}/contributors?per_page=100`,
    token,
  );
}

export async function fetchCommitActivity(
  token: string,
  owner: string,
  repo: string,
): Promise<CommitActivity[]> {
  return githubFetchStats<CommitActivity[]>(
    `/repos/${owner}/${repo}/stats/commit_activity`,
    token,
  );
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
