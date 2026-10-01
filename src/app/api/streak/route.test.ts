import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/User", () => ({ default: { findOne: vi.fn() } }));

import { POST } from "./route";
import User from "@/models/User";

const SECRET = "test-secret";

const makeRequest = (token?: string) =>
  new NextRequest("http://localhost/api/streak", {
    method: "POST",
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

describe("POST /api/streak", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(User.findOne).mockReset();
  });

  const validToken = () => jwt.sign({ id: 1 }, SECRET);

  it("rejects an unauthenticated request", async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(401);
  });

  it("returns 404 when the user no longer exists", async () => {
    vi.mocked(User.findOne).mockResolvedValue(null);
    const res = await POST(makeRequest(validToken()));
    expect(res.status).toBe(404);
  });

  it("blocks a second claim on the same day", async () => {
    const user = fakeUser({ streak: 2, xp: 10, lastDailyAt: isoDate(0) });
    vi.mocked(User.findOne).mockResolvedValue(user as any);

    const res = await POST(makeRequest(validToken()));
    const json = await res.json();

    expect(json.alreadyClaimed).toBe(true);
    expect(json.xpEarned).toBe(0);
    expect(user.update).not.toHaveBeenCalled();
  });

  it("continues the streak when claimed yesterday", async () => {
    const user = fakeUser({ streak: 2, xp: 10, lastDailyAt: isoDate(1) });
    vi.mocked(User.findOne).mockResolvedValue(user as any);

    const res = await POST(makeRequest(validToken()));
    const json = await res.json();

    expect(json.streak).toBe(3);
    expect(json.xpEarned).toBe(50);
  });

  it("continues the streak within the one-day grace window (two days ago)", async () => {
    const user = fakeUser({ streak: 4, xp: 10, lastDailyAt: isoDate(2) });
    vi.mocked(User.findOne).mockResolvedValue(user as any);

    const res = await POST(makeRequest(validToken()));
    const json = await res.json();

    expect(json.streak).toBe(5);
  });

  it("resets the streak to 1 after missing more than the grace window", async () => {
    const user = fakeUser({ streak: 10, xp: 10, lastDailyAt: isoDate(5) });
    vi.mocked(User.findOne).mockResolvedValue(user as any);

    const res = await POST(makeRequest(validToken()));
    const json = await res.json();

    expect(json.streak).toBe(1);
  });

  it("starts a streak at 1 for a first-ever claim", async () => {
    const user = fakeUser({ streak: 0, xp: 0, lastDailyAt: null });
    vi.mocked(User.findOne).mockResolvedValue(user as any);

    const res = await POST(makeRequest(validToken()));
    const json = await res.json();

    expect(json.streak).toBe(1);
    expect(json.xp).toBe(50);
  });
});
