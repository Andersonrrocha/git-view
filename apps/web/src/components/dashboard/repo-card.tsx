import Link from "next/link";
import { Star, GitFork, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Repository } from "@/types/github";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

interface RepoCardProps {
  repo: Repository;
}

export function RepoCard({ repo }: RepoCardProps) {
  return (
    <Link href={`/dashboard/${repo.owner.login}/${repo.name}`} className="flex">
      <Card className="flex w-full flex-col transition-colors hover:border-primary/50">
        <CardHeader className="flex-1 pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="truncate text-base leading-tight">{repo.name}</CardTitle>
            <Badge variant={repo.private ? "secondary" : "outline"} className="shrink-0 text-xs">
              {repo.private ? "Private" : "Public"}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2 min-h-[2.5rem]">
            {repo.description ?? "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {repo.language && (
              <span className="flex items-center gap-1">
                <span className="size-3 rounded-full bg-primary" />
                {repo.language}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="size-3.5" />
              {repo.stargazers_count}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="size-3.5" />
              {repo.forks_count}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {formatDate(repo.pushed_at)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
