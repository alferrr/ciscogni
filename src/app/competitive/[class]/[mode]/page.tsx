"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "@/components/Header/Header";
import { CLASSES } from "@/config/classes";
import {
  FaTrophy,
  FaArrowRight,
  FaArrowLeft,
  FaClock,
  FaBolt,
} from "react-icons/fa6";
import { useRouter, useParams } from "next/navigation";
import "../../competitive.css";

const getXP = (timeLeft: number, isCorrect: boolean) => {
  if (!isCorrect) return 0;
  if (timeLeft >= 10) return 30;
  if (timeLeft >= 5) return 20;
  return 10;
};

const CompetitiveModePage = () => {
  const router = useRouter();
  const params = useParams();
  const classId = params?.class as string;
  const modeId = params?.mode as string;

  const cls = CLASSES.find((c) => c.id === classId);
  const mode = cls?.modes.find((m) => m.id === modeId);

  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [results, setResults] = useState<any[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeLeftRef = useRef(15);

  if (!classId) return null;
  if (!modeId) return null;

  useEffect(() => {
    const fetch = async () => {
      try {
        const modeConfig = cls?.modes.find((m) => m.id === modeId);
        const topicsFilter = (modeConfig as any)?.topics;

        const url = topicsFilter
          ? `/api/questions/bulk?topics=${topicsFilter.join(",")}&count=30&mode=midterms`
          : `/api/questions?mode=${modeId}`;

        const { data } = await axios.get(url);
        const shuffled = Array.isArray(data)
          ? data.sort(() => Math.random() - 0.5).slice(0, 30)
          : data;
        setQuestions(shuffled);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [modeId]);

  const handleAnswer = async (choice: string) => {
    if (selected) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(choice);

    const xp = getXP(
      timeLeftRef.current,
      choice === questions[current].correctAnswer,
    );

    try {
      const { data } = await axios.post("/api/attempts", {
        questionId: questions[current].id,
        selectedAnswer: choice,
        xpEarned: xp,
      });

      if (data.isCorrect) setScore((s) => s + 1);
      setTotalXP((x) => x + xp);
      setResults((r) => [
        ...r,
        {
          ...data,
          xpEarned: xp,
          question: questions[current],
          selectedAnswer: choice,
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTimeUp = () => {
    if (selected) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected("__timeout__");
    setResults((r) => [
      ...r,
      {
        isCorrect: false,
        xpEarned: 0,
        timedOut: true,
        question: questions[current],
        selectedAnswer: null,
      },
    ]);
  };

  const handleNext = async () => {
    if (current + 1 >= questions.length) {
      await axios.post("/api/sessions", {
        mode: modeId,
        score,
        total: questions.length,
        xpEarned: totalXP,
      });
      setDone(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setTimeLeft(15);
    timeLeftRef.current = 15;
  };

  useEffect(() => {
    if (done || !questions.length || selected) return;

    setTimeLeft(15);
    timeLeftRef.current = 15;

    timerRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);

      if (timeLeftRef.current <= 0) {
        clearInterval(timerRef.current!);
        handleTimeUp();
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, questions.length, selected, done]);

  const q = questions[current];
  const timerPercent = (timeLeft / 15) * 100;
  const timerColor =
    timeLeft > 10 ? "#22c55e" : timeLeft > 5 ? "#f97316" : "#ef4444";

  if (loading)
    return (
      <>
        <Header />
        <div className="competitive">
          <div className="container">
            <div className="loading">Loading questions...</div>
          </div>
        </div>
      </>
    );

  return (
    <>
      <Header />
      <div className="competitive">
        <div className="container">
          {!done && q && (
            <div className="question-card">
              <div className="question-meta">
                <span className="question-count">
                  {current + 1} / {questions.length}
                </span>
                <span
                  className={`timer-badge ${timeLeft <= 5 ? "danger" : timeLeft <= 10 ? "warning" : ""}`}
                >
                  <FaClock /> {timeLeft}s
                </span>
              </div>

              <div className="timer-bar">
                <div
                  className="timer-fill"
                  style={{ width: `${timerPercent}%`, background: timerColor }}
                />
              </div>

              <span className="question-type">{q.type.replace("_", " ")}</span>
              <h2 className="question-text">{q.questionText}</h2>

              {q.codeSnippet && (
                <pre className="code-block">
                  <code>{q.codeSnippet}</code>
                </pre>
              )}

              <div className="choices">
                {q.choices.map((choice: string) => {
                  let className = "choice";
                  if (selected) {
                    if (selected === "__timeout__") className += " disabled";
                    else if (choice === selected)
                      className += " selected-final";
                    else className += " disabled";
                  }
                  return (
                    <button
                      key={choice}
                      className={className}
                      onClick={() => handleAnswer(choice)}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              {selected && (
                <div className="comp-feedback">
                  {selected === "__timeout__" ? (
                    <p className="timeout-msg">Time's up!</p>
                  ) : (
                    <p className="xp-msg">
                      <FaBolt /> +
                      {getXP(timeLeftRef.current, selected === q.correctAnswer)}{" "}
                      XP
                    </p>
                  )}
                  <button className="next-btn" onClick={handleNext}>
                    {current + 1 >= questions.length ? "See Results" : "Next"}{" "}
                    <FaArrowRight />
                  </button>
                </div>
              )}
            </div>
          )}

          {done && (
            <div className="results-wrapper">
              <div className="results-card">
                <FaTrophy className="results-trophy" />
                <h2>Round Complete!</h2>
                <p className="results-score">
                  {score} / {questions.length} correct
                </p>
                <p className="results-xp">+{totalXP} XP earned</p>
                <p className="results-accuracy">
                  Accuracy: {Math.round((score / questions.length) * 100)}%
                </p>
                <div className="results-actions">
                  <button
                    className="restart-btn"
                    onClick={() => router.push(`/competitive/${classId}`)}
                  >
                    Play Again
                  </button>
                  <a href="/dashboard" className="dashboard-btn">
                    Back to Dashboard
                  </a>
                </div>
              </div>

              <div className="review-section">
                <h2 className="review-title">Question Review</h2>
                <div className="review-list">
                  {results.map((r, i) => (
                    <div
                      key={i}
                      className={`review-item ${r.isCorrect ? "correct" : "wrong"}`}
                    >
                      <div className="review-header">
                        <span className="review-num">Q{i + 1}</span>
                        <span
                          className={`review-badge ${r.isCorrect ? "correct" : r.timedOut ? "timeout" : "wrong"}`}
                        >
                          {r.timedOut
                            ? "⏱ Timed Out"
                            : r.isCorrect
                              ? "✓ Correct"
                              : "✗ Wrong"}
                        </span>
                        {r.xpEarned > 0 && (
                          <span className="review-xp">+{r.xpEarned} XP</span>
                        )}
                      </div>

                      <p className="review-question">
                        {r.question?.questionText}
                      </p>

                      {r.question?.codeSnippet && (
                        <pre className="code-block">
                          <code>{r.question.codeSnippet}</code>
                        </pre>
                      )}

                      <div className="review-choices">
                        {r.question?.choices?.map((choice: string) => {
                          let cls = "review-choice";
                          if (choice === r.correctAnswer) cls += " correct";
                          else if (choice === r.selectedAnswer && !r.isCorrect)
                            cls += " wrong";
                          else cls += " neutral";
                          return (
                            <div key={choice} className={cls}>
                              {choice}
                              {choice === r.correctAnswer && (
                                <span className="correct-label">
                                  ✓ Correct Answer
                                </span>
                              )}
                              {choice === r.selectedAnswer && !r.isCorrect && (
                                <span className="wrong-label">Your Answer</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="review-explanation">
                        <p>{r.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompetitiveModePage;
