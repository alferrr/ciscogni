import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/lib/auth", () => ({ isAdminRequest: vi.fn() }));
vi.mock("@/lib/db", () => ({
  default: {
    fn: vi.fn((name: string) => `fn(${name})`),
    col: vi.fn((name: string) => `col(${name})`),
  },
}));
vi.mock("@/models/User", () => ({ default: { count: vi.fn() } }));
vi.mock("@/models/Question", () => ({
  default: { count: vi.fn(), findAll: vi.fn() },
}));
vi.mock("@/models/PageView", () => ({ default: { findAll: vi.fn() } }));

import { GET } from "./route";
import { isAdminRequest } from "@/lib/auth";
import User from "@/models/User";
import Question from "@/models/Question";
import PageView from "@/models/PageView";

const makeRequest = () => new NextRequest("http://localhost/api/admin/stats");

describe("GET /api/admin/stats", () => {
  beforeEach(() => {
    vi.mocked(isAdminRequest).mockReset();
    vi.mocked(User.count).mockReset();
    vi.mocked(Question.count).mockReset();
    vi.mocked(Question.findAll).mockReset();
    vi.mocked(PageView.findAll).mockReset();
  });

  it("rejects a non-admin", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(false);
    const res = await GET(makeRequest());
    expect(res.status).toBe(403);
  });

  it("returns aggregated totals, type breakdown, and a 7-day traffic series", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    vi.mocked(User.count).mockResolvedValue(10);
    vi.mocked(Question.count).mockResolvedValue(50);
    vi.mocked(Question.findAll).mockResolvedValue([
      { type: "concept", count: "20" },
    ] as any);
    vi.mocked(PageView.findAll).mockResolvedValue([
      { day: new Date().toISOString(), views: "5", users: "2" },
    ] as any);

    const res = await GET(makeRequest());
    const json = await res.json();

    expect(json.totals.users).toBe(10);
    expect(json.totals.questions).toBe(50);
    expect(json.typeBreakdown).toEqual([{ type: "concept", count: 20 }]);
    expect(json.traffic).toHaveLength(7);
    const totalViews = json.traffic.reduce(
      (sum: number, d: any) => sum + d.views,
      0,
    );
    expect(totalViews).toBe(5);
  });

  it("matches a traffic row to today's slot regardless of the server's UTC offset", async () => {
    // Regression test: the day key used to be built from *local* midnight run
    // through toISOString(), which rolls back a day on any positive UTC
    // offset (e.g. Asia/Manila, UTC+8) and silently dropped today's traffic.
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    vi.mocked(User.count).mockResolvedValue(0);
    vi.mocked(Question.count).mockResolvedValue(0);
    vi.mocked(Question.findAll).mockResolvedValue([]);
    const todayUtc = new Date();
    todayUtc.setUTCHours(0, 0, 0, 0);
    vi.mocked(PageView.findAll).mockResolvedValue([
      { day: todayUtc.toISOString(), views: "7", users: "1" },
    ] as any);

    const res = await GET(makeRequest());
    const json = await res.json();

    const lastDay = json.traffic[json.traffic.length - 1];
    expect(lastDay.views).toBe(7);
  });

  it("fills days with no traffic data as zero", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    vi.mocked(User.count).mockResolvedValue(0);
    vi.mocked(Question.count).mockResolvedValue(0);
    vi.mocked(Question.findAll).mockResolvedValue([]);
    vi.mocked(PageView.findAll).mockResolvedValue([]);

    const res = await GET(makeRequest());
    const json = await res.json();

    expect(json.traffic).toHaveLength(7);
    expect(json.traffic.every((d: any) => d.views === 0 && d.users === 0)).toBe(
      true,
    );
  });
});
