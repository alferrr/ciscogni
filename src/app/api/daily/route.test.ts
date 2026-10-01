import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/lib/db", () => ({
  default: { literal: vi.fn((s: string) => s) },
}));
vi.mock("@/models/Question", () => ({ default: { findAll: vi.fn() } }));
vi.mock("@/models/User", () => ({ default: { findOne: vi.fn() } }));
vi.mock("@/models/Attempt", () => ({ default: { findAll: vi.fn() } }));

import { GET } from "./route";
import Question from "@/models/Question";
import User from "@/models/User";
import Attempt from "@/models/Attempt";

const SECRET = "test-secret";

const makeRequest = (token?: string) =>
  new NextRequest("http://localhost/api/daily", {
    headers: token ? { cookie: `token=${token}` } : {},
  });

const fakeUser = (data: Record<string, unknown>) => ({
  getDataValue: (key: string) => data[key],
});

const fakeQuestion = (data: Record<string, unknown>) => ({
  getDataValue: (key: string) => data[key],
  toJSON: () => data,
});

describe("GET /api/daily", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(Question.findAll).mockReset();
    vi.mocked(User.findOne).mockReset();
    vi.mocked(Attempt.findAll).mockReset();
  });

  const validToken = () => jwt.sign({ id: 1 }, SECRET);

  it("rejects an unauthenticated request", async () => {
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it("returns 404 when the user no longer exists", async () => {
    vi.mocked(User.findOne).mockResolvedValue(null);
    const res = await GET(makeRequest(validToken()));
    expect(res.status).toBe(404);
  });

  it("tells the caller the daily was already taken today", async () => {
    const today = new Date().toISOString().split("T")[0];
    vi.mocked(User.findOne).mockResolvedValue(
      fakeUser({ year: "1", lastDailyAt: today }) as any,
    );
    const res = await GET(makeRequest(validToken()));
    const json = await res.json();
    expect(json.alreadyTaken).toBe(true);
  });

  it("returns 5 fresh questions when the daily hasn't been taken", async () => {
    vi.mocked(User.findOne).mockResolvedValue(
      fakeUser({ year: "1", lastDailyAt: null }) as any,
    );
    vi.mocked(Attempt.findAll).mockResolvedValue([]);
    vi.mocked(Question.findAll).mockResolvedValue(
      Array.from({ length: 5 }, (_, i) =>
        fakeQuestion({ id: i, choices: ["a", "b"] }),
      ) as any,
    );

    const res = await GET(makeRequest(validToken()));
    const json = await res.json();

    expect(json.alreadyTaken).toBe(false);
    expect(json.questions).toHaveLength(5);
  });

  it("tops off with previously-seen questions when the unseen pool is short", async () => {
    vi.mocked(User.findOne).mockResolvedValue(
      fakeUser({ year: "1", lastDailyAt: null }) as any,
    );
    vi.mocked(Attempt.findAll).mockResolvedValue([
      { getDataValue: () => 1 },
    ] as any);
    vi.mocked(Question.findAll)
      .mockResolvedValueOnce(
        Array.from({ length: 2 }, (_, i) =>
          fakeQuestion({ id: i, choices: ["a", "b"] }),
        ) as any,
      )
      .mockResolvedValueOnce(
        Array.from({ length: 3 }, (_, i) =>
          fakeQuestion({ id: i + 2, choices: ["a", "b"] }),
        ) as any,
      );

    const res = await GET(makeRequest(validToken()));
    const json = await res.json();

    expect(json.questions).toHaveLength(5);
    expect(Question.findAll).toHaveBeenCalledTimes(2);
  });
});
