"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/Header/Header";
import "../practice/practice.css";
import "./daily.css";
import {
  FaFire,
  FaArrowRight,
  FaCircleCheck,
  FaCircleXmark,
} from "react-icons/fa6";

const Daily = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [alreadyTaken, setAlreadyTaken] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    const fetchDaily = async () => {
      try {
        const { data } = await axios.get("/api/daily");
        if (data.alreadyTaken) {
          setAlreadyTaken(true);
        } else {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDaily();
  }, []);

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
    } catch (err) {
      console.error(err);
    }
  };

  const handleNext = async () => {
    if (current + 1 >= questions.length) {
      const { data } = await axios.post("/api/streak");
      setXpEarned(data.xpEarned ?? 50);
      setDone(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setResult(null);
  };

  const q = questions[current];

  if (loading)
    return (
      <>
        <Header />
        <div className="practice">
          <div className="container">
            <div className="loading">Loading daily challenge...</div>
          </div>
        </div>
      </>
    );

  return (
    <>
      <Header />
      <div className="practice">
        <div className="container">
          {alreadyTaken && (
            <div className="already-taken">
              <FaFire className="daily-fire" />
              <h2>You've already completed today's challenge!</h2>
              <p>Come back tomorrow to keep your streak going.</p>
              <div className="results-actions">
                <a href="/practice" className="restart-btn">
                  Practice Instead
                </a>
                <a href="/dashboard" className="dashboard-btn">
                  Back to Dashboard
                </a>
              </div>
            </div>
          )}

          {!alreadyTaken && !done && q && (
            <>
              <div className="daily-header">
                <div className="daily-title">
                  <FaFire className="daily-fire" />
                  <h1>Daily Challenge</h1>
                </div>
                <p>Complete all 5 questions to maintain your streak.</p>
              </div>

              <div className="question-card">
                <div className="question-meta">
                  <span className="question-count">
                    {current + 1} / {questions.length}
                  </span>
                  <span className="question-type">
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
            </>
          )}

          {done && (
            <div className="results-card">
              <FaFire className="results-fire" />
              <h2>Daily Challenge Complete! 🔥</h2>
              <p className="results-score">
                {score} / {questions.length} correct
              </p>
              <p className="results-xp">+{xpEarned} XP earned</p>
              <p className="streak-msg">Your streak has been updated!</p>
              <div className="results-actions">
                <a href="/practice" className="restart-btn">
                  Practice More
                </a>
                <a href="/dashboard" className="dashboard-btn">
                  Back to Dashboard
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Daily;
