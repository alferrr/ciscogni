import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/User", () => ({
  default: { findOne: vi.fn(), count: vi.fn() },
}));

import { GET } from "./route";
import User from "@/models/User";

const SECRET = "test-secret";

const makeRequest = (token?: string) =>
  new NextRequest("http://localhost/api/user/me", {
    headers: token ? { cookie: `token=${token}` } : {},
  });

const isoDate = (offsetDays: number) =>
  new Date(Date.now() - offsetDays * 86400000).toISOString().split("T")[0];

const fakeUser = (data: Record<string, unknown>) => ({
  getDataValue: (key: string) => data[key],
  update: vi.fn(async (updates: Record<string, unknown>) =>
    Object.assign(data, updates),
  ),
});

describe("GET /api/user/me", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(User.findOne).mockReset();
    vi.mocked(User.count).mockReset();
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

  it("keeps the streak when the last claim is within the grace window", async () => {
    const user = fakeUser({
      id: 1,
      name: "A",
      email: "a@usc.edu.ph",
      xp: 10,
      streak: 5,
      lastDailyAt: isoDate(2),
      year: "1",
      course: "BSCS",
    });
    vi.mocked(User.findOne).mockResolvedValue(user as any);
    vi.mocked(User.count).mockResolvedValue(0);

    await GET(makeRequest(validToken()));
    expect(user.update).not.toHaveBeenCalled();
  });

  it("resets the streak to 0 once the grace window has lapsed", async () => {
    const user = fakeUser({
      id: 1,
      name: "A",
      email: "a@usc.edu.ph",
      xp: 10,
      streak: 5,
      lastDailyAt: isoDate(5),
      year: "1",
      course: "BSCS",
    });
    vi.mocked(User.findOne).mockResolvedValue(user as any);
    vi.mocked(User.count).mockResolvedValue(0);

    await GET(makeRequest(validToken()));
    expect(user.update).toHaveBeenCalledWith({ streak: 0 });
  });

  it("computes rank as the count of higher-xp users plus one", async () => {
    const user = fakeUser({
      id: 1,
      name: "A",
      email: "a@usc.edu.ph",
      xp: 10,
      streak: 0,
      lastDailyAt: null,
      year: "1",
      course: "BSCS",
    });
    vi.mocked(User.findOne).mockResolvedValue(user as any);
    vi.mocked(User.count).mockResolvedValue(4);

    const res = await GET(makeRequest(validToken()));
    const json = await res.json();
    expect(json.rank).toBe(5);
  });
});
