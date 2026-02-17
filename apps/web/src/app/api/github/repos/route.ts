import { auth } from "@/lib/auth";
import { fetchUserRepos } from "@/lib/github";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repos = await fetchUserRepos(session.accessToken);
  return NextResponse.json(repos);
}
