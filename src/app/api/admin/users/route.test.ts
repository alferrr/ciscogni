import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/lib/auth", () => ({ isAdminRequest: vi.fn() }));
vi.mock("@/models/User", () => ({
  default: { findAll: vi.fn(), destroy: vi.fn(), update: vi.fn() },
}));

import { GET, DELETE, PUT } from "./route";
import { isAdminRequest } from "@/lib/auth";
import User from "@/models/User";

const makeRequest = (method: string, body?: unknown) =>
  new NextRequest("http://localhost/api/admin/users", {
    method,
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

describe("admin/users route", () => {
  beforeEach(() => {
    vi.mocked(isAdminRequest).mockReset();
    vi.mocked(User.findAll).mockReset();
    vi.mocked(User.destroy).mockReset();
    vi.mocked(User.update).mockReset();
  });

  it("GET rejects a non-admin", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(false);
    const res = await GET(makeRequest("GET"));
    expect(res.status).toBe(403);
  });

  it("GET returns the user list for an admin", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    vi.mocked(User.findAll).mockResolvedValue([{ id: 1 }] as any);
    const res = await GET(makeRequest("GET"));
    const json = await res.json();
    expect(json).toEqual([{ id: 1 }]);
  });

  it("DELETE removes a user by id", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    await DELETE(makeRequest("DELETE", { id: 4 }));
    expect(User.destroy).toHaveBeenCalledWith({ where: { id: 4 } });
  });

  it("PUT rejects an invalid role", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    const res = await PUT(makeRequest("PUT", { id: 1, role: "superadmin" }));
    expect(res.status).toBe(400);
    expect(User.update).not.toHaveBeenCalled();
  });

  it("PUT only applies editable fields with a valid role", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    const res = await PUT(
      makeRequest("PUT", {
        id: 1,
        role: "teacher",
        name: "New Name",
        password: "hacked",
      }),
    );
    expect(res.status).toBe(200);
    expect(User.update).toHaveBeenCalledWith(
      { role: "teacher", name: "New Name" },
      { where: { id: 1 } },
    );
  });
});
