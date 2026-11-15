"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Area,
  Bar,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import {
  FaUsers,
  FaCircleQuestion,
  FaBook,
  FaFire,
  FaClipboardCheck,
  FaChevronRight,
  FaClockRotateLeft,
} from "react-icons/fa6";
import { CLASSES } from "@/config/classes";
import AdminDashboardSkeleton from "@/components/Skeleton/AdminDashboardSkeleton";
import "./dashboard.css";

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
    quizzes: number;
  };
  daily: { signups: number[]; questions: number[]; quizzes: number[] };
  typeBreakdown: { type: string; count: number }[];
  traffic: TrafficPoint[];
}

interface LeaderboardEntry {
  id: number;
  name: string;
  course: string;
  streak: number;
  xp: number;
}

const TYPE_LABELS: Record<string, string> = {
  output_prediction: "Output prediction",
  bug_detection: "Bug detection",
  logic_tracing: "Logic tracing",
  concept: "Concept",
};

const nf = (n: number | undefined) => (n ?? 0).toLocaleString("en-US");

/* ---------- stat card with a 7-day bar chart ---------- */

const StatCard = ({
  label,
  value,
  unit,
  icon,
  tone,
  series,
}: {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  tone: "blue" | "yellow" | "coral";
  series: number[];
}) => {
  const max = Math.max(1, ...series);
  const week = series.reduce((a, b) => a + b, 0);
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-card-text">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-value">
          <span className="stat-card-icon">{icon}</span>
          {nf(value)}
        </span>
        <span className="stat-card-sub">
          {week > 0 ? `+${nf(week)} ${unit} this week` : `No new ${unit} this week`}
        </span>
      </div>
      <div
        className="mini-bars"
        role="img"
        aria-label={`${label}, last 7 days: ${series.join(", ")}`}
      >
        {series.map((n, i) => (
          <span
            key={i}
            className={i === series.length - 1 ? "hot" : ""}
            style={{ height: `${Math.max(10, (n / max) * 100)}%` }}
            title={`${n}`}
          />
        ))}
      </div>
    </div>
  );
};

/* ---------- traffic chart ---------- */

const TrafficTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: TrafficPoint }[];
}) => {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="traffic-tooltip">
      <strong>
        {p.views} view{p.views === 1 ? "" : "s"}
      </strong>
      <span>
        {p.users} logged-in visitor{p.users === 1 ? "" : "s"}
      </span>
    </div>
  );
};

const TrafficChart = ({ traffic }: { traffic: TrafficPoint[] }) => {
  if (!traffic.some((p) => p.views > 0))
    return <div className="dash-empty">No traffic recorded yet.</div>;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart
        data={traffic}
        margin={{ top: 12, right: 8, left: 8, bottom: 0 }}
      >
        <defs>
          <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--blue)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--blue)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 13, fill: "var(--muted)" }}
          axisLine={false}
          tickLine={false}
          tickMargin={12}
        />
        {/* Invisible bars only draw the pill-shaped column behind each day. */}
        <Bar
          dataKey="views"
          fill="transparent"
          barSize={44}
          background={{ fill: "var(--secondary)", radius: 22 }}
          isAnimationActive={false}
        />
        <Tooltip
          content={<TrafficTooltip />}
          cursor={{ fill: "rgba(23, 82, 240, 0.10)", radius: 22 }}
        />
        <Area
          type="monotone"
          dataKey="views"
          stroke="var(--blue)"
          strokeWidth={2.5}
          fill="url(#trafficFill)"
          activeDot={{ r: 5, stroke: "var(--bg)", strokeWidth: 2 }}
        />
        <Area
          type="monotone"
          dataKey="users"
          stroke="#eab308"
          strokeWidth={2}
          strokeDasharray="5 5"
          fill="none"
          activeDot={{ r: 4, stroke: "var(--bg)", strokeWidth: 2 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

/* ---------- overlapping-bubble breakdown ---------- */

// Fixed slots so the circles overlap the way the layout intends:
// biggest centre-left, the rest around it.
const BUBBLE_SLOTS = [
  { cx: 125, cy: 118 },
  { cx: 58, cy: 46 },
  { cx: 222, cy: 98 },
  { cx: 200, cy: 190 },
];
const BUBBLE_TONES = ["#1752f0", "#eab308", "#f87171", "#7aa2ff"];
const BUBBLE_TEXT = ["#fff", "#3b2f00", "#4a0f0f", "#0b1f55"];

const Bubbles = ({
  items,
}: {
  items: { type: string; count: number }[];
}) => {
  const total = items.reduce((a, b) => a + b.count, 0);
  if (!total) return <div className="dash-empty">No questions yet.</div>;
  const sorted = [...items].sort((a, b) => b.count - a.count).slice(0, 4);

  return (
    <>
      <svg
        viewBox="0 0 290 250"
        className="bubbles"
        role="img"
        aria-label={sorted
          .map((t) => `${TYPE_LABELS[t.type] ?? t.type} ${t.count}`)
          .join(", ")}
      >
        {sorted.map((t, i) => {
          const share = t.count / total;
          const r = 26 + Math.sqrt(share) * (i === 0 ? 72 : 60);
          const { cx, cy } = BUBBLE_SLOTS[i];
          return (
            <g key={t.type}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={BUBBLE_TONES[i]}
                stroke="var(--bg)"
                strokeWidth={3}
              />
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fill={BUBBLE_TEXT[i]}
                fontWeight={700}
                fontSize={i === 0 ? 26 : 15}
              >
                {Math.round(share * 100)}%
              </text>
            </g>
          );
        })}
      </svg>
      <ul className="bubble-legend">
        {sorted.map((t, i) => (
          <li key={t.type}>
            <span className="dot" style={{ background: BUBBLE_TONES[i] }} />
            {TYPE_LABELS[t.type] ?? t.type}
            <strong>{nf(t.count)}</strong>
          </li>
        ))}
      </ul>
    </>
  );
};

/* ---------- page ---------- */

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      axios.get("/api/admin/stats").then(({ data }) => setStats(data)),
      axios
        .get("/api/leaderboard")
        .then(({ data }) => setLeaderboard(data.top.slice(0, 5))),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminDashboardSkeleton />;

  const totals = stats?.totals;
  const daily = stats?.daily;
  const weekViews = stats?.traffic.reduce((a, p) => a + p.views, 0) ?? 0;
  const weekVisitors = stats?.traffic.reduce((a, p) => a + p.users, 0) ?? 0;
  const availableClasses = CLASSES.filter((c) => c.available).length;

  const shortcuts = [
    {
      href: "/admin/questions",
      label: "Questions",
      meta: `${nf(totals?.questions)} in the bank`,
      icon: <FaCircleQuestion />,
    },
    {
      href: "/admin/users",
      label: "Users",
      meta: `${nf(totals?.users)} accounts`,
      icon: <FaUsers />,
    },
    {
      href: "/admin/classes",
      label: "Classes & topics",
      meta: `${availableClasses} available`,
      icon: <FaBook />,
    },
    {
      href: "/admin/activity",
      label: "Activity logs",
      meta: "Logins, quizzes, changes",
      icon: <FaClockRotateLeft />,
    },
  ];

  return (
    <div className="dash">
      <div className="dash-head">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="dash-subtitle">Overview of your Ciscogni deployment.</p>
        </div>
        <span className="dash-range">Showing the last 7 days</span>
      </div>

      <div className="dash-top">
        <div className="stat-stack">
          <StatCard
            label="Students"
            value={totals?.students ?? 0}
            unit="sign-ups"
            icon={<FaUsers />}
            tone="blue"
            series={daily?.signups ?? Array(7).fill(0)}
          />
          <StatCard
            label="Questions"
            value={totals?.questions ?? 0}
            unit="questions"
            icon={<FaCircleQuestion />}
            tone="yellow"
            series={daily?.questions ?? Array(7).fill(0)}
          />
          <StatCard
            label="Quizzes finished"
            value={totals?.quizzes ?? 0}
            unit="quizzes"
            icon={<FaClipboardCheck />}
            tone="coral"
            series={daily?.quizzes ?? Array(7).fill(0)}
          />
        </div>

        <section className="dash-card traffic-card">
          <div className="dash-card-head">
            <h2>Website traffic</h2>
            <div className="chart-legend">
              <span>
                <span className="dot" style={{ background: "var(--blue)" }} />
                Page views
              </span>
              <span>
                <span className="dot" style={{ background: "#eab308" }} />
                Logged-in visitors
              </span>
            </div>
          </div>
          <p className="traffic-total">
            {nf(weekViews)}
            <span>
              page views · {nf(weekVisitors)} logged-in visits
            </span>
          </p>
          {stats ? (
            <TrafficChart traffic={stats.traffic} />
          ) : (
            <div className="dash-empty">Couldn&apos;t load traffic data.</div>
          )}
        </section>
      </div>

      <div className="dash-lower">
        <section className="dash-card">
          <div className="dash-card-head">
            <h2>Jump to</h2>
          </div>
          <ul className="shortcut-list">
            {shortcuts.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="shortcut">
                  <span className="shortcut-icon">{s.icon}</span>
                  <span className="shortcut-text">
                    <strong>{s.label}</strong>
                    <span>{s.meta}</span>
                  </span>
                  <FaChevronRight className="shortcut-chevron" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="dash-card">
          <div className="dash-card-head">
            <h2>Top students</h2>
            <span className="dash-card-note">Ranked by XP</span>
          </div>
          {leaderboard.length ? (
            <ul className="leader-list">
              {leaderboard.map((u, i) => (
                <li key={u.id} className="leader-row">
                  <span className="leader-rank">{i + 1}</span>
                  <span className="leader-avatar" aria-hidden>
                    {u.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                  <span className="leader-text">
                    <strong>{u.name}</strong>
                    <span>
                      {u.course || "—"} · <FaFire /> {u.streak}
                    </span>
                  </span>
                  <span className="leader-xp">{nf(u.xp)} XP</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="dash-empty">No students yet.</div>
          )}
        </section>

        <section className="dash-card bubble-card">
          <div className="dash-card-head">
            <h2>Question bank</h2>
            <span className="dash-card-note">By type</span>
          </div>
          <Bubbles items={stats?.typeBreakdown ?? []} />
          <div className="role-totals">
            <div>
              <strong>{nf(totals?.students)}</strong>
              <span>Students</span>
            </div>
            <div>
              <strong>{nf(totals?.teachers)}</strong>
              <span>Teachers</span>
            </div>
            <div>
              <strong>{nf(totals?.admins)}</strong>
              <span>Admins</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
