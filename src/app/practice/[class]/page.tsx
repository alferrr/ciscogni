"use client";
import Header from "@/components/Header/Header";
import { CLASSES, iconMap } from "@/config/classes";
import {
  FaArrowRight,
  FaArrowLeft,
  FaCode,
  FaCheck,
  FaRotateLeft,
} from "react-icons/fa6";
import { useRouter, useParams } from "next/navigation";
import { notFound } from "next/navigation";
import "../practice.css";
import { useState } from "react";

const PracticeClassPage = () => {
  const router = useRouter();
  const params = useParams();
  const classId = params?.class as string;

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [step, setStep] = useState<"topics" | "count">("topics");
  const [starting, setStarting] = useState(false);

  if (!classId) return null;

  const cls = CLASSES.find((c) => c.id === classId);

  if (!cls) notFound();

  if (!cls.available)
    return (
      <>
        <Header />
        <div className="practice">
          <div className="container">
            <div className="coming-soon-box">
              <FaCode className="coming-soon-icon" />
              <h2>Coming Soon</h2>
              <p>{cls.label} content is being prepared. Check back later!</p>
              <button
                className="back-btn"
                onClick={() => router.push("/practice")}
              >
                <FaArrowLeft /> Back to Classes
              </button>
            </div>
          </div>
        </div>
      </>
    );

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const selectAll = () => setSelectedTopics(cls.topics.map((t) => t.id));
  const clearAll = () => setSelectedTopics([]);

  const handleStart = () => {
    setStarting(true);
    const topics = selectedTopics.join(",");
    router.push(
      `/practice/${classId}/session?topics=${topics}&count=${questionCount}`,
    );
  };

  return (
    <>
      <Header />
      <div className="practice">
        <div className="container">
          <div className="practice-header">
            <button
              className="back-btn"
              onClick={() =>
                step === "count" ? setStep("topics") : router.push("/practice")
              }
            >
              <FaArrowLeft /> Back
            </button>
            <h1>{cls.label}</h1>
            <p>
              {step === "topics"
                ? "Select topics you want to practice."
                : "Choose how many questions you want."}
            </p>
          </div>

          {step === "topics" && (
            <>
              <button
                className="mistakes-cta"
                onClick={() =>
                  router.push(`/practice/${classId}/session?mistakes=1`)
                }
              >
                <span className="mistakes-cta-icon">
                  <FaRotateLeft />
                </span>
                <span className="mistakes-cta-text">
                  <strong>Practice My Mistakes</strong>
                  <span>Review the questions you&apos;ve gotten wrong.</span>
                </span>
                <FaArrowRight className="mistakes-cta-arrow" />
              </button>

              <div className="topic-select-actions">
                <button className="select-all-btn" onClick={selectAll}>
                  Select All
                </button>
                <button className="clear-btn" onClick={clearAll}>
                  Clear
                </button>
                <span className="selected-count">
                  {selectedTopics.length} selected
                </span>
              </div>

              <div className="topic-grid">
                {cls.topics.map((t) => {
                  const Icon = iconMap[t.icon];
                  const isSelected = selectedTopics.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      className={`topic-card selectable ${isSelected ? "selected" : ""}`}
                      style={{
                        borderColor: isSelected ? t.color : "var(--border)",
                        background: isSelected
                          ? `${t.color}15`
                          : "var(--secondary)",
                      }}
                      onClick={() => toggleTopic(t.id)}
                    >
                      <span className="topic-icon" style={{ color: t.color }}>
                        {Icon && <Icon />}
                      </span>
                      <span
                        className="topic-label"
                        style={{ color: isSelected ? t.color : "var(--text)" }}
                      >
                        {t.label}
                      </span>
                      <span className="topic-check" style={{ color: t.color }}>
                        {isSelected && <FaCheck />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="topic-next-row">
                <button
                  className="next-btn"
                  disabled={selectedTopics.length === 0}
                  onClick={() => setStep("count")}
                >
                  Next <FaArrowRight />
                </button>
              </div>
            </>
          )}

          {step === "count" && (
            <div className="count-selector">
              <div className="count-display">
                <span className="count-number">{questionCount}</span>
                <span className="count-label">questions</span>
              </div>

              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="count-slider"
              />

              <div className="count-marks">
                {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((n) => (
                  <span
                    key={n}
                    className={`count-mark ${questionCount === n ? "active" : ""}`}
                    onClick={() => setQuestionCount(n)}
                  >
                    {n}
                  </span>
                ))}
              </div>

              <div className="count-summary">
                <p>
                  <strong>{selectedTopics.length}</strong> topic
                  {selectedTopics.length !== 1 ? "s" : ""} selected
                </p>
                <p>
                  <strong>{questionCount}</strong> questions
                </p>
              </div>

              <button className="start-btn" onClick={handleStart}>
                {starting ? "Fetching Questions" : "Start Practice"}
                <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PracticeClassPage;
