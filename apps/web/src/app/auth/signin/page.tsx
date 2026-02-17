import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignInButton } from "./sign-in-button";

export default async function SignInPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Sign in to DevScope</h1>
        <p className="max-w-sm text-muted-foreground">
          Connect your GitHub account to analyze your repositories.
        </p>
      </div>
      <SignInButton />
    </div>
  );
}
