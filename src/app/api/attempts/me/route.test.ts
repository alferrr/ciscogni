import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/associations", () => ({}));
vi.mock("@/models/Question", () => ({ default: {} }));
vi.mock("@/models/Attempt", () => ({ default: { findAll: vi.fn() } }));

import { GET } from "./route";
import Attempt from "@/models/Attempt";

const SECRET = "test-secret";

const makeRequest = (token?: string) =>
  new NextRequest("http://localhost/api/attempts/me", {
    headers: token ? { cookie: `token=${token}` } : {},
  });

describe("GET /api/attempts/me", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(Attempt.findAll).mockReset();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it("returns the caller's 10 most recent attempts", async () => {
    const token = jwt.sign({ id: 9 }, SECRET);
    vi.mocked(Attempt.findAll).mockResolvedValue([{ id: 1 }] as any);

    const res = await GET(makeRequest(token));
    const json = await res.json();

    expect(json).toEqual([{ id: 1 }]);
    expect(Attempt.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 9 },
        limit: 10,
      }),
    );
  });
});
