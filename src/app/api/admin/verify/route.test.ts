import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/lib/auth", () => ({ getAuthedUser: vi.fn() }));

import { GET } from "./route";
import { getAuthedUser } from "@/lib/auth";

const makeRequest = () => new NextRequest("http://localhost/api/admin/verify");

const fakeUser = (role: string) => ({
  getDataValue: (key: string) => (key === "role" ? role : undefined),
});

describe("GET /api/admin/verify", () => {
  beforeEach(() => {
    vi.mocked(getAuthedUser).mockReset();
  });

  it("returns 401 when unauthenticated", async () => {
    vi.mocked(getAuthedUser).mockResolvedValue(null as any);
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it("returns 403 for a non-admin user", async () => {
    vi.mocked(getAuthedUser).mockResolvedValue(fakeUser("student") as any);
    const res = await GET(makeRequest());
    expect(res.status).toBe(403);
  });

  it("returns the role for an admin", async () => {
    vi.mocked(getAuthedUser).mockResolvedValue(fakeUser("admin") as any);
    const res = await GET(makeRequest());
    const json = await res.json();
    expect(json.role).toBe("admin");
  });
});
