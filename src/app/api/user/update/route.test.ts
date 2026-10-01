import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/User", () => ({ default: { findOne: vi.fn() } }));
vi.mock("bcrypt", () => ({
  default: { compare: vi.fn(), hash: vi.fn(async () => "new-hashed") },
}));

import { PUT } from "./route";
import User from "@/models/User";
import bcrypt from "bcrypt";

const SECRET = "test-secret";

const makeRequest = (body: unknown, token?: string) =>
  new NextRequest("http://localhost/api/user/update", {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      ...(token ? { cookie: `token=${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

const fakeUser = (data: Record<string, unknown>) => ({
  getDataValue: (key: string) => data[key],
  update: vi.fn(async (updates: Record<string, unknown>) =>
    Object.assign(data, updates),
  ),
});

describe("PUT /api/user/update", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(User.findOne).mockReset();
    vi.mocked(bcrypt.compare).mockReset();
    vi.mocked(bcrypt.hash).mockClear();
  });

  const validToken = () => jwt.sign({ id: 1 }, SECRET);

  it("rejects an unauthenticated request", async () => {
    const res = await PUT(makeRequest({ name: "A" }));
    expect(res.status).toBe(401);
  });

  it("returns 404 when the user no longer exists", async () => {
    vi.mocked(User.findOne).mockResolvedValue(null);
    const res = await PUT(makeRequest({ name: "A" }, validToken()));
    expect(res.status).toBe(404);
  });

  it("updates profile fields without touching the password when none is sent", async () => {
    const user = fakeUser({ password: "old-hashed" });
    vi.mocked(User.findOne).mockResolvedValue(user as any);

    await PUT(
      makeRequest({ name: "New Name", course: "BSCS", year: "2" }, validToken()),
    );

    expect(user.update).toHaveBeenCalledWith({
      name: "New Name",
      course: "BSCS",
      year: "2",
    });
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it("rejects a password change with the wrong current password", async () => {
    const user = fakeUser({ password: "old-hashed" });
    vi.mocked(User.findOne).mockResolvedValue(user as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(false);

    const res = await PUT(
      makeRequest(
        { currentPassword: "wrong", newPassword: "newpass123" },
        validToken(),
      ),
    );

    expect(res.status).toBe(400);
    expect(user.update).not.toHaveBeenCalled();
  });

  it("hashes and applies a valid password change", async () => {
    const user = fakeUser({ password: "old-hashed" });
    vi.mocked(User.findOne).mockResolvedValue(user as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(true);

    await PUT(
      makeRequest(
        { currentPassword: "correct", newPassword: "newpass123" },
        validToken(),
      ),
    );

    expect(bcrypt.hash).toHaveBeenCalledWith("newpass123", 10);
    expect(user.update).toHaveBeenCalledWith(
      expect.objectContaining({ password: "new-hashed" }),
    );
  });
});
