export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string;
  updated_at: string;
  visibility: string;
  private: boolean;
  default_branch: string;
}

export interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

export interface CommitActivity {
  days: number[];
  total: number;
  week: number;
}

export interface LanguageBreakdown {
  [language: string]: number;
}

export interface Issue {
  id: number;
  title: string;
  state: "open" | "closed";
  created_at: string;
  closed_at: string | null;
  pull_request?: {
    url: string;
  };
}

export interface PullRequest {
  id: number;
  title: string;
  state: "open" | "closed";
  created_at: string;
  closed_at: string | null;
  merged_at: string | null;
}
