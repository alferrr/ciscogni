"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaCode, FaFire, FaTrophy, FaBolt } from "react-icons/fa6";
import { useToast } from "@/context/ToastContext";
import "./onboarding.css";
import OnboardingSkeleton from "@/components/Skeleton/OnboardingSkeleton";
import { COURSES } from "@/config/courses";

const highlights = [
  {
    icon: <FaCode />,
    title: "Practice",
    desc: "Drill topics at your own pace.",
  },
  {
    icon: <FaFire />,
    title: "Daily Challenge",
    desc: "5 questions a day to build your streak.",
  },
  {
    icon: <FaBolt />,
    title: "Competitive",
    desc: "Timed rounds against the clock for bonus XP.",
  },
  {
    icon: <FaTrophy />,
    title: "Leaderboard",
    desc: "See how you rank against your classmates.",
  },
];

const Onboarding = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState<"year" | "welcome">("year");
  const [user, setUser] = useState<any>(null);
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/user/me");
        setUser(data);
        setCourse(data.course ?? "");
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await axios.put("/api/user/update", {
        name: user.name,
        course,
        year,
      });
      setStep("welcome");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Something went wrong.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <OnboardingSkeleton />;

  return (
    <div className="onboarding">
      <div className="onboarding-card">
        {step === "year" && (
          <>
            <div className="onboarding-header">
              <h1>Welcome to Ciscogni!</h1>
              <p>Let&apos;s get your profile set up before you start.</p>
            </div>

            <form onSubmit={handleSubmit} className="onboarding-form">
              <div className="field">
                <label>What course are you taking?</label>
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
                <label>What year are you in?</label>
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

              <button
                type="submit"
                className="onboarding-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Continue"}
              </button>
            </form>
          </>
        )}

        {step === "welcome" && (
          <>
            <div className="onboarding-header">
              <h1>You&apos;re all set!</h1>
              <p>Here&apos;s what you can do next.</p>
            </div>

            <div className="welcome-list">
              {highlights.map((h) => (
                <div key={h.title} className="welcome-item">
                  <span className="welcome-icon">{h.icon}</span>
                  <div className="welcome-text">
                    <strong>{h.title}</strong>
                    <span>{h.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="onboarding-btn"
              onClick={() => router.push("/dashboard")}
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
