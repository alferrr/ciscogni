"use client";
import Header from "@/components/Header/Header";
import { CLASSES, iconMap } from "@/config/classes";
import { FaArrowRight, FaArrowLeft, FaCode } from "react-icons/fa6";
import { useRouter, useParams } from "next/navigation";
import "../practice.css";

const PracticeClassPage = () => {
  const router = useRouter();
  const params = useParams();
  const classId = params.class as string;

  const cls = CLASSES.find((c) => c.id === classId);

  if (!cls)
    return (
      <>
        <Header />
        <div className="practice">
          <div className="container">
            <p className="no-data">Class not found.</p>
          </div>
        </div>
      </>
    );

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

  return (
    <>
      <Header />
      <div className="practice">
        <div className="container">
          <div className="practice-header">
            <button
              className="back-btn"
              onClick={() => router.push("/practice")}
            >
              <FaArrowLeft /> Back
            </button>
            <h1>{cls.label}</h1>
            <p>Choose a topic to start training.</p>
          </div>
          <div className="topic-grid">
            {cls.topics.map((t) => {
              const Icon = iconMap[t.icon];
              return (
                <button
                  key={t.id}
                  className="topic-card"
                  style={{ borderColor: t.color }}
                  onClick={() => router.push(`/practice/${classId}/${t.id}`)}
                >
                  <span className="topic-icon" style={{ color: t.color }}>
                    {Icon && <Icon />}
                  </span>
                  <span className="topic-label">{t.label}</span>
                  <FaArrowRight
                    className="topic-arrow"
                    style={{ color: t.color }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default PracticeClassPage;
