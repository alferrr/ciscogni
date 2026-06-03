"use client";
import Header from "@/components/Header/Header";
import { CLASSES } from "@/config/classes";
import { FaArrowRight, FaTrophy } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import "./competitive.css";

const CompetitivePage = () => {
  const router = useRouter();

  return (
    <>
      <Header />
      <div className="competitive">
        <div className="container">
          <div className="comp-header">
            <FaTrophy className="comp-trophy" />
            <h1>Competitive Mode</h1>
            <p>No hints. No feedback. Just you and the clock.</p>
          </div>
          <div className="mode-grid">
            {CLASSES.map((c) => (
              <button
                key={c.id}
                className="mode-card"
                style={{
                  borderColor: c.available ? "#1752f0" : "var(--border)",
                  opacity: c.available ? 1 : 0.6,
                  cursor: c.available ? "pointer" : "not-allowed",
                }}
                onClick={() =>
                  c.available && router.push(`/competitive/${c.id}`)
                }
                disabled={!c.available}
              >
                <span
                  className="mode-label"
                  style={{ color: c.available ? "#1752f0" : "var(--muted)" }}
                >
                  {c.label}
                </span>
                {c.available ? (
                  <p className="mode-desc">Midterms and Finals coverage.</p>
                ) : (
                  <p className="mode-desc">Coming soon.</p>
                )}
                {!c.available && (
                  <span className="coming-soon-badge">Coming Soon</span>
                )}
                <FaArrowRight className="mode-arrow" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompetitivePage;
