import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/lib/auth", () => ({ isAdminRequest: vi.fn() }));
vi.mock("@/models/ActivityLog", () => ({
  default: { findAndCountAll: vi.fn(), findAll: vi.fn() },
}));

vi.mock("@/models/User", () => ({ default: { findAll: vi.fn() } }));
vi.mock("@/models/Session", () => ({ default: { findAll: vi.fn() } }));

import { GET } from "./route";
import User from "@/models/User";
import Session from "@/models/Session";
import { isAdminRequest } from "@/lib/auth";
import ActivityLog from "@/models/ActivityLog";

const get = (qs = "") =>
  GET(new NextRequest(`http://localhost/api/admin/activity${qs}`));

describe("GET /api/admin/activity", () => {
  beforeEach(() => {
    vi.mocked(isAdminRequest).mockReset();
    vi.mocked(ActivityLog.findAndCountAll).mockReset();
    vi.mocked(ActivityLog.findAll).mockReset();
    vi.mocked(User.findAll).mockResolvedValue([
      { getDataValue: (k: string) => (k === "id" ? 5 : "19020241") },
    ] as any);
    vi.mocked(ActivityLog.findAndCountAll).mockResolvedValue({
      rows: [
        {
          getDataValue: (k: string) => (k === "userId" ? 5 : undefined),
          toJSON: () => ({ id: 1, userId: 5 }),
        },
      ],
      count: 120,
    } as any);
    vi.mocked(ActivityLog.findAll).mockResolvedValue([
      { getDataValue: () => "auth" },
    ] as any);
  });

  it("attaches the matching quiz result to a completion row", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    const at = "2026-11-15T05:00:00.000Z";
    const data: Record<string, unknown> = {
      userId: 5,
      action: "quiz.session_complete",
      target: "midterms",
      createdAt: at,
    };
    vi.mocked(ActivityLog.findAndCountAll).mockResolvedValue({
      rows: [
        {
          getDataValue: (k: string) => data[k],
          toJSON: () => ({ id: 1, ...data }),
        },
      ],
      count: 1,
    } as any);
    const sess = (mode: string, score: number, createdAt: string) => ({
      getDataValue: (k: string) =>
        ({ userId: 5, mode, score, total: 10, createdAt })[k as "mode"],
    });
    vi.mocked(Session.findAll).mockResolvedValue([
      sess("finals", 1, at),
      sess("midterms", 8, "2026-11-15T05:00:02.000Z"),
    ] as any);

    const json = await (await get()).json();
    expect(json.logs[0].result).toEqual({ mode: "midterms", score: 8, total: 10 });
  });

  it("rejects non-admins", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(false);
    expect((await get()).status).toBe(403);
    expect(ActivityLog.findAndCountAll).not.toHaveBeenCalled();
  });

  it("returns paginated logs and categories", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    const json = await (await get("?page=2&perPage=50")).json();

    expect(json).toMatchObject({
      logs: [{ id: 1, userId: 5, studentId: "19020241" }],
      total: 120,
      page: 2,
      perPage: 50,
      totalPages: 3,
      categories: ["auth"],
    });
    const opts = vi.mocked(ActivityLog.findAndCountAll).mock.calls[0][0] as any;
    expect(opts.limit).toBe(50);
    expect(opts.offset).toBe(50);
  });

  it("caps perPage at 100 and ignores bad page numbers", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    await get("?perPage=9999&page=-4");
    const opts = vi.mocked(ActivityLog.findAndCountAll).mock.calls[0][0] as any;
    expect(opts.limit).toBe(100);
    expect(opts.offset).toBe(0);
  });

  it("applies category and user filters", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    await get("?category=admin&userId=7");
    const opts = vi.mocked(ActivityLog.findAndCountAll).mock.calls[0][0] as any;
    // Op.and is a symbol key; its value is the list of clauses.
    const [andKey] = Object.getOwnPropertySymbols(opts.where);
    const and = opts.where[andKey];
    expect(and).toContainEqual({ category: "admin" });
    expect(and).toContainEqual({ userId: 7 });
  });
});
