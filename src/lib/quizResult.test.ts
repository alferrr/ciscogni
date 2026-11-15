import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/models/ActivityLog", () => ({ default: { findByPk: vi.fn() } }));
vi.mock("@/models/Session", () => ({ default: { findAll: vi.fn() } }));
vi.mock("@/models/Attempt", () => ({ default: { findAll: vi.fn() } }));
vi.mock("@/models/Question", () => ({ default: { findAll: vi.fn() } }));

import { getQuizResult } from "./quizResult";
import ActivityLog from "@/models/ActivityLog";
import Session from "@/models/Session";
import Attempt from "@/models/Attempt";
import Question from "@/models/Question";

const model = (data: Record<string, unknown>) =>
  ({ getDataValue: (k: string) => data[k] }) as never;

const AT = "2026-11-15T05:00:00.000Z";

describe("getQuizResult", () => {
  beforeEach(() => {
    vi.mocked(ActivityLog.findByPk).mockReset();
    vi.mocked(Session.findAll).mockReset();
    vi.mocked(Attempt.findAll).mockReset();
    vi.mocked(Question.findAll).mockReset();
  });

  it("returns null for non-quiz log entries", async () => {
    vi.mocked(ActivityLog.findByPk).mockResolvedValue(
      model({ action: "auth.login", userId: 1, createdAt: AT }),
    );
    expect(await getQuizResult(1)).toBeNull();
    expect(Session.findAll).not.toHaveBeenCalled();
  });

  it("returns the score with every answer in the order given", async () => {
    vi.mocked(ActivityLog.findByPk).mockResolvedValue(
      model({
        action: "quiz.session_complete",
        target: "midterms",
        userId: 5,
        createdAt: AT,
      }),
    );
    vi.mocked(Session.findAll).mockResolvedValue([
      model({ mode: "midterms", score: 1, total: 2, createdAt: AT }),
    ]);
    // findAll returns newest first; the lib reverses to chronological order.
    vi.mocked(Attempt.findAll).mockResolvedValue(
      Object.assign(
        [
          model({ questionId: 2, selectedAnswer: "x", isCorrect: false }),
          model({ questionId: 1, selectedAnswer: "a", isCorrect: true }),
        ],
        {},
      ),
    );
    vi.mocked(Question.findAll).mockResolvedValue([
      model({
        id: 1,
        questionText: "Q1",
        choices: ["a", "b"],
        correctAnswer: "a",
        explanation: "because",
      }),
      model({
        id: 2,
        questionText: "Q2",
        choices: ["x", "y"],
        correctAnswer: "y",
      }),
    ]);

    const r = await getQuizResult(9);
    expect(r).toMatchObject({ mode: "midterms", score: 1, total: 2 });
    expect(r?.answers.map((a) => a.question)).toEqual(["Q1", "Q2"]);
    expect(r?.answers[1]).toMatchObject({
      selected: "x",
      correct: "y",
      isCorrect: false,
    });
  });

  it("returns null when no matching session exists", async () => {
    vi.mocked(ActivityLog.findByPk).mockResolvedValue(
      model({ action: "quiz.practice_complete", userId: 5, createdAt: AT }),
    );
    vi.mocked(Session.findAll).mockResolvedValue([]);
    expect(await getQuizResult(9)).toBeNull();
  });
});
