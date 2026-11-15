import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/lib/auth", () => ({ isAdminRequest: vi.fn() }));
vi.mock("@/models/Session", () => ({ default: { findAndCountAll: vi.fn() } }));
vi.mock("@/models/User", () => ({ default: {} }));

import { GET } from "./route";
import { isAdminRequest } from "@/lib/auth";
import Session from "@/models/Session";

const get = (qs = "") =>
  GET(new NextRequest(`http://localhost/api/admin/quiz-results${qs}`));

const callOpts = () =>
  vi.mocked(Session.findAndCountAll).mock.calls[0][0] as unknown as {
    limit: number;
    offset: number;
    where: Record<symbol, unknown[]>;
  };

describe("GET /api/admin/quiz-results", () => {
  beforeEach(() => {
    vi.mocked(isAdminRequest).mockReset();
    vi.mocked(Session.findAndCountAll).mockReset();
    vi.mocked(Session.findAndCountAll).mockResolvedValue({
      rows: [
        {
          getDataValue: (k: string) =>
            ({ id: 1, mode: "midterms", score: 8, total: 10, createdAt: "d" })[
              k as "id"
            ],
          get: () => ({
            getDataValue: (k: string) =>
              ({ name: "Ann", studentId: "19020241", course: "BSCS" })[
                k as "name"
              ],
          }),
        },
      ],
      count: 45,
    } as never);
  });

  it("rejects non-admins", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(false);
    expect((await get()).status).toBe(403);
    expect(Session.findAndCountAll).not.toHaveBeenCalled();
  });

  it("returns scores with the student's name and ID", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    const json = await (await get("?page=2&perPage=20")).json();
    expect(json).toMatchObject({
      total: 45,
      page: 2,
      totalPages: 3,
      results: [
        {
          id: 1,
          mode: "midterms",
          score: 8,
          total: 10,
          name: "Ann",
          studentId: "19020241",
        },
      ],
    });
    expect(callOpts().offset).toBe(20);
  });

  it("filters by quiz type and ignores unknown types", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    await get("?mode=finals");
    const [andKey] = Object.getOwnPropertySymbols(callOpts().where);
    expect(callOpts().where[andKey]).toContainEqual({ mode: "finals" });

    vi.mocked(Session.findAndCountAll).mockClear();
    await get("?mode=bogus");
    expect(callOpts().where).toEqual({});
  });
});
