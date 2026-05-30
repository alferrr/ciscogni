"use client";
import Header from "@/components/Header/Header";
import { useEffect, useState, useCallback } from "react";
import "./dashboard.css";
import {
  FaFire,
  FaBolt,
  FaBook,
  FaCode,
  FaBrain,
  FaArrowRight,
  FaTrophy,
} from "react-icons/fa6";
import { LuParentheses } from "react-icons/lu";
import { MdDataArray } from "react-icons/md";
import { useRouter } from "next/navigation";
import axios from "axios";
import DashboardSkeleton from "@/components/Skeleton/DashboardSkeleton";

const lessons = [
  { label: "Loops & Iteration", color: "#1752f0", icon: <FaCode /> },
  { label: "Conditionals", color: "#7c3aed", icon: <FaBrain /> },
  { label: "Arrays", color: "#0891b2", icon: <MdDataArray /> },
  { label: "Functions", color: "#059669", icon: <LuParentheses /> },
];

const Dashboard = () => {
  const router = useRouter();
  const [streak, setStreak] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [greeting, setGreeting] = useState("Good Morning");
  const [sessions, setSessions] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/me");
      setUser(data);
      setStreak(data.streak || 0);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      router.push("/");
    } finally {
      setPageLoading(false);
    }
  }, [router]);

  const fetchSessions = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/sessions");
      setSessions(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    fetchUser();
    fetchSessions();
  }, [fetchUser, fetchSessions]);

  useEffect(() => {
    const handleFocus = () => {
      fetchUser();
      fetchSessions();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchUser, fetchSessions]);

  if (pageLoading)
    return (
      <>
        <Header />
        <DashboardSkeleton />
      </>
    );

  return (
    <>
      <Header />
      <div className="dashboard">
        <div className="container">
          <div className="greeting">
            <h1>
              {greeting}, {user?.name?.split(" ")[0] ?? "Student"}
            </h1>
            <p>Ready to train your programming brain today?</p>
          </div>

          <div className="top-row">
            <div className="box streak-box">
              <FaFire className={`fire ${streak > 0 ? "active" : ""}`} />
              <p className="box-label">Current Streak</p>
              <span className={`count ${streak > 0 ? "active" : ""}`}>
                <FaFire /> {streak} {streak === 1 ? "day" : "days"}
              </span>
              <p className="box-sub">
                {streak > 0
                  ? "Keep it up! Don't break the chain."
                  : "Start your streak today!"}
              </p>
              <a href="/daily" className="box-btn">
                Start Daily Challenge <FaArrowRight />
              </a>
            </div>
          </div>

          <div className="section-header">
            <h2>Competitive Mode</h2>
          </div>
          <div className="comp-grid">
            <a href="/competitive?mode=midterms" className="comp-card premid">
              <div className="comp-card-top">
                <FaTrophy className="comp-icon" />
              </div>
              <p className="comp-title">Midterms Exam</p>
              <p className="comp-desc">
                Intro to Programming, Expressions, Functions, Built-ins, Control
                Structure I
              </p>
              <div className="comp-footer">
                <span>15s per question</span>
                <FaArrowRight />
              </div>
            </a>

            <a href="/competitive?mode=finals" className="comp-card finals">
              <div className="comp-card-top">
                <FaTrophy className="comp-icon" />
              </div>
              <p className="comp-title">Finals Exam</p>
              <p className="comp-desc">
                Everything in Midterms + Loops, Debugging, Arrays & Pointers
              </p>
              <div className="comp-footer">
                <span>15s per question</span>
                <FaArrowRight />
              </div>
            </a>
          </div>

          <div className="section-header">
            <h2>Your Stats</h2>
          </div>
          <div className="stats-row">
            <div className="stat-card">
              <p className="stat-value">{user?.xp ?? 0}</p>
              <p className="stat-label">Total XP</p>
            </div>
            <div className="stat-card">
              <p className="stat-value">#{user?.rank ?? "—"}</p>
              <p className="stat-label">Rank</p>
            </div>
            <div className="stat-card">
              <p className="stat-value">{streak}</p>
              <p className="stat-label">Day Streak</p>
            </div>
          </div>

          <div className="section-header">
            <h2>Practice by Topic</h2>
            <a href="/practice">
              See all <FaArrowRight />
            </a>
          </div>
          <div className="lesson-container">
            {lessons.map((l) => (
              <a
                href="/practice"
                key={l.label}
                className="lesson-box"
                style={{ background: l.color }}
              >
                <span className="lesson-icon">{l.icon}</span>
                <span className="lesson-label">{l.label}</span>
                <FaArrowRight className="lesson-arrow" />
              </a>
            ))}
          </div>

          <div className="section-header">
            <h2>Jump Back In</h2>
          </div>
          <div className="activity-list">
            {sessions.length === 0 && (
              <p className="no-activity">
                No activity yet. Try Competitive Mode!
              </p>
            )}
            {sessions.map((s: any, i: number) => (
              <div key={i} className="activity-item">
                <div className="activity-info">
                  <FaTrophy className="activity-icon" />
                  <div>
                    <p className="activity-label">
                      Programming I —{" "}
                      {s.mode === "midterms" ? "Midterms Exam" : "Finals Exam"}
                    </p>
                    <p className="activity-time">
                      {s.score}/{s.total} correct &middot; +{s.xpEarned} XP
                    </p>
                  </div>
                </div>
                <span className="activity-score">
                  {Math.round((s.score / s.total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
