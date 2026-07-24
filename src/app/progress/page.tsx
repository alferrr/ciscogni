"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Header from "@/components/Header/Header";
import "./progress.css";
import {
  FaChartLine,
  FaCircleCheck,
  FaTrophy,
  FaBrain,
  FaStar,
} from "react-icons/fa6";
import ProgressSkeleton from "@/components/Skeleton/ProgressSkeleton";
import { CLASSES } from "@/config/classes";

const topicLabels: Record<string, string> = Object.fromEntries(
  CLASSES.flatMap((c) => c.topics.map((t) => [t.id, t.label])),
);

const typeLabels: Record<string, string> = {
  output_prediction: "Output Prediction",
  bug_detection: "Bug Detection",
  logic_tracing: "Logic Tracing",
  concept: "Concept",
};

const Progress = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const fetchProgress = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/progress");
      setData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    fetchProgress();
  }, [fetchProgress]);

  useEffect(() => {
    const handleFocus = () => fetchProgress();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchProgress]);

  if (loading)
    return (
      <>
        <Header />
        <ProgressSkeleton />
      </>
    );

  return (
    <>
      <Header />
      <div className="progress-page">
        <div className="container">
          <div className="progress-header">
            <FaChartLine className="progress-icon" />
            <div>
              <h1>Your Progress</h1>
              <p>Track your performance across all topics.</p>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <FaStar className="stat-icon yellow" />
              <p className="stat-value">{user?.xp ?? 0}</p>
              <p className="stat-label">Total XP</p>
            </div>
            <div className="stat-card">
              <FaCircleCheck className="stat-icon green" />
              <p className="stat-value">{data?.totalAnswered ?? 0}</p>
              <p className="stat-label">Answered</p>
            </div>
            <div className="stat-card">
              <FaBrain className="stat-icon blue" />
              <p className="stat-value">{data?.accuracy ?? 0}%</p>
              <p className="stat-label">Accuracy</p>
            </div>
            <div className="stat-card">
              <FaTrophy className="stat-icon orange" />
              <p className="stat-value">{data?.sessions?.length ?? 0}</p>
              <p className="stat-label">Exams Taken</p>
            </div>
          </div>

          <div className="section-header">
            <h2>Accuracy by Topic</h2>
          </div>
          <div className="topic-progress-list">
            {data?.topicStats?.length === 0 && (
              <p className="no-data">No data yet. Start practicing!</p>
            )}
            {data?.topicStats?.map((t: any) => (
              <div key={t.topic} className="topic-progress-item">
                <div className="topic-progress-info">
                  <p className="topic-progress-label">
                    {topicLabels[t.topic] ?? t.topic}
                  </p>
                  <p className="topic-progress-meta">
                    {t.correct}/{t.total} correct
                  </p>
                </div>
                <div className="topic-progress-bar-wrap">
                  <div className="topic-progress-bar">
                    <div
                      className="topic-progress-fill"
                      style={{
                        width: `${t.accuracy}%`,
                        background:
                          t.accuracy >= 80
                            ? "#22c55e"
                            : t.accuracy >= 50
                              ? "#f97316"
                              : "#ef4444",
                      }}
                    />
                  </div>
                  <span className="topic-progress-pct">{t.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="section-header">
            <h2>Accuracy by Question Type</h2>
          </div>
          <div className="type-grid">
            {data?.typeStats?.map((t: any) => (
              <div key={t.type} className="type-card">
                <p className="type-label">{typeLabels[t.type] ?? t.type}</p>
                <p className="type-value">{t.accuracy}%</p>
                <p className="type-meta">
                  {t.correct}/{t.total} correct
                </p>
                <div className="type-bar">
                  <div
                    className="type-fill"
                    style={{
                      width: `${t.accuracy}%`,
                      background:
                        t.accuracy >= 80
                          ? "#22c55e"
                          : t.accuracy >= 50
                            ? "#f97316"
                            : "#ef4444",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="section-header">
            <h2>Recent Exams</h2>
          </div>
          <div className="sessions-list">
            {data?.sessions?.length === 0 && (
              <p className="no-data">
                No exams taken yet. Try Competitive Mode!
              </p>
            )}
            {data?.sessions?.map((s: any, i: number) => (
              <div key={i} className="session-item">
                <div className="session-info">
                  <FaTrophy className={`session-icon ${s.mode}`} />
                  <div>
                    <p className="session-label">
                      {s.mode === "midterms" ? "Midterms Exam" : "Finals Exam"}
                    </p>
                    <p className="session-meta">
                      {s.score}/{s.total} correct &middot; +{s.xpEarned} XP
                    </p>
                  </div>
                </div>
                <span
                  className="session-pct"
                  style={{
                    color:
                      Math.round((s.score / s.total) * 100) >= 80
                        ? "#22c55e"
                        : Math.round((s.score / s.total) * 100) >= 50
                          ? "#f97316"
                          : "#ef4444",
                  }}
                >
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

export default Progress;
