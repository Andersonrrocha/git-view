import { GitCommit, Users, AlertCircle, GitPullRequest, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

function MetricCard({ title, value, icon, description }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

interface MetricsCardsProps {
  totalCommits: number;
  totalContributors: number;
  openIssues: number;
  closedIssues: number;
  openPRs: number;
  closedPRs: number;
  topLanguage: string | null;
}

export function MetricsCards({
  totalCommits,
  totalContributors,
  openIssues,
  closedIssues,
  openPRs,
  closedPRs,
  topLanguage,
}: MetricsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Commits"
        value={totalCommits.toLocaleString()}
        icon={<GitCommit className="size-4 text-muted-foreground" />}
        description="Last 52 weeks"
      />
      <MetricCard
        title="Contributors"
        value={totalContributors}
        icon={<Users className="size-4 text-muted-foreground" />}
      />
      <MetricCard
        title="Issues"
        value={`${openIssues} open`}
        icon={<AlertCircle className="size-4 text-muted-foreground" />}
        description={`${closedIssues} closed`}
      />
      <MetricCard
        title="Pull Requests"
        value={`${openPRs} open`}
        icon={<GitPullRequest className="size-4 text-muted-foreground" />}
        description={`${closedPRs} closed`}
      />
      {topLanguage && (
        <MetricCard
          title="Top Language"
          value={topLanguage}
          icon={<Code className="size-4 text-muted-foreground" />}
        />
      )}
    </div>
  );
}
