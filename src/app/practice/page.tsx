"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/Header/Header";
import "./practice.css";
import {
  FaCode,
  FaBrain,
  FaBook,
  FaBolt,
  FaBug,
  FaListCheck,
  FaArrowRight,
  FaCircleCheck,
  FaCircleXmark,
  FaTrophy,
} from "react-icons/fa6";

const topics = [
  {
    label: "Intro to Programming",
    value: "intro_programming",
    icon: <FaCode />,
    color: "#1752f0",
  },
  {
    label: "C Structure & Expressions",
    value: "c_structure",
    icon: <FaBrain />,
    color: "#7c3aed",
  },
  {
    label: "Functions",
    value: "functions",
    icon: <FaBolt />,
    color: "#059669",
  },
  {
    label: "Built-in Functions",
    value: "builtin_functions",
    icon: <FaBook />,
    color: "#0891b2",
  },
  {
    label: "Control Structure I",
    value: "control_structure_1",
    icon: <FaListCheck />,
    color: "#dc2626",
  },
  {
    label: "Control Structure II",
    value: "control_structure_2",
    icon: <FaListCheck />,
    color: "#d97706",
  },
  {
    label: "Testing & Debugging",
    value: "testing_debugging",
    icon: <FaBug />,
    color: "#db2777",
  },
  {
    label: "Arrays & Pointers",
    value: "arrays_pointers",
    icon: <FaCode />,
    color: "#0891b2",
  },
];

const Practice = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<any[]>([]);

  const fetchQuestions = async (topic: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/questions?topic=${topic}&mode=practice`,
      );
      setQuestions(data);
      setSelectedTopic(topic);
      setCurrent(0);
      setSelected(null);
      setResult(null);
      setDone(false);
      setScore(0);
      setResults([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (choice: string) => {
    if (selected) return;
    setSelected(choice);

    try {
      const { data } = await axios.post("/api/attempts", {
        questionId: questions[current].id,
        selectedAnswer: choice,
      });
      setResult(data);
      if (data.isCorrect) setScore((s) => s + 1);
      setResults((r) => [
        ...r,
        { ...data, question: questions[current], selectedAnswer: choice },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setResult(null);
  };

  const handleRestart = () => {
    setSelectedTopic(null);
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setResult(null);
    setDone(false);
    setScore(0);
    setResults([]);
  };

  const q = questions[current];

  return (
    <>
      <Header />
      <div className="practice">
        <div className="container">
          {!selectedTopic && (
            <>
              <div className="practice-header">
                <h1>Practice Mode</h1>
                <p>Choose a topic to start training.</p>
              </div>
              <div className="topic-grid">
                {topics.map((t) => (
                  <button
                    key={t.value}
                    className="topic-card"
                    style={{ borderColor: t.color }}
                    onClick={() => fetchQuestions(t.value)}
                  >
                    <span className="topic-icon" style={{ color: t.color }}>
                      {t.icon}
                    </span>
                    <span className="topic-label">{t.label}</span>
                    <FaArrowRight
                      className="topic-arrow"
                      style={{ color: t.color }}
                    />
                  </button>
                ))}
              </div>
            </>
          )}

          {selectedTopic && loading && (
            <div className="loading">Loading questions...</div>
          )}

          {selectedTopic && !loading && !done && q && (
            <div className="question-card">
              <div className="question-meta">
                <span className="question-count">
                  {current + 1} / {questions.length}
                </span>
                <span className={`question-type ${q.type}`}>
                  {q.type.replace("_", " ")}
                </span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${((current + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

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
                    if (choice === result?.correctAnswer)
                      className += " correct";
                    else if (choice === selected && !result?.isCorrect)
                      className += " wrong";
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

              {result && (
                <div
                  className={`feedback ${result.isCorrect ? "correct" : "wrong"}`}
                >
                  <div className="feedback-header">
                    {result.isCorrect ? (
                      <>
                        <FaCircleCheck /> Correct!
                      </>
                    ) : (
                      <>
                        <FaCircleXmark /> Wrong!
                      </>
                    )}
                  </div>
                  <p className="feedback-explanation">{result.explanation}</p>
                  <button className="next-btn" onClick={handleNext}>
                    {current + 1 >= questions.length
                      ? "See Results"
                      : "Next Question"}{" "}
                    <FaArrowRight />
                  </button>
                </div>
              )}
            </div>
          )}

          {done && (
            <div className="results-wrapper">
              <div className="results-card">
                <h2>Session Complete!</h2>
                <p className="results-score">
                  {score} / {questions.length} correct
                </p>
                <div className="results-actions">
                  <button className="restart-btn" onClick={handleRestart}>
                    Choose Another Topic
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
                          className={`review-badge ${r.isCorrect ? "correct" : "wrong"}`}
                        >
                          {r.isCorrect ? "✓ Correct" : "✗ Wrong"}
                        </span>
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

export default Practice;
