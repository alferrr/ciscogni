"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Header from "@/components/Header/Header";
import "./leaderboard.css";
import { FaTrophy, FaMedal, FaStar, FaFire } from "react-icons/fa6";
import LeaderboardSkeleton from "@/components/Skeleton/LeaderboardSkeleton";
import { useRefetchOnShow } from "@/hooks/useRefetchOnShow";

const Leaderboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/leaderboard");
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setCurrentUser(JSON.parse(stored));
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useRefetchOnShow(fetchLeaderboard);

  const getRankIcon = (index: number) => {
    if (index === 0) return <FaTrophy className="rank-icon gold" />;
    if (index === 1) return <FaMedal className="rank-icon silver" />;
    if (index === 2) return <FaMedal className="rank-icon bronze" />;
    return <span className="rank-number">#{index + 1}</span>;
  };

  const currentUserRank = users.findIndex((u) => u.id === currentUser?.id);

  if (loading)
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
            <p>Ranked by XP earned in Competitive Mode.</p>
          </div>

          {currentUser && currentUserRank !== -1 && (
            <div className="your-rank">
              <p className="your-rank-label">Your Rank</p>
              <div className="your-rank-card">
                <span className="your-rank-pos">#{currentUserRank + 1}</span>
                <div className="lb-avatar you">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="your-rank-info">
                  <p className="your-rank-name">{currentUser.name}</p>
                  <p className="your-rank-meta">
                    {currentUser.course} — Year {currentUser.year}
                  </p>
                </div>
                <div className="your-rank-stats">
                  <span className="xp-pill">
                    <FaStar /> {currentUser.xp} XP
                  </span>
                  <span className="streak-pill">
                    <FaFire /> {currentUser.streak}
                  </span>
                </div>
              </div>
            </div>
          )}

          {users.length === 0 && (
            <p className="no-data">No players yet. Be the first!</p>
          )}

          <div className="lb-list">
            {users.map((u, i) => (
              <div
                key={u.id}
                className={`lb-item ${u.id === currentUser?.id ? "is-you" : ""} ${i < 3 ? `top-${i + 1}` : ""}`}
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
                    {u.id === currentUser?.id && (
                      <span className="you-badge">You</span>
                    )}
                  </p>
                  <p className="lb-meta">
                    {u.course} — Year {u.year}
                  </p>
                </div>
                <div className="lb-xp">
                  <FaStar className="xp-star" />
                  <span>{u.xp} XP</span>
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
