import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/Session", () => ({
  default: {
    create: vi.fn(async (data: Record<string, unknown>) => data),
    findAll: vi.fn(),
  },
}));

import { POST } from "./route";
import Session from "@/models/Session";

const SECRET = "test-secret";

const makeRequest = (body: unknown, token?: string) =>
  new NextRequest("http://localhost/api/sessions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { cookie: `token=${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

describe("POST /api/sessions", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(Session.create).mockClear();
  });

  const validToken = () => jwt.sign({ id: 1 }, SECRET);

  it("clamps an oversized total/score/xpEarned to sane bounds", async () => {
    const req = makeRequest(
      { mode: "practice", total: 9999, score: 9999, xpEarned: 999999 },
      validToken(),
    );
    const res = await POST(req);
    const json = await res.json();

    expect(json.total).toBe(100); // MAX_QUESTIONS
    expect(json.score).toBeLessThanOrEqual(json.total);
    expect(json.xpEarned).toBeLessThanOrEqual(json.score * 30); // MAX_COMPETITIVE_XP
  });

  it("rejects an unauthenticated request", async () => {
    const req = makeRequest({ mode: "practice", total: 10, score: 10 });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("rejects an invalid mode", async () => {
    const req = makeRequest(
      { mode: "not-a-real-mode", total: 10, score: 10 },
      validToken(),
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  // Known gap (see route.ts comment): a session's score/total is never
  // cross-checked against real Attempt rows, so a forged perfect score
  // currently persists unchanged. This test documents that behavior so a
  // future fix (linking sessions to real attempts) has a test to flip green.
  it("does not validate score against real attempts (known gap, tracked separately)", async () => {
    const req = makeRequest(
      { mode: "finals", total: 1, score: 1, xpEarned: 30 },
      validToken(),
    );
    const res = await POST(req);
    const json = await res.json();

    expect(json.score).toBe(json.total);
  });
});
