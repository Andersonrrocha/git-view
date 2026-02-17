import Link from "next/link";
import { GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <GitBranch className="size-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">DevScope</h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Connect your GitHub repositories and get intelligent metrics, visualizations, and insights
          about your codebase.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/dashboard">Get Started</Link>
      </Button>
    </div>
  );
}
