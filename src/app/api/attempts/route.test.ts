import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/Attempt", () => ({ default: { create: vi.fn() } }));
vi.mock("@/models/User", () => ({ default: { findOne: vi.fn() } }));
vi.mock("@/models/Question", () => ({ default: { findOne: vi.fn() } }));

import { POST } from "./route";
import Attempt from "@/models/Attempt";
import User from "@/models/User";
import Question from "@/models/Question";

const SECRET = "test-secret";

const makeRequest = (body: unknown, token?: string) =>
  new NextRequest("http://localhost/api/attempts", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { cookie: `token=${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

const fakeQuestion = (data: Record<string, unknown>) => ({
  getDataValue: (key: string) => data[key],
});

const fakeUser = (xp: number) => ({
  getDataValue: (key: string) => (key === "xp" ? xp : undefined),
  update: vi.fn(async () => undefined),
});

describe("POST /api/attempts", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(Attempt.create).mockReset();
    vi.mocked(User.findOne).mockReset();
    vi.mocked(Question.findOne).mockReset();
  });

  const validToken = () => jwt.sign({ id: 1 }, SECRET);

  it("rejects an unauthenticated request", async () => {
    const res = await POST(makeRequest({ questionId: 1, selectedAnswer: "a" }));
    expect(res.status).toBe(401);
  });

  it("returns 404 for a non-existent question", async () => {
    vi.mocked(Question.findOne).mockResolvedValue(null);
    const res = await POST(
      makeRequest({ questionId: 999, selectedAnswer: "a" }, validToken()),
    );
    expect(res.status).toBe(404);
  });

  it("records a wrong practice attempt with zero XP", async () => {
    vi.mocked(Question.findOne).mockResolvedValue(
      fakeQuestion({ correctAnswer: "b", explanation: "because" }) as any,
    );
    vi.mocked(Attempt.create).mockResolvedValue({} as any);

    const res = await POST(
      makeRequest({ questionId: 1, selectedAnswer: "a" }, validToken()),
    );
    const json = await res.json();

    expect(json.isCorrect).toBe(false);
    expect(json.xpGained).toBe(0);
    expect(User.findOne).not.toHaveBeenCalled();
  });

  it("awards XP for a correct timed (competitive) attempt and updates the user", async () => {
    vi.mocked(Question.findOne).mockResolvedValue(
      fakeQuestion({ correctAnswer: "a", explanation: "yep" }) as any,
    );
    vi.mocked(Attempt.create).mockResolvedValue({} as any);
    const user = fakeUser(100);
    vi.mocked(User.findOne).mockResolvedValue(user as any);

    const res = await POST(
      makeRequest(
        { questionId: 1, selectedAnswer: "a", timeLeft: 12 },
        validToken(),
      ),
    );
    const json = await res.json();

    expect(json.isCorrect).toBe(true);
    expect(json.xpGained).toBe(30);
    expect(user.update).toHaveBeenCalledWith({ xp: 130 });
  });

  it("never trusts a client-sent xpGained value", async () => {
    vi.mocked(Question.findOne).mockResolvedValue(
      fakeQuestion({ correctAnswer: "a" }) as any,
    );
    vi.mocked(Attempt.create).mockResolvedValue({} as any);

    const res = await POST(
      makeRequest(
        { questionId: 1, selectedAnswer: "a", xpGained: 999999 },
        validToken(),
      ),
    );
    const json = await res.json();

    // No `timeLeft` sent -> treated as a non-competitive (practice/daily) attempt.
    expect(json.xpGained).toBe(0);
  });
});
