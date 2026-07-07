"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
import AdminDashboardSkeleton from "@/components/Skeleton/AdminDashboardSkeleton";

interface TrafficPoint {
  label: string;
  views: number;
  users: number;
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
  traffic: TrafficPoint[];
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

const TrafficTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const views = payload.find((p: any) => p.dataKey === "views")?.value ?? 0;
  const users = payload.find((p: any) => p.dataKey === "users")?.value ?? 0;
  return (
    <div className="perf-tooltip">
      {label}: {views} view{views === 1 ? "" : "s"}
      <div className="perf-tooltip-sub">{users} logged-in visitor{users === 1 ? "" : "s"}</div>
    </div>
  );
};

const TrafficChart = ({ traffic }: { traffic: TrafficPoint[] }) => {
  const hasData = traffic.some((p) => p.views > 0);

  if (!hasData) {
    return <div className="perf-empty">No traffic recorded yet.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={traffic} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--blue)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--blue)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: "var(--muted)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12, fill: "var(--muted)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<TrafficTooltip />} />
        <Area
          type="monotone"
          dataKey="views"
          stroke="var(--blue)"
          strokeWidth={2.5}
          fill="url(#viewsGradient)"
        />
        <Area
          type="monotone"
          dataKey="users"
          stroke="#22c55e"
          strokeWidth={2}
          fill="none"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      axios.get("/api/admin/stats").then(({ data }) => setStats(data)),
      axios
        .get("/api/leaderboard")
        .then(({ data }) => setLeaderboard(data.slice(0, 5))),
    ]).finally(() => setLoading(false));
  }, []);

  const totals = stats?.totals;
  const maxTypeCount = Math.max(
    1,
    ...(stats?.typeBreakdown.map((t) => t.count) ?? [1]),
  );
  const availableClasses = CLASSES.filter((c) => c.available).length;

  if (loading) return <AdminDashboardSkeleton />;

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
                <h2>Website Traffic</h2>
                <p>Page views over the last 7 days.</p>
              </div>
              <div className="chart-legend">
                <span>
                  <span className="dot" style={{ background: "var(--blue)" }} />
                  Page Views
                </span>
                <span>
                  <span className="dot" style={{ background: "#22c55e" }} />
                  Logged-in Visitors
                </span>
              </div>
            </div>
            {stats ? (
              <TrafficChart traffic={stats.traffic} />
            ) : (
              <div className="perf-empty">Couldn&apos;t load traffic data.</div>
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
