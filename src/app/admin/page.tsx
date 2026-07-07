"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  FaUsers,
  FaCircleQuestion,
  FaBook,
  FaEye,
  FaBug,
  FaRoute,
  FaBrain,
  FaFire,
} from "react-icons/fa6";
import { CLASSES } from "@/config/classes";

interface DailyPoint {
  label: string;
  attempts: number;
  accuracy: number;
}

interface Stats {
  totals: {
    users: number;
    students: number;
    teachers: number;
    admins: number;
    questions: number;
  };
  typeBreakdown: { type: string; count: number }[];
  daily: DailyPoint[];
}

interface LeaderboardEntry {
  id: number;
  name: string;
  course: string;
  year: string;
  xp: number;
  streak: number;
}

const TYPE_META: Record<string, { label: string; icon: React.ReactNode }> = {
  output_prediction: { label: "Output Prediction", icon: <FaEye /> },
  bug_detection: { label: "Bug Detection", icon: <FaBug /> },
  logic_tracing: { label: "Logic Tracing", icon: <FaRoute /> },
  concept: { label: "Concept", icon: <FaBrain /> },
};

const PerformanceChart = ({ daily }: { daily: DailyPoint[] }) => {
  const chartW = 600;
  const chartH = 170;
  const top = 10;
  const bottom = 40;
  const viewH = top + chartH + bottom;

  const maxAttempts = Math.max(1, ...daily.map((d) => d.attempts));
  const slot = chartW / daily.length;
  const barW = slot * 0.36;

  const points = daily.map((d, i) => {
    const cx = i * slot + slot / 2;
    const barH = (d.attempts / maxAttempts) * chartH;
    const barY = top + chartH - barH;
    const lineY = top + chartH - (d.accuracy / 100) * chartH;
    return { ...d, cx, barY, barH, lineY };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.cx} ${p.lineY}`)
    .join(" ");

  const peak = points.reduce(
    (max, p) => (p.attempts > max.attempts ? p : max),
    points[0],
  );

  const hasData = points.some((p) => p.attempts > 0);

  return (
    <div className="perf-chart-wrap">
      <svg
        className="perf-chart"
        viewBox={`0 0 ${chartW} ${viewH}`}
        preserveAspectRatio="none"
        style={{ height: 240 }}
      >
        {points.map((p) => (
          <rect
            key={p.label}
            x={p.cx - barW / 2}
            y={p.barY}
            width={barW}
            height={p.barH}
            rx={6}
            fill="var(--blue)"
            opacity={0.85}
          />
        ))}

        {hasData && (
          <path
            d={linePath}
            fill="none"
            stroke="#22c55e"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {points.map((p) => (
          <circle
            key={`dot-${p.label}`}
            cx={p.cx}
            cy={p.lineY}
            r={4}
            fill="#22c55e"
          />
        ))}

        {points.map((p) => (
          <text
            key={`label-${p.label}`}
            x={p.cx}
            y={top + chartH + 24}
            textAnchor="middle"
            fontSize={12}
            fill="var(--muted)"
          >
            {p.label}
          </text>
        ))}
      </svg>

      {!hasData && <div className="perf-empty">No attempts logged yet.</div>}

      {hasData && peak.attempts > 0 && (
        <div
          className="perf-tooltip"
          style={{
            left: `${(peak.cx / chartW) * 100}%`,
            top: `${(peak.barY / viewH) * 100}%`,
          }}
        >
          {peak.attempts} attempt{peak.attempts === 1 ? "" : "s"}
          <div className="perf-tooltip-sub">{peak.accuracy}% accuracy</div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    axios
      .get("/api/admin/stats")
      .then(({ data }) => setStats(data))
      .catch((err) => console.error(err));

    axios
      .get("/api/leaderboard")
      .then(({ data }) => setLeaderboard(data.slice(0, 5)))
      .catch((err) => console.error(err));
  }, []);

  const totals = stats?.totals;
  const maxTypeCount = Math.max(
    1,
    ...(stats?.typeBreakdown.map((t) => t.count) ?? [1]),
  );
  const availableClasses = CLASSES.filter((c) => c.available).length;

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="dash-subtitle">Overview of your Ciscogni deployment.</p>

      <div className="dash-grid">
        <div className="dash-actions">
          <Link href="/admin/questions" className="action-card purple">
            <h3>Manage Questions</h3>
            <p>Add, edit, and organize the question bank.</p>
            <div className="action-card-footer">
              <span className="action-card-count">
                {totals?.questions ?? "—"} questions
              </span>
              <span className="action-card-icon">
                <FaCircleQuestion />
              </span>
            </div>
          </Link>

          <Link href="/admin/users" className="action-card blue">
            <h3>Manage Users</h3>
            <p>View and moderate registered accounts.</p>
            <div className="action-card-footer">
              <span className="action-card-count">
                {totals?.users ?? "—"} users
              </span>
              <span className="action-card-icon">
                <FaUsers />
              </span>
            </div>
          </Link>

          <Link href="/admin/classes" className="action-card green">
            <h3>Classes & Topics</h3>
            <p>Review coverage across every class.</p>
            <div className="action-card-footer">
              <span className="action-card-count">
                {availableClasses} available
              </span>
              <span className="action-card-icon">
                <FaBook />
              </span>
            </div>
          </Link>
        </div>

        <div className="dash-main">
          <div className="dash-card">
            <div className="dash-card-header">
              <div>
                <h2>Performance Chart</h2>
                <p>Attempts and accuracy over the last 7 days.</p>
              </div>
              <div className="chart-legend">
                <span>
                  <span className="dot" style={{ background: "var(--blue)" }} />
                  Attempts
                </span>
                <span>
                  <span className="dot" style={{ background: "#22c55e" }} />
                  Accuracy
                </span>
              </div>
            </div>
            {stats ? (
              <PerformanceChart daily={stats.daily} />
            ) : (
              <div className="perf-empty">Loading...</div>
            )}
          </div>

          <div className="bottom-grid">
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <h2>Question Bank</h2>
                  <p>Breakdown by question type.</p>
                </div>
              </div>
              {stats?.typeBreakdown.length ? (
                stats.typeBreakdown.map((t) => {
                  const meta = TYPE_META[t.type] ?? {
                    label: t.type,
                    icon: <FaCircleQuestion />,
                  };
                  const pct = Math.round((t.count / maxTypeCount) * 100);
                  return (
                    <div className="breakdown-row" key={t.type}>
                      <span className="breakdown-icon">{meta.icon}</span>
                      <div className="breakdown-info">
                        <div className="breakdown-label">{meta.label}</div>
                        <div className="progress-track">
                          <div
                            className="progress-track-fill"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <span className="breakdown-count">{t.count}</span>
                    </div>
                  );
                })
              ) : (
                <p className="perf-empty">No questions yet.</p>
              )}
            </div>

            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <h2>Top Students</h2>
                  <p>Ranked by XP.</p>
                </div>
              </div>
              {leaderboard.length ? (
                leaderboard.map((u) => (
                  <div className="leaderboard-row" key={u.id}>
                    <span className="avatar-circle">
                      {u.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>
                    <div className="leaderboard-info">
                      <div className="leaderboard-name">{u.name}</div>
                      <div className="leaderboard-meta">
                        <span>
                          <FaBook /> {u.course || "—"}
                        </span>
                        <span>
                          <FaFire /> {u.streak}
                        </span>
                      </div>
                    </div>
                    <span className="leaderboard-xp">{u.xp} XP</span>
                  </div>
                ))
              ) : (
                <p className="perf-empty">No students yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
