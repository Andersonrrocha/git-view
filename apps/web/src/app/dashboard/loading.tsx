import { RepoListSkeleton } from "@/components/dashboard/skeleton-dashboard";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-7 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
      <RepoListSkeleton />
    </div>
  );
}
