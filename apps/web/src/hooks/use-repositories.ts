import { useQuery } from "@tanstack/react-query";
import type { Repository } from "@/types/github";

async function fetchRepos(): Promise<Repository[]> {
  const res = await fetch("/api/github/repos");
  if (!res.ok) throw new Error("Failed to fetch repositories");
  return res.json();
}

export function useRepositories() {
  return useQuery({
    queryKey: ["repositories"],
    queryFn: fetchRepos,
  });
}
