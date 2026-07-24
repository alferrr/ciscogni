export interface PreviewPage {
  id: string;
  label: string;
  category: string;
}

// Metadata for every item in the admin UI Preview gallery. Shared between
// the Preview page (which pairs each id with a render function) and the
// Checklist page (which tags notes with the page they belong to).
export const PREVIEW_PAGES: PreviewPage[] = [
  { id: "onb-year", label: "Step 1: Year select", category: "Onboarding" },
  { id: "onb-welcome", label: "Step 2: Welcome", category: "Onboarding" },
  { id: "sk-dashboard", label: "Dashboard", category: "Loading Skeletons" },
  { id: "sk-leaderboard", label: "Leaderboard", category: "Loading Skeletons" },
  { id: "sk-profile", label: "Profile", category: "Loading Skeletons" },
  { id: "sk-onboarding", label: "Onboarding", category: "Loading Skeletons" },
  { id: "sk-quiz-progress", label: "Quiz (progress bar)", category: "Loading Skeletons" },
  { id: "sk-quiz-timer", label: "Quiz (timer)", category: "Loading Skeletons" },
  { id: "sk-admin-dash", label: "Admin Dashboard", category: "Loading Skeletons" },
  { id: "sk-admin-table", label: "Admin Table", category: "Loading Skeletons" },
  { id: "err-app", label: "App error page", category: "Errors & Not Found" },
  { id: "err-admin", label: "Admin error page", category: "Errors & Not Found" },
  { id: "nf-practice", label: "Practice: class not found", category: "Errors & Not Found" },
  { id: "nf-competitive", label: "Competitive: class not found", category: "Errors & Not Found" },
  { id: "empty-questions", label: "No questions found", category: "Empty States" },
  { id: "empty-users", label: "No users found", category: "Empty States" },
  { id: "empty-practice", label: "No progress data yet", category: "Empty States" },
  { id: "toasts", label: "Toast variants", category: "Toasts" },
];

export const previewPageLabel = (pageId: string | null): string =>
  PREVIEW_PAGES.find((p) => p.id === pageId)?.label ?? "General";
