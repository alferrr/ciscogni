import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/associations", () => ({}));
vi.mock("@/models/Question", () => ({ default: {} }));
vi.mock("@/models/Attempt", () => ({ default: { findAll: vi.fn() } }));
vi.mock("@/models/Session", () => ({ default: { findAll: vi.fn() } }));

import { GET } from "./route";
import Attempt from "@/models/Attempt";
import Session from "@/models/Session";

const SECRET = "test-secret";

const makeRequest = (token?: string) =>
  new NextRequest("http://localhost/api/progress", {
    headers: token ? { cookie: `token=${token}` } : {},
  });

const fakeAttempt = (isCorrect: boolean, question: Record<string, unknown>) => ({
  getDataValue: (key: string) =>
    key === "isCorrect" ? isCorrect : key === "question" ? question : undefined,
});

describe("GET /api/progress", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(Attempt.findAll).mockReset();
    vi.mocked(Session.findAll).mockReset();
  });

  const validToken = () => jwt.sign({ id: 1 }, SECRET);

  it("rejects an unauthenticated request", async () => {
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it("returns zeroed stats when there are no attempts", async () => {
    vi.mocked(Attempt.findAll).mockResolvedValue([]);
    vi.mocked(Session.findAll).mockResolvedValue([]);

    const res = await GET(makeRequest(validToken()));
    const json = await res.json();

    expect(json.totalAnswered).toBe(0);
    expect(json.accuracy).toBe(0);
    expect(json.topicStats).toEqual([]);
  });

  it("computes overall accuracy and per-topic/per-type breakdowns", async () => {
    vi.mocked(Attempt.findAll).mockResolvedValue([
      fakeAttempt(true, { topic: "loops", type: "concept" }),
      fakeAttempt(false, { topic: "loops", type: "concept" }),
      fakeAttempt(true, { topic: "arrays", type: "bug_detection" }),
    ] as any);
    vi.mocked(Session.findAll).mockResolvedValue([]);

    const res = await GET(makeRequest(validToken()));
    const json = await res.json();

    expect(json.totalAnswered).toBe(3);
    expect(json.totalCorrect).toBe(2);
    expect(json.accuracy).toBe(67);

    const loops = json.topicStats.find((t: any) => t.topic === "loops");
    expect(loops).toMatchObject({ correct: 1, total: 2, accuracy: 50 });

    const arrays = json.topicStats.find((t: any) => t.topic === "arrays");
    expect(arrays).toMatchObject({ correct: 1, total: 1, accuracy: 100 });
  });
});
