import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/lib/activity", () => ({ logActivity: vi.fn() }));
vi.mock("@/models/Session", () => ({ default: { create: vi.fn() } }));

import { POST } from "./route";
import { logActivity } from "@/lib/activity";
import Session from "@/models/Session";

const SECRET = "test-secret";

const makeRequest = (body: unknown, token?: string) =>
  new NextRequest("http://localhost/api/practice-complete", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { cookie: `token=${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

describe("POST /api/practice-complete", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(logActivity).mockReset();
    vi.mocked(Session.create).mockReset();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await POST(makeRequest({ classId: "prog1", score: 1, total: 2 }));
    expect(res.status).toBe(401);
    expect(logActivity).not.toHaveBeenCalled();
  });

  it("stores and logs the final practice score", async () => {
    const token = jwt.sign({ id: 1, role: "student" }, SECRET);
    const res = await POST(
      makeRequest({ classId: "prog1", score: 7, total: 10 }, token),
    );
    expect(res.status).toBe(200);
    expect(logActivity).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: "quiz.practice_complete",
        target: "prog1",
      }),
    );
    expect(Session.create).toHaveBeenCalledWith({
      userId: 1,
      mode: "practice",
      score: 7,
      total: 10,
      xpEarned: 0,
    });
  });

  it("clamps a forged score to the total", async () => {
    const token = jwt.sign({ id: 1 }, SECRET);
    await POST(makeRequest({ classId: "prog1", score: 999, total: 10 }, token));
    expect(Session.create).toHaveBeenCalledWith(
      expect.objectContaining({ score: 10, total: 10 }),
    );
  });
});
