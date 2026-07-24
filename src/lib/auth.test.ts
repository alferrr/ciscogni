import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/User", () => ({ default: { findOne: vi.fn() } }));

import { getAuthPayload, getAuthedUser, isAdminRequest } from "./auth";
import User from "@/models/User";

const SECRET = "test-secret";

const fakeRequest = (token: string | undefined): NextRequest =>
  ({
    cookies: { get: () => (token ? { value: token } : undefined) },
  }) as unknown as NextRequest;

describe("getAuthPayload", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
  });

  it("returns the decoded payload for a valid token", () => {
    const token = jwt.sign({ id: 1 }, SECRET);
    const payload = getAuthPayload(fakeRequest(token));
    expect(payload).toMatchObject({ id: 1 });
  });

  it("returns null when there is no token cookie", () => {
    expect(getAuthPayload(fakeRequest(undefined))).toBeNull();
  });

  it("returns null for a malformed token", () => {
    expect(getAuthPayload(fakeRequest("not-a-real-token"))).toBeNull();
  });

  it("returns null for an expired token", () => {
    const token = jwt.sign({ id: 1 }, SECRET, { expiresIn: -10 });
    expect(getAuthPayload(fakeRequest(token))).toBeNull();
  });

  it("returns null for a token signed with the wrong secret", () => {
    const token = jwt.sign({ id: 1 }, "wrong-secret");
    expect(getAuthPayload(fakeRequest(token))).toBeNull();
  });
});

describe("getAuthedUser / isAdminRequest", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(User.findOne).mockReset();
  });

  type FakeUser = Awaited<ReturnType<typeof User.findOne>>;

  const fakeUser = (role: string) =>
    ({
      getDataValue: (key: string) => (key === "role" ? role : undefined),
    }) as unknown as FakeUser;

  it("returns the user when the token is valid and the user exists", async () => {
    const token = jwt.sign({ id: 1 }, SECRET);
    vi.mocked(User.findOne).mockResolvedValue(fakeUser("student"));
    const user = await getAuthedUser(fakeRequest(token));
    expect(user).not.toBeNull();
  });

  it("returns null when the token is invalid", async () => {
    const user = await getAuthedUser(fakeRequest("garbage"));
    expect(user).toBeNull();
    expect(User.findOne).not.toHaveBeenCalled();
  });

  it("returns null when the user no longer exists", async () => {
    const token = jwt.sign({ id: 1 }, SECRET);
    vi.mocked(User.findOne).mockResolvedValue(null);
    const user = await getAuthedUser(fakeRequest(token));
    expect(user).toBeNull();
  });

  it("isAdminRequest is true only for role 'admin'", async () => {
    const token = jwt.sign({ id: 1 }, SECRET);

    vi.mocked(User.findOne).mockResolvedValue(fakeUser("admin"));
    expect(await isAdminRequest(fakeRequest(token))).toBe(true);

    vi.mocked(User.findOne).mockResolvedValue(fakeUser("teacher"));
    expect(await isAdminRequest(fakeRequest(token))).toBe(false);
  });
});
