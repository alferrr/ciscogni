"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Header from "@/components/Header/Header";
import { useRefetchOnShow } from "@/hooks/useRefetchOnShow";
import "./profile.css";
import {
  FaBullseye,
  FaArrowsRotate,
  FaBug,
  FaWandMagicSparkles,
  FaEye,
  FaLocationDot,
  FaFire,
  FaStar,
  FaGem,
  FaCrown,
  FaBook,
  FaBookOpen,
  FaTrophy,
  FaBrain,
  FaLock,
  FaChartLine,
  FaRegUser,
  FaCircleCheck,
} from "react-icons/fa6";
import { GiSwordman } from "react-icons/gi";

import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import ProfileSkeleton from "@/components/Skeleton/ProfileSkeleton";
import { COURSES } from "@/config/courses";
import { CLASSES } from "@/config/classes";

const topicLabels: Record<string, string> = Object.fromEntries(
  CLASSES.flatMap((c) => c.topics.map((t) => [t.id, t.label])),
);

const iconMap: Record<string, React.ReactNode> = {
  FaBullseye: <FaBullseye />,
  FaArrowsRotate: <FaArrowsRotate />,
  FaBug: <FaBug />,
  FaWandMagicSparkles: <FaWandMagicSparkles />,
  FaEye: <FaEye />,
  FaLocationDot: <FaLocationDot />,
  FaFire: <FaFire />,
  FaSword: <GiSwordman />,
  FaStar: <FaStar />,
  FaGem: <FaGem />,
  FaCrown: <FaCrown />,
  FaBook: <FaBook />,
  FaBookOpen: <FaBookOpen />,
  FaTrophy: <FaTrophy />,
  FaBrain: <FaBrain />,
};

const typeLabels: Record<string, string> = {
  output_prediction: "Output Prediction",
  bug_detection: "Bug Detection",
  logic_tracing: "Logic Tracing",
  concept: "Concept",
};

const Profile = () => {
  const router = useRouter();
  const { showToast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "progress" | "info" | "password"
  >("progress");

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [achievements, setAchievements] = useState<any[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);

  const fetchAchievements = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/achievements");
      setAchievements(data.achievements);
      if (data.newlyUnlocked.length > 0) {
        data.newlyUnlocked.forEach((id: string) => {
          const a = data.achievements.find((x: any) => x.id === id);
          if (a) showToast(`🏅 Achievement unlocked: ${a.label}!`, "success");
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [showToast]);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/me");
      setUser(data);
      setName(data.name ?? "");
      setCourse(data.course ?? "");
      setYear(String(data.year ?? ""));
    } catch (err) {
      router.push("/");
    }
  }, [router]);

  const fetchProgress = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/progress");
      setProgressData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.put("/api/user/update", {
        name,
        course,
        year,
      });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      showToast("Profile updated successfully.", "success");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Something went wrong.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }
    setSaving(true);
    try {
      await axios.put("/api/user/update", {
        name,
        course,
        year,
        currentPassword,
        newPassword,
      });
      showToast("Password changed successfully.", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Something went wrong.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchProgress();
    fetchAchievements();
  }, [fetchUser, fetchProgress, fetchAchievements]);

  useRefetchOnShow(
    useCallback(() => {
      fetchUser();
      fetchProgress();
      fetchAchievements();
    }, [fetchUser, fetchProgress, fetchAchievements]),
  );

  if (loading)
    return (
      <>
        <Header />
        <ProfileSkeleton />
      </>
    );

  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="profile-sidebar">
          <div className="sidebar-avatar">{name?.charAt(0).toUpperCase()}</div>
          <h2 className="sidebar-name">{name}</h2>
          <p className="sidebar-email">{user?.email}</p>
          <p className="sidebar-meta">
            {course} — Year {year}
          </p>

          <div className="sidebar-badges">
            <span className="badge xp">
              <FaStar /> {user?.xp} XP
            </span>
            <span className="badge streak">
              <FaFire /> {user?.streak} day streak
            </span>
            <span className="badge rank">
              <FaTrophy /> Rank #{user?.rank}
            </span>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`sidebar-nav-item ${activeSection === "progress" ? "active" : ""}`}
              onClick={() => setActiveSection("progress")}
            >
              <FaChartLine /> Progress
            </button>
            <button
              className={`sidebar-nav-item ${activeSection === "info" ? "active" : ""}`}
              onClick={() => setActiveSection("info")}
            >
              <FaRegUser /> Personal Info
            </button>
            <button
              className={`sidebar-nav-item ${activeSection === "password" ? "active" : ""}`}
              onClick={() => setActiveSection("password")}
            >
              <FaLock /> Change Password
            </button>
          </nav>
        </div>

        <div className="profile-content">
          {activeSection === "progress" && (
            <div className="section-wrapper">
              <div className="section-title">
                <FaChartLine />
                <h2>Your Progress</h2>
              </div>

              <div className="stats-row">
                <div className="stat-card">
                  <FaStar className="stat-icon yellow" />
                  <p className="stat-value">{user?.xp ?? 0}</p>
                  <p className="stat-label">Total XP</p>
                </div>
                <div className="stat-card">
                  <FaCircleCheck className="stat-icon green" />
                  <p className="stat-value">
                    {progressData?.totalAnswered ?? 0}
                  </p>
                  <p className="stat-label">Answered</p>
                </div>
                <div className="stat-card">
                  <FaBrain className="stat-icon blue" />
                  <p className="stat-value">{progressData?.accuracy ?? 0}%</p>
                  <p className="stat-label">Accuracy</p>
                </div>
                <div className="stat-card">
                  <FaTrophy className="stat-icon orange" />
                  <p className="stat-value">
                    {progressData?.sessions?.length ?? 0}
                  </p>
                  <p className="stat-label">Exams Taken</p>
                </div>
              </div>

              <h3 className="sub-title">Accuracy by Topic</h3>
              <div className="topic-progress-list">
                {progressData?.topicStats?.length === 0 && (
                  <p className="no-data">No data yet. Start practicing!</p>
                )}
                {progressData?.topicStats?.map((t: any) => (
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

              <h3 className="sub-title">Accuracy by Question Type</h3>
              <div className="type-grid">
                {progressData?.typeStats?.map((t: any) => (
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

              <h3 className="sub-title">Recent Exams</h3>
              <div className="sessions-list">
                {progressData?.sessions?.length === 0 && (
                  <p className="no-data">
                    No exams taken yet. Try Competitive Mode!
                  </p>
                )}
                {progressData?.sessions?.map((s: any, i: number) => (
                  <div key={i} className="session-item">
                    <div className="session-info">
                      <FaTrophy className={`session-icon ${s.mode}`} />
                      <div>
                        <p className="session-label">
                          {s.mode === "midterms"
                            ? "Midterms Exam"
                            : "Finals Exam"}
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

              <h3 className="sub-title">Achievements</h3>
              <div className="achievements-grid">
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    className={`achievement-card ${a.unlocked ? "unlocked" : "locked"}`}
                  >
                    <span className="achievement-icon">
                      {iconMap[a.icon] ?? <FaStar />}
                    </span>
                    <p className="achievement-label">{a.label}</p>
                    <p className="achievement-desc">{a.description}</p>
                    {!a.unlocked && (
                      <div className="achievement-lock">
                        <FaLock />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "info" && (
            <div className="section-wrapper">
              <div className="section-title">
                <FaRegUser />
                <h2>Personal Info</h2>
              </div>

              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Juan Dela Cruz"
                    required
                  />
                </div>

                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={user?.email ?? ""}
                    disabled
                    className="disabled"
                  />
                  <span className="field-hint">Email cannot be changed.</span>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label>Course</label>
                    <select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      required
                    >
                      <option value="">Select course</option>
                      {COURSES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                    >
                      <option value="">Select year</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {activeSection === "password" && (
            <div className="section-wrapper">
              <div className="section-title">
                <FaLock />
                <h2>Change Password</h2>
              </div>

              <form onSubmit={handlePasswordUpdate} className="profile-form">
                <div className="field">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="*******"
                    required
                  />
                </div>
                <div className="field">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="*******"
                    required
                  />
                </div>
                <div className="field">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="*******"
                    required
                  />
                </div>

                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Saving..." : "Change Password"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
