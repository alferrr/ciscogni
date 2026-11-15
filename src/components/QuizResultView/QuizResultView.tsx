import { FaTrophy } from "react-icons/fa6";
import { formatTime } from "@/lib/activityText";
import "@/app/competitive/competitive.css";

export type QuizAnswer = {
  question: string;
  code: string | null;
  choices: string[];
  selected: string;
  correct: string;
  isCorrect: boolean;
  explanation: string | null;
};

export type QuizResult = {
  studentName: string | null;
  studentId: string | null;
  finishedAt: string;
  mode: string;
  score: number;
  total: number;
  answers: QuizAnswer[];
};

const MODE_LABELS: Record<string, string> = {
  practice: "Practice",
  midterms: "Midterms Exam",
  finals: "Finals Exam",
};

// Admin copy of the student's own "Question Review" screen: same layout and
// styles, showing what the student answered.
export default function QuizResultView({ result }: { result: QuizResult }) {
  const pct = result.total ? Math.round((result.score / result.total) * 100) : 0;
  return (
    <div className="competitive admin-review">
      <div className="container">
        <div className="results-wrapper">
          <div className="results-card">
            <FaTrophy className="results-trophy" />
            <h2>{MODE_LABELS[result.mode] ?? result.mode} Result</h2>
            <p className="results-accuracy">
              {result.studentName ?? "Unknown student"}
              {result.studentId ? ` (${result.studentId})` : ""} · finished{" "}
              {formatTime(result.finishedAt)}
            </p>
            <p className="results-score">
              {result.score} / {result.total} correct
            </p>
            <p className="results-accuracy">Accuracy: {pct}%</p>
          </div>

          <div className="review-section">
            <h2 className="review-title">Question Review</h2>
            {result.answers.length === 0 && (
              <p className="results-accuracy">
                The individual answers for this quiz were not saved.
              </p>
            )}
            <div className="review-list">
              {result.answers.map((a, i) => (
                <div
                  key={i}
                  className={`review-item ${a.isCorrect ? "correct" : "wrong"}`}
                >
                  <div className="review-header">
                    <span className="review-num">Q{i + 1}</span>
                    <span
                      className={`review-badge ${a.isCorrect ? "correct" : "wrong"}`}
                    >
                      {a.isCorrect ? "✓ Correct" : "✗ Wrong"}
                    </span>
                  </div>

                  <p className="review-question">{a.question}</p>

                  {a.code && (
                    <pre className="code-block">
                      <code>{a.code}</code>
                    </pre>
                  )}

                  <div className="review-choices">
                    {a.choices.map((choice) => {
                      let cls = "review-choice";
                      if (choice === a.correct) cls += " correct";
                      else if (choice === a.selected && !a.isCorrect)
                        cls += " wrong";
                      else cls += " neutral";
                      return (
                        <div key={choice} className={cls}>
                          {choice}
                          {choice === a.correct && (
                            <span className="correct-label">
                              ✓ Correct Answer
                            </span>
                          )}
                          {choice === a.selected && !a.isCorrect && (
                            <span className="wrong-label">
                              Student&apos;s Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {a.explanation && (
                    <div className="review-explanation">
                      <p>{a.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
