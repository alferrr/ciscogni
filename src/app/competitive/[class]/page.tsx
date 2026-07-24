"use client";
import Header from "@/components/Header/Header";
import { CLASSES } from "@/config/classes";
import {
  FaArrowRight,
  FaArrowLeft,
  FaTrophy,
  FaClock,
  FaBolt,
} from "react-icons/fa6";
import { useRouter, useParams } from "next/navigation";
import { notFound } from "next/navigation";
import "../competitive.css";

const CompetitiveClassPage = () => {
  const router = useRouter();
  const params = useParams();
  const classId = params?.class as string;

  const cls = CLASSES.find((c) => c.id === classId);

  if (!classId) return null;

  if (!cls) notFound();

  if (!cls.available)
    return (
      <>
        <Header />
        <div className="competitive">
          <div className="container">
            <p className="loading">{cls.label} is coming soon.</p>
          </div>
        </div>
      </>
    );

  return (
    <>
      <Header />
      <div className="competitive">
        <div className="container">
          <div className="comp-header">
            <button
              className="back-btn"
              onClick={() => router.push("/competitive")}
            >
              <FaArrowLeft /> Back
            </button>
            <FaTrophy className="comp-trophy" />
            <h1>{cls.label}</h1>
            <p>
              No hints. No feedback. Just you and the clock. Your score
              determines your rank.
            </p>
          </div>
          <div className="mode-grid">
            {cls.modes.map((m) => (
              <button
                key={m.id}
                className="mode-card"
                style={{ borderColor: m.color }}
                onClick={() => router.push(`/competitive/${classId}/${m.id}`)}
              >
                <span className="mode-label" style={{ color: m.color }}>
                  {m.label}
                </span>
                <p className="mode-desc">{m.description}</p>
                <div className="mode-meta">
                  <span>
                    <FaClock /> 15s per question
                  </span>
                  <span>
                    <FaBolt /> XP based on speed
                  </span>
                </div>
                <FaArrowRight
                  className="mode-arrow"
                  style={{ color: m.color }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompetitiveClassPage;
