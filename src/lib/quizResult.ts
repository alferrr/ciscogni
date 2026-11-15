import { Op } from "sequelize";
import ActivityLog from "@/models/ActivityLog";
import Session from "@/models/Session";
import Attempt from "@/models/Attempt";
import Question from "@/models/Question";
import User from "@/models/User";
import type { QuizAnswer, QuizResult } from "@/components/QuizResultView/QuizResultView";
import { COMPLETE_ACTIONS } from "@/lib/quizActions";

// The log entry and the saved Session aren't linked, so match the session
// saved at (nearly) the same moment, then take the answers the user gave just
// before it finished.
const MATCH_WINDOW_MS = 60_000;
const ANSWER_LOOKBACK_MS = 3 * 60 * 60 * 1000;

export async function getQuizResult(logId: number): Promise<QuizResult | null> {
  const log = await ActivityLog.findByPk(logId);
  if (!log) return null;
  const action = log.getDataValue("action");
  const userId = log.getDataValue("userId");
  if (!COMPLETE_ACTIONS.includes(action) || userId == null) return null;

  const mode =
    action === "quiz.practice_complete" ? "practice" : log.getDataValue("target");
  const at = new Date(log.getDataValue("createdAt")).getTime();

  const candidates = await Session.findAll({
    where: {
      userId,
      mode,
      createdAt: {
        [Op.between]: [
          new Date(at - MATCH_WINDOW_MS),
          new Date(at + MATCH_WINDOW_MS),
        ],
      },
    },
  });
  const session = candidates.sort(
    (a, b) =>
      Math.abs(+new Date(a.getDataValue("createdAt")) - at) -
      Math.abs(+new Date(b.getDataValue("createdAt")) - at),
  )[0];
  if (!session) return null;

  const total: number = session.getDataValue("total");
  const doneAt = new Date(session.getDataValue("createdAt")).getTime();

  const attempts = await Attempt.findAll({
    where: {
      userId,
      createdAt: {
        [Op.between]: [
          new Date(doneAt - ANSWER_LOOKBACK_MS),
          new Date(doneAt + MATCH_WINDOW_MS),
        ],
      },
    },
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    limit: total,
  });
  attempts.reverse();

  const questions = attempts.length
    ? await Question.findAll({
        where: { id: attempts.map((a) => a.getDataValue("questionId")) },
      })
    : [];
  const byId = new Map(questions.map((q) => [q.getDataValue("id"), q]));

  const answers = attempts.flatMap((a): QuizAnswer[] => {
    const q = byId.get(a.getDataValue("questionId"));
    if (!q) return [];
    return [
      {
        question: q.getDataValue("questionText"),
        code: q.getDataValue("codeSnippet") ?? null,
        choices: q.getDataValue("choices") ?? [],
        selected: a.getDataValue("selectedAnswer"),
        correct: q.getDataValue("correctAnswer"),
        isCorrect: !!a.getDataValue("isCorrect"),
        explanation: q.getDataValue("explanation") ?? null,
      },
    ];
  });

  const user = await User.findByPk(userId, {
    attributes: ["name", "studentId"],
  });

  return {
    studentName: user?.getDataValue("name") ?? log.getDataValue("userName"),
    studentId: user?.getDataValue("studentId") ?? null,
    finishedAt: session.getDataValue("createdAt"),
    mode: session.getDataValue("mode"),
    score: session.getDataValue("score"),
    total,
    answers,
  };
}
