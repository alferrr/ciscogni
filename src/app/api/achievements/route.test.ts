import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/associations", () => ({}));
vi.mock("@/models/User", () => ({ default: { findOne: vi.fn() } }));
vi.mock("@/models/Attempt", () => ({ default: { findAll: vi.fn() } }));
vi.mock("@/models/Question", () => ({ default: {} }));
vi.mock("@/models/Session", () => ({ default: { findAll: vi.fn() } }));

import { GET } from "./route";
import User from "@/models/User";
import Attempt from "@/models/Attempt";
import Session from "@/models/Session";

const SECRET = "test-secret";

const makeRequest = (token?: string) =>
  new NextRequest("http://localhost/api/achievements", {
    headers: token ? { cookie: `token=${token}` } : {},
  });

const fakeUser = (data: Record<string, unknown>) => ({
  getDataValue: (key: string) => data[key],
  update: vi.fn(async (updates: Record<string, unknown>) =>
    Object.assign(data, updates),
  ),
});

const fakeAttempt = (isCorrect: boolean, question: Record<string, unknown>) => ({
  getDataValue: (key: string) =>
    key === "isCorrect" ? isCorrect : key === "question" ? question : undefined,
});

describe("GET /api/achievements", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(User.findOne).mockReset();
    vi.mocked(Attempt.findAll).mockReset();
    vi.mocked(Session.findAll).mockReset();
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

  it("unlocks first_blood after one correct attempt and persists it", async () => {
    const user = fakeUser({ xp: 0, streak: 0, achievements: [] });
    vi.mocked(User.findOne).mockResolvedValue(user as any);
    vi.mocked(Attempt.findAll).mockResolvedValue([
      fakeAttempt(true, { topic: "loops", type: "concept" }),
    ] as any);
    vi.mocked(Session.findAll).mockResolvedValue([]);

    const res = await GET(makeRequest(validToken()));
    const json = await res.json();

    expect(json.newlyUnlocked).toContain("first_blood");
    expect(user.update).toHaveBeenCalledTimes(1);
    const [{ achievements }] = user.update.mock.calls[0];
    expect(achievements).toContain("first_blood");
  });

  it("does not re-award an already-earned achievement", async () => {
    const earned = [
      "first_blood",
      "loop_master",
      "concept_king",
      "xp_100",
      "xp_500",
      "xp_1000",
      "answered_50",
      "answered_100",
      "debug_king",
      "function_wizard",
      "output_oracle",
      "pointer_survivor",
      "streak_3",
      "streak_7",
      "perfect_exam",
    ];
    const user = fakeUser({ xp: 0, streak: 0, achievements: [...earned] });
    vi.mocked(User.findOne).mockResolvedValue(user as any);
    vi.mocked(Attempt.findAll).mockResolvedValue([
      fakeAttempt(true, { topic: "loops", type: "concept" }),
    ] as any);
    vi.mocked(Session.findAll).mockResolvedValue([]);

    const res = await GET(makeRequest(validToken()));
    const json = await res.json();

    expect(json.newlyUnlocked).toEqual([]);
    expect(user.update).not.toHaveBeenCalled();
  });

  it("marks perfect_exam as unlocked when a session score equals its total", async () => {
    const user = fakeUser({ xp: 0, streak: 0, achievements: [] });
    vi.mocked(User.findOne).mockResolvedValue(user as any);
    vi.mocked(Attempt.findAll).mockResolvedValue([]);
    vi.mocked(Session.findAll).mockResolvedValue([
      { getDataValue: (k: string) => ({ score: 10, total: 10 } as any)[k] },
    ] as any);

    const res = await GET(makeRequest(validToken()));
    const json = await res.json();

    expect(json.newlyUnlocked).toContain("perfect_exam");
  });
});
