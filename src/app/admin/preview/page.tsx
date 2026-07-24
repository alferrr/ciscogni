"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPlus } from "react-icons/fa6";
import { useToast } from "@/context/ToastContext";
import { PREVIEW_PAGES } from "@/config/previewPages";
import { COURSES } from "@/config/courses";
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

interface Task {
  id: number;
  text: string;
  done: boolean;
  pageId: string | null;
}

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
          <label>What course are you taking?</label>
          <select defaultValue="">
            <option value="">Select course</option>
            {COURSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
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

const RENDERERS: Record<string, () => React.ReactNode> = {
  "onb-year": () => <OnboardingYearPreview />,
  "onb-welcome": () => <OnboardingWelcomePreview />,
  "sk-dashboard": () => <DashboardSkeleton />,
  "sk-leaderboard": () => <LeaderboardSkeleton />,
  "sk-profile": () => <ProfileSkeleton />,
  "sk-onboarding": () => <OnboardingSkeleton />,
  "sk-quiz-progress": () => <QuizSkeleton variant="progress" showHeader />,
  "sk-quiz-timer": () => <QuizSkeleton variant="timer" />,
  "sk-admin-dash": () => <AdminDashboardSkeleton />,
  "sk-admin-table": () => (
    <table className="admin-table">
      <tbody>
        <AdminTableSkeleton columns={6} />
      </tbody>
    </table>
  ),
  "err-app": () => <AppError error={previewError} reset={noop} />,
  "err-admin": () => <AdminError error={previewError} reset={noop} />,
  "nf-practice": () => <PracticeNotFound />,
  "nf-competitive": () => <CompetitiveNotFound />,
  "empty-questions": () => <EmptyStatePreview text="No questions found." />,
  "empty-users": () => <EmptyStatePreview text="No users found." />,
  "empty-practice": () => (
    <EmptyStatePreview text="No data yet. Start practicing!" />
  ),
  toasts: () => <ToastPreview />,
};

const CATEGORIES = Object.values(
  PREVIEW_PAGES.reduce(
    (acc, p) => {
      if (!acc[p.category]) acc[p.category] = { name: p.category, items: [] };
      acc[p.category].items.push({ id: p.id, label: p.label });
      return acc;
    },
    {} as Record<string, { name: string; items: { id: string; label: string }[] }>,
  ),
);

const AdminPreview = () => {
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState(PREVIEW_PAGES[0].id);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [noteText, setNoteText] = useState("");

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get("/api/admin/tasks");
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const pendingCount = (pageId: string) =>
    tasks.filter((t) => t.pageId === pageId && !t.done).length;

  const notesForSelected = tasks.filter((t) => t.pageId === selectedId);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    try {
      const { data } = await axios.post("/api/admin/tasks", {
        text: noteText,
        pageId: selectedId,
      });
      setTasks((prev) => [data, ...prev]);
      setNoteText("");
    } catch {
      showToast("Failed to add note.", "error");
    }
  };

  const toggleDone = async (task: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)),
    );
    try {
      await axios.put("/api/admin/tasks", { id: task.id, done: !task.done });
    } catch {
      showToast("Failed to update note.", "error");
      fetchTasks();
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await axios.delete("/api/admin/tasks", { data: { id } });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      showToast("Failed to delete note.", "error");
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">UI Preview</h1>
      <div className="preview-layout">
        <div className="preview-sidebar">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="preview-category">
              <p className="preview-category-title">{cat.name}</p>
              {cat.items.map((item) => {
                const count = pendingCount(item.id);
                return (
                  <button
                    key={item.id}
                    className={`preview-nav-item ${selectedId === item.id ? "active" : ""}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <span>{item.label}</span>
                    {count > 0 && (
                      <span className="preview-nav-badge">{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="preview-frame">
          <div className="preview-notes">
            <p className="preview-notes-title">Notes for this page</p>

            <form className="preview-notes-form" onSubmit={handleAddNote}>
              <input
                className="admin-search"
                style={{ margin: 0, flex: 1 }}
                placeholder="Add a note about what needs to change..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <button className="admin-btn primary" type="submit">
                <FaPlus /> Add
              </button>
            </form>

            {notesForSelected.length === 0 ? (
              <p className="preview-notes-empty">No notes for this page.</p>
            ) : (
              <div className="checklist-list">
                {notesForSelected.map((t) => (
                  <div key={t.id} className="checklist-item">
                    <label className="checklist-label">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => toggleDone(t)}
                      />
                      <span className={t.done ? "checklist-text-done" : ""}>
                        {t.text}
                      </span>
                    </label>
                    <button
                      className="admin-btn danger"
                      onClick={() => handleDeleteNote(t.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="preview-frame-inner">
            {RENDERERS[selectedId]?.()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPreview;
