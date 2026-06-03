"use client";
import Header from "@/components/Header/Header";
import { CLASSES } from "@/config/classes";
import { FaArrowRight } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import "./practice.css";

const PracticePage = () => {
  const router = useRouter();

  return (
    <>
      <Header />
      <div className="practice">
        <div className="container">
          <div className="practice-header">
            <h1>Practice Mode</h1>
            <p>Choose a class to start training.</p>
          </div>
          <div className="class-grid">
            {CLASSES.map((c) => (
              <button
                key={c.id}
                className="class-card"
                onClick={() => c.available && router.push(`/practice/${c.id}`)}
                style={{
                  opacity: c.available ? 1 : 0.6,
                  cursor: c.available ? "pointer" : "not-allowed",
                }}
              >
                <span className="class-label">{c.label}</span>
                {!c.available && (
                  <span className="coming-soon">Coming Soon</span>
                )}
                <FaArrowRight className="class-arrow" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PracticePage;
