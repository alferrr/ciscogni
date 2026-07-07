"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/Header/Header";
import {
  FaArrowRight,
  FaArrowLeft,
  FaCircleCheck,
  FaCircleXmark,
} from "react-icons/fa6";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import "../../practice.css";
import { Suspense } from "react";
import QuizSkeleton from "@/components/Skeleton/QuizSkeleton";

const SessionInner = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const classId = params?.class as string;
  const topicsParam = searchParams?.get("topics") ?? "";
  const countParam = searchParams?.get("count") ?? "10";
  const parsedCount = parseInt(countParam);
  const count = Math.min(isNaN(parsedCount) ? 10 : parsedCount, 50);

  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!classId || !topicsParam) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const { data } = await axios.get(
          `/api/questions/bulk?topics=${topicsParam}&count=${count}`,
        );
        setQuestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [classId, topicsParam, count]);

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

  const q = questions[current];

  if (loading)
    return (
      <>
        <Header />
        <QuizSkeleton showBack />
      </>
    );

  if (questions.length === 0)
    return (
      <>
        <Header />
        <div className="practice">
          <div className="container">
            <div className="coming-soon-box">
              <h2>No questions found</h2>
              <p>No questions available for the selected topics yet.</p>
              <button
                className="back-btn"
                onClick={() => router.push(`/practice/${classId}`)}
              >
                <FaArrowLeft /> Go Back
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
          {!done && q && (
            <>
              <div className="practice-header">
                <button
                  className="back-btn"
                  onClick={() => router.push(`/practice/${classId}`)}
                >
                  <FaArrowLeft /> Back
                </button>
              </div>

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
                    if (result) {
                      if (choice === result.correctAnswer)
                        className += " correct";
                      else if (choice === selected && !result.isCorrect)
                        className += " wrong";
                      else className += " disabled";
                    } else if (selected) {
                      className += " disabled";
                    }
                    return (
                      <button
                        key={choice}
                        className={className}
                        disabled={!!selected}
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
            <div className="results-wrapper">
              <div className="results-card">
                <h2>Session Complete!</h2>
                <p className="results-score">
                  {score} / {questions.length} correct
                </p>
                <div className="results-actions">
                  <button
                    className="restart-btn"
                    onClick={() => router.push(`/practice/${classId}`)}
                  >
                    Practice Again
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

const PracticeSessionPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SessionInner />
  </Suspense>
);

export default PracticeSessionPage;
