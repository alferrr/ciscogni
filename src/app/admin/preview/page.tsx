"use client";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import "../../onboarding/onboarding.css";

import DashboardSkeleton from "@/components/Skeleton/DashboardSkeleton";
import LeaderboardSkeleton from "@/components/Skeleton/LeaderboardSkeleton";
import ProfileSkeleton from "@/components/Skeleton/ProfileSkeleton";
import OnboardingSkeleton from "@/components/Skeleton/OnboardingSkeleton";
import QuizSkeleton from "@/components/Skeleton/QuizSkeleton";
import AdminDashboardSkeleton from "@/components/Skeleton/AdminDashboardSkeleton";
import AdminTableSkeleton from "@/components/Skeleton/AdminTableSkeleton";

import AppError from "@/app/error";
import AdminError from "@/app/admin/error";
import PracticeNotFound from "@/app/practice/[class]/not-found";
import CompetitiveNotFound from "@/app/competitive/[class]/not-found";

const noop = () => {};
const previewError = new Error("Preview error");

const OnboardingYearPreview = () => (
  <div className="onboarding">
    <div className="onboarding-card">
      <div className="onboarding-header">
        <h1>Welcome to Ciscogni!</h1>
        <p>Let&apos;s get your profile set up before you start.</p>
      </div>
      <form className="onboarding-form" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label>What year are you in?</label>
          <select defaultValue="">
            <option value="">Select year</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <button type="submit" className="onboarding-btn">
          Continue
        </button>
      </form>
    </div>
  </div>
);

const OnboardingWelcomePreview = () => (
  <div className="onboarding">
    <div className="onboarding-card">
      <div className="onboarding-header">
        <h1>You&apos;re all set!</h1>
        <p>Here&apos;s what you can do next.</p>
      </div>
      <div className="welcome-list">
        {[
          { title: "Practice", desc: "Drill topics at your own pace." },
          {
            title: "Daily Challenge",
            desc: "5 questions a day to build your streak.",
          },
          {
            title: "Competitive",
            desc: "Timed rounds against the clock for bonus XP.",
          },
          {
            title: "Leaderboard",
            desc: "See how you rank against your classmates.",
          },
        ].map((h) => (
          <div key={h.title} className="welcome-item">
            <div className="welcome-text">
              <strong>{h.title}</strong>
              <span>{h.desc}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="onboarding-btn">Get Started</button>
    </div>
  </div>
);

const EmptyStatePreview = ({ text }: { text: string }) => (
  <p style={{ textAlign: "center", color: "var(--muted)", padding: "2rem" }}>
    {text}
  </p>
);

const ToastPreview = () => {
  const { showToast } = useToast();
  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <button
        className="admin-btn primary"
        onClick={() => showToast("Saved successfully.", "success")}
      >
        Fire success toast
      </button>
      <button
        className="admin-btn danger"
        onClick={() => showToast("Something went wrong.", "error")}
      >
        Fire error toast
      </button>
      <button
        className="admin-btn secondary"
        onClick={() => showToast("Heads up, here's some info.", "info")}
      >
        Fire info toast
      </button>
    </div>
  );
};

const CATEGORIES: {
  name: string;
  items: { id: string; label: string; render: () => React.ReactNode }[];
}[] = [
  {
    name: "Onboarding",
    items: [
      { id: "onb-year", label: "Step 1: Year select", render: () => <OnboardingYearPreview /> },
      { id: "onb-welcome", label: "Step 2: Welcome", render: () => <OnboardingWelcomePreview /> },
    ],
  },
  {
    name: "Loading Skeletons",
    items: [
      { id: "sk-dashboard", label: "Dashboard", render: () => <DashboardSkeleton /> },
      { id: "sk-leaderboard", label: "Leaderboard", render: () => <LeaderboardSkeleton /> },
      { id: "sk-profile", label: "Profile", render: () => <ProfileSkeleton /> },
      { id: "sk-onboarding", label: "Onboarding", render: () => <OnboardingSkeleton /> },
      { id: "sk-quiz-progress", label: "Quiz (progress bar)", render: () => <QuizSkeleton variant="progress" showHeader /> },
      { id: "sk-quiz-timer", label: "Quiz (timer)", render: () => <QuizSkeleton variant="timer" /> },
      { id: "sk-admin-dash", label: "Admin Dashboard", render: () => <AdminDashboardSkeleton /> },
      {
        id: "sk-admin-table",
        label: "Admin Table",
        render: () => (
          <table className="admin-table">
            <tbody>
              <AdminTableSkeleton columns={6} />
            </tbody>
          </table>
        ),
      },
    ],
  },
  {
    name: "Errors & Not Found",
    items: [
      { id: "err-app", label: "App error page", render: () => <AppError error={previewError} reset={noop} /> },
      { id: "err-admin", label: "Admin error page", render: () => <AdminError error={previewError} reset={noop} /> },
      { id: "nf-practice", label: "Practice: class not found", render: () => <PracticeNotFound /> },
      { id: "nf-competitive", label: "Competitive: class not found", render: () => <CompetitiveNotFound /> },
    ],
  },
  {
    name: "Empty States",
    items: [
      { id: "empty-questions", label: "No questions found", render: () => <EmptyStatePreview text="No questions found." /> },
      { id: "empty-users", label: "No users found", render: () => <EmptyStatePreview text="No users found." /> },
      { id: "empty-practice", label: "No progress data yet", render: () => <EmptyStatePreview text="No data yet. Start practicing!" /> },
    ],
  },
  {
    name: "Toasts",
    items: [{ id: "toasts", label: "Toast variants", render: () => <ToastPreview /> }],
  },
];

const AdminPreview = () => {
  const [selectedId, setSelectedId] = useState(CATEGORIES[0].items[0].id);

  const selected = CATEGORIES.flatMap((c) => c.items).find(
    (i) => i.id === selectedId,
  );

  return (
    <div>
      <h1 className="admin-page-title">UI Preview</h1>
      <div className="preview-layout">
        <div className="preview-sidebar">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="preview-category">
              <p className="preview-category-title">{cat.name}</p>
              {cat.items.map((item) => (
                <button
                  key={item.id}
                  className={`preview-nav-item ${selectedId === item.id ? "active" : ""}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="preview-frame">
          <div className="preview-frame-inner">{selected?.render()}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminPreview;
