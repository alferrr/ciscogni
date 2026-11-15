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
  midterms: "Midterms exam",
  finals: "Finals exam",
};

// Admin view of one finished quiz: the score and every answer given.
export default function QuizResultView({ result }: { result: QuizResult }) {
  const pct = result.total ? Math.round((result.score / result.total) * 100) : 0;
  return (
    <div className="quiz-result">
      <div className="quiz-result-summary">
        <strong>{MODE_LABELS[result.mode] ?? result.mode}</strong>
        <span>
          Score: <strong>{result.score}</strong> / {result.total} ({pct}%)
        </span>
      </div>

      {result.answers.length === 0 && (
        <p className="activity-muted">
          The individual answers for this quiz were not saved.
        </p>
      )}

      <ol className="quiz-result-list">
        {result.answers.map((a, i) => (
          <li key={i} className={a.isCorrect ? "correct" : "wrong"}>
            <div className="quiz-result-q">
              {a.question}{" "}
              <span className="quiz-result-badge">
                {a.isCorrect ? "Correct" : "Wrong"}
              </span>
            </div>
            {a.code && <pre className="quiz-result-code">{a.code}</pre>}
            <ul className="quiz-result-choices">
              {a.choices.map((c) => {
                const isCorrect = c === a.correct;
                const isPicked = c === a.selected;
                return (
                  <li
                    key={c}
                    className={[
                      isCorrect ? "is-correct" : "",
                      isPicked && !isCorrect ? "is-wrong" : "",
                    ].join(" ")}
                  >
                    {c}
                    {isPicked && <em> — student&apos;s answer</em>}
                    {isCorrect && !isPicked && <em> — correct answer</em>}
                  </li>
                );
              })}
            </ul>
            {a.explanation && (
              <div className="quiz-result-expl">{a.explanation}</div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
