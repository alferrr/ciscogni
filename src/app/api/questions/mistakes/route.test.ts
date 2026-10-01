import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/Attempt", () => ({ default: { findAll: vi.fn() } }));
vi.mock("@/models/Question", () => ({ default: { findAll: vi.fn() } }));

import { GET } from "./route";
import Attempt from "@/models/Attempt";
import Question from "@/models/Question";

const SECRET = "test-secret";

const makeRequest = (url: string, token?: string) =>
  new NextRequest(url, { headers: token ? { cookie: `token=${token}` } : {} });

const fakeQuestion = (id: number) => ({
  getDataValue: (key: string) => (key === "id" ? id : undefined),
  toJSON: () => ({ id, choices: ["a", "b"] }),
});

describe("GET /api/questions/mistakes", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(Attempt.findAll).mockReset();
    vi.mocked(Question.findAll).mockReset();
  });

  const validToken = () => jwt.sign({ id: 1 }, SECRET);

  it("rejects an unauthenticated request", async () => {
    const res = await GET(makeRequest("http://localhost/api/questions/mistakes"));
    expect(res.status).toBe(401);
  });

  it("returns an empty list with no attempts", async () => {
    vi.mocked(Attempt.findAll).mockResolvedValue([]);
    const res = await GET(
      makeRequest("http://localhost/api/questions/mistakes", validToken()),
    );
    const json = await res.json();
    expect(json).toEqual([]);
    expect(Question.findAll).not.toHaveBeenCalled();
  });

  it("only treats a question as a mistake if its latest attempt was wrong", async () => {
    vi.mocked(Attempt.findAll).mockResolvedValue([
      { questionId: 1, isCorrect: false },
      { questionId: 1, isCorrect: true }, // later attempt on q1 fixed it
      { questionId: 2, isCorrect: false },
    ] as any);
    vi.mocked(Question.findAll).mockResolvedValue([
      fakeQuestion(2),
    ] as any);

    const res = await GET(
      makeRequest("http://localhost/api/questions/mistakes", validToken()),
    );
    await res.json();

    expect(Question.findAll).toHaveBeenCalledWith({
      where: { id: expect.anything() },
    });
    const [{ where }] = vi.mocked(Question.findAll).mock.calls[0];
    const [inSymbol] = Object.getOwnPropertySymbols((where as any).id);
    expect((where as any).id[inSymbol]).toEqual([2]);
  });

  it("additionally scopes by topic when provided", async () => {
    vi.mocked(Attempt.findAll).mockResolvedValue([
      { questionId: 1, isCorrect: false },
    ] as any);
    vi.mocked(Question.findAll).mockResolvedValue([]);

    await GET(
      makeRequest(
        "http://localhost/api/questions/mistakes?topics=loops",
        validToken(),
      ),
    );

    const [{ where }] = vi.mocked(Question.findAll).mock.calls[0];
    expect((where as any).topic).toBeDefined();
  });
});
