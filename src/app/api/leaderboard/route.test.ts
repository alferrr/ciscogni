import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/User", () => ({
  default: { findOne: vi.fn(), findAll: vi.fn(), count: vi.fn() },
}));

import { GET } from "./route";
import User from "@/models/User";

const SECRET = "test-secret";

const makeRequest = (url: string, token?: string) =>
  new NextRequest(url, {
    headers: token ? { cookie: `token=${token}` } : {},
  });

const fakeMe = (data: Record<string, unknown>) => ({
  getDataValue: (key: string) => data[key],
  toJSON: () => data,
});

describe("GET /api/leaderboard", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(User.findOne).mockReset();
    vi.mocked(User.findAll).mockReset();
    vi.mocked(User.count).mockReset();
  });

  const validToken = () => jwt.sign({ id: 1 }, SECRET);

  it("rejects an unauthenticated request", async () => {
    const res = await GET(makeRequest("http://localhost/api/leaderboard"));
    expect(res.status).toBe(401);
  });

  it("returns 404 when the user no longer exists", async () => {
    vi.mocked(User.findOne).mockResolvedValue(null);
    const res = await GET(
      makeRequest("http://localhost/api/leaderboard", validToken()),
    );
    expect(res.status).toBe(404);
  });

  it("defaults to ranking by xp and computes rank as higherCount + 1", async () => {
    vi.mocked(User.findOne).mockResolvedValue(
      fakeMe({ id: 1, xp: 50, year: "2" }) as any,
    );
    vi.mocked(User.findAll).mockResolvedValue([]);
    vi.mocked(User.count).mockResolvedValue(3);

    const res = await GET(
      makeRequest("http://localhost/api/leaderboard", validToken()),
    );
    const json = await res.json();

    expect(json.me.rank).toBe(4);
    expect(User.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ order: [["xp", "DESC"]] }),
    );
  });

  it("scopes to the caller's year cohort for tab=year", async () => {
    vi.mocked(User.findOne).mockResolvedValue(
      fakeMe({ id: 1, xp: 50, year: "3" }) as any,
    );
    vi.mocked(User.findAll).mockResolvedValue([]);
    vi.mocked(User.count).mockResolvedValue(0);

    await GET(
      makeRequest(
        "http://localhost/api/leaderboard?tab=year",
        validToken(),
      ),
    );

    expect(User.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { year: "3" } }),
    );
  });

  it("ranks by streak for tab=streak", async () => {
    vi.mocked(User.findOne).mockResolvedValue(
      fakeMe({ id: 1, streak: 5, year: "1" }) as any,
    );
    vi.mocked(User.findAll).mockResolvedValue([]);
    vi.mocked(User.count).mockResolvedValue(0);

    await GET(
      makeRequest(
        "http://localhost/api/leaderboard?tab=streak",
        validToken(),
      ),
    );

    expect(User.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ order: [["streak", "DESC"]] }),
    );
  });
});
