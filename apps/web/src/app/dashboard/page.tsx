import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchUserRepos } from "@/lib/github";
import { RepoCard } from "@/components/dashboard/repo-card";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.accessToken) redirect("/auth/signin");

  const repos = await fetchUserRepos(session.accessToken);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Repositories</h1>
        <p className="text-muted-foreground mt-1">
          Select a repository to view detailed metrics and insights.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
}
