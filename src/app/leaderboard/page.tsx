"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Header from "@/components/Header/Header";
import "./leaderboard.css";
import { FaTrophy, FaMedal, FaStar, FaFire, FaGraduationCap } from "react-icons/fa6";
import LeaderboardSkeleton from "@/components/Skeleton/LeaderboardSkeleton";
import { useRefetchOnShow } from "@/hooks/useRefetchOnShow";

type Tab = "xp" | "streak" | "year";

interface LeaderboardEntry {
  id: number;
  name: string;
  course: string;
  year: string;
  xp: number;
  streak: number;
}

const TABS: { id: Tab; label: string; subtitle: string }[] = [
  { id: "xp", label: "XP", subtitle: "Ranked by total XP earned." },
  { id: "streak", label: "Streak", subtitle: "Ranked by current daily streak." },
  { id: "year", label: "My Year", subtitle: "Ranked by XP within your year." },
];

const Leaderboard = () => {
  const [tab, setTab] = useState<Tab>("xp");
  const [top, setTop] = useState<LeaderboardEntry[]>([]);
  const [me, setMe] = useState<(LeaderboardEntry & { rank: number }) | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async (activeTab: Tab) => {
    try {
      const { data } = await axios.get(`/api/leaderboard?tab=${activeTab}`);
      setTop(data.top);
      setMe(data.me);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(tab);
  }, [tab, fetchLeaderboard]);

  useRefetchOnShow(useCallback(() => fetchLeaderboard(tab), [tab, fetchLeaderboard]));

  const getRankIcon = (index: number) => {
    if (index === 0) return <FaTrophy className="rank-icon gold" />;
    if (index === 1) return <FaMedal className="rank-icon silver" />;
    if (index === 2) return <FaMedal className="rank-icon bronze" />;
    return <span className="rank-number">#{index + 1}</span>;
  };

  const activeTab = TABS.find((t) => t.id === tab)!;
  const metricIcon = tab === "streak" ? <FaFire /> : <FaStar />;
  const metricValue = (entry: LeaderboardEntry) =>
    tab === "streak" ? `${entry.streak} day${entry.streak === 1 ? "" : "s"}` : `${entry.xp} XP`;

  if (loading && top.length === 0)
    return (
      <>
        <Header />
        <LeaderboardSkeleton />
      </>
    );

  return (
    <>
      <Header />
      <div className="leaderboard">
        <div className="container">
          <div className="lb-header">
            <FaTrophy className="lb-trophy" />
            <h1>Leaderboard</h1>
            <p>{activeTab.subtitle}</p>
          </div>

          <div className="lb-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`lb-tab ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.id === "year" && <FaGraduationCap />}
                {t.label}
              </button>
            ))}
          </div>

          {me && (
            <div className="your-rank">
              <p className="your-rank-label">Your Rank</p>
              <div className="your-rank-card">
                <span className="your-rank-pos">#{me.rank}</span>
                <div className="lb-avatar you">
                  {me.name.charAt(0).toUpperCase()}
                </div>
                <div className="your-rank-info">
                  <p className="your-rank-name">{me.name}</p>
                  <p className="your-rank-meta">
                    {me.course} — Year {me.year}
                  </p>
                </div>
                <div className="your-rank-stats">
                  <span className="xp-pill">
                    <FaStar /> {me.xp} XP
                  </span>
                  <span className="streak-pill">
                    <FaFire /> {me.streak}
                  </span>
                </div>
              </div>
            </div>
          )}

          {top.length === 0 && (
            <p className="no-data">No players yet. Be the first!</p>
          )}

          <div className="lb-list">
            {top.map((u, i) => (
              <div
                key={u.id}
                className={`lb-item ${u.id === me?.id ? "is-you" : ""} ${i < 3 ? `top-${i + 1}` : ""}`}
              >
                <div className="lb-rank">{getRankIcon(i)}</div>
                <div
                  className={`lb-avatar ${i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : ""}`}
                >
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="lb-info">
                  <p className="lb-name">
                    {u.name}
                    {u.id === me?.id && <span className="you-badge">You</span>}
                  </p>
                  <p className="lb-meta">
                    {u.course} — Year {u.year}
                  </p>
                </div>
                <div className="lb-xp">
                  {metricIcon}
                  <span>{metricValue(u)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
