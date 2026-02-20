import { auth } from "@/lib/auth";
import {
  fetchRepoDetails,
  fetchRepoLanguages,
  fetchRepoContributors,
  fetchCommitActivity,
  fetchIssues,
  fetchPullRequests,
} from "@/lib/github";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ owner: string; repo: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { owner, repo } = await params;
  const token = session.accessToken;

  const [details, languages, contributors, commitActivity, issues, pullRequests] =
    await Promise.all([
      fetchRepoDetails(token, owner, repo),
      fetchRepoLanguages(token, owner, repo),
      fetchRepoContributors(token, owner, repo),
      fetchCommitActivity(token, owner, repo),
      fetchIssues(token, owner, repo),
      fetchPullRequests(token, owner, repo),
    ]);

  return NextResponse.json(
    { details, languages, contributors, commitActivity, issues, pullRequests },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
