import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/ActivityLog", () => ({ default: { create: vi.fn() } }));
vi.mock("@/models/User", () => ({ default: { findByPk: vi.fn() } }));

import { logActivity } from "./activity";
import ActivityLog from "@/models/ActivityLog";
import User from "@/models/User";

const SECRET = "test-secret";

const makeRequest = (headers: Record<string, string> = {}) =>
  new NextRequest("http://localhost/api/x", { method: "POST", headers });

const created = () => vi.mocked(ActivityLog.create).mock.calls[0][0] as any;

describe("logActivity", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(ActivityLog.create).mockReset();
    vi.mocked(User.findByPk).mockReset();
  });

  it("stores the event with category and user agent", async () => {
    await logActivity(
      makeRequest({ "user-agent": "UA" }),
      {
        action: "auth.login",
        actor: { id: 3, name: "Ann", role: "student" },
        target: "2024-1",
      },
    );
    expect(created()).toMatchObject({
      userId: 3,
      userName: "Ann",
      userRole: "student",
      action: "auth.login",
      category: "auth",
      target: "2024-1",
      userAgent: "UA",
    });
  });

  it("redacts sensitive detail keys", async () => {
    await logActivity(makeRequest(), {
      action: "user.profile_update",
      actor: { id: 1, name: "A" },
      details: { name: "A", newPassword: "hunter2", token: "abc" },
    });
    const details = JSON.parse(created().details);
    expect(details).toEqual({
      name: "A",
      newPassword: "[redacted]",
      token: "[redacted]",
    });
  });

  it("resolves the actor from the session cookie when none is given", async () => {
    const token = jwt.sign({ id: 9, role: "admin" }, SECRET);
    vi.mocked(User.findByPk).mockResolvedValue({
      getDataValue: (k: string) => (k === "name" ? "Boss" : "admin"),
    } as any);

    await logActivity(makeRequest({ cookie: `token=${token}` }), {
      action: "admin.user_delete",
      target: "user #4",
    });

    expect(created()).toMatchObject({
      userId: 9,
      userName: "Boss",
      userRole: "admin",
    });
  });

  it("logs anonymously for an invalid token", async () => {
    await logActivity(makeRequest({ cookie: "token=garbage" }), {
      action: "auth.login_failed",
    });
    expect(created()).toMatchObject({ userId: null, userName: null });
    expect(User.findByPk).not.toHaveBeenCalled();
  });

  it("never throws when the insert fails", async () => {
    vi.mocked(ActivityLog.create).mockRejectedValue(new Error("db down"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(
      logActivity(makeRequest(), { action: "auth.login", actor: { id: 1, name: "A" } }),
    ).resolves.toBeUndefined();
    spy.mockRestore();
  });
});
