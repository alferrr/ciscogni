import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/User", () => ({
  default: { findOne: vi.fn(), create: vi.fn() },
}));
vi.mock("@/models/AllowedStudent", () => ({ default: { findOne: vi.fn() } }));
vi.mock("bcrypt", () => ({
  default: { compare: vi.fn(), hash: vi.fn(async () => "hashed-password") },
}));

import { POST } from "./route";
import User from "@/models/User";
import AllowedStudent from "@/models/AllowedStudent";
import bcrypt from "bcrypt";

const makeRequest = (body: unknown) =>
  new NextRequest("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const fakeAllowed = (name: string) => ({
  getDataValue: (key: string) => (key === "name" ? name : undefined),
});

const fakeUser = (data: Record<string, unknown>) => ({
  getDataValue: (key: string) => data[key],
  update: vi.fn(async (updates: Record<string, unknown>) =>
    Object.assign(data, updates),
  ),
});

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
    vi.mocked(User.findOne).mockReset();
    vi.mocked(User.create).mockReset();
    vi.mocked(AllowedStudent.findOne).mockReset();
    vi.mocked(bcrypt.compare).mockReset();
  });

  it("rejects a student ID not in the allowed list", async () => {
    vi.mocked(AllowedStudent.findOne).mockResolvedValue(null);
    const res = await POST(
      makeRequest({ studentId: "99999999", password: "x" }),
    );
    expect(res.status).toBe(403);
  });

  it("auto-creates an account on first login and simplifies special characters in the password", async () => {
    vi.mocked(AllowedStudent.findOne).mockResolvedValue(
      fakeAllowed("Juan Peña") as any,
    );
    vi.mocked(User.findOne).mockResolvedValue(null);
    const created = fakeUser({
      id: 1,
      name: "Juan Peña",
      email: "123@usc.edu.ph",
      studentId: "123",
      password: "hashed-password",
      role: "student",
    });
    vi.mocked(User.create).mockResolvedValue(created as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(true);

    const res = await POST(
      makeRequest({ studentId: "123", password: "pena123" }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(bcrypt.hash).toHaveBeenCalledWith("pena123", 10);
    expect(json.token).toBeDefined();
  });

  it("rejects an incorrect password for an existing user", async () => {
    vi.mocked(AllowedStudent.findOne).mockResolvedValue(
      fakeAllowed("Juan Dela Cruz") as any,
    );
    vi.mocked(User.findOne).mockResolvedValue(
      fakeUser({
        id: 2,
        studentId: "456",
        password: "hashed-password",
      }) as any,
    );
    vi.mocked(bcrypt.compare).mockResolvedValue(false);

    const res = await POST(
      makeRequest({ studentId: "456", password: "wrong" }),
    );
    expect(res.status).toBe(401);
  });

  it("sets a token cookie on successful login", async () => {
    vi.mocked(AllowedStudent.findOne).mockResolvedValue(
      fakeAllowed("Juan Dela Cruz") as any,
    );
    vi.mocked(User.findOne).mockResolvedValue(
      fakeUser({
        id: 3,
        studentId: "789",
        password: "hashed-password",
        role: "student",
      }) as any,
    );
    vi.mocked(bcrypt.compare).mockResolvedValue(true);

    const res = await POST(
      makeRequest({ studentId: "789", password: "delacruz789" }),
    );
    expect(res.cookies.get("token")).toBeDefined();
  });
});
