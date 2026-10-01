import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/User", () => ({
  default: { findOne: vi.fn(), create: vi.fn() },
}));
vi.mock("@/models/AllowedStudent", () => ({ default: { findOne: vi.fn() } }));
vi.mock("bcrypt", () => ({
  default: { hash: vi.fn(async () => "hashed-password") },
}));

import { POST } from "./route";
import User from "@/models/User";
import AllowedStudent from "@/models/AllowedStudent";
import bcrypt from "bcrypt";

const makeRequest = (body: unknown) =>
  new NextRequest("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const fakeAllowed = (name: string) => ({
  getDataValue: (key: string) => (key === "name" ? name : undefined),
});

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.mocked(User.findOne).mockReset();
    vi.mocked(User.create).mockReset();
    vi.mocked(AllowedStudent.findOne).mockReset();
    vi.mocked(bcrypt.hash).mockClear();
  });

  it("rejects a student ID not in the allowed list", async () => {
    vi.mocked(AllowedStudent.findOne).mockResolvedValue(null);
    const res = await POST(
      makeRequest({ studentId: "99999999", course: "BSCS", year: "1" }),
    );
    expect(res.status).toBe(403);
    expect(User.create).not.toHaveBeenCalled();
  });

  it("rejects an already-registered student ID", async () => {
    vi.mocked(AllowedStudent.findOne).mockResolvedValue(
      fakeAllowed("Juan Dela Cruz") as any,
    );
    vi.mocked(User.findOne).mockResolvedValue({ id: 1 } as any);

    const res = await POST(
      makeRequest({ studentId: "123", course: "BSCS", year: "1" }),
    );
    expect(res.status).toBe(400);
  });

  it("creates an account with a plain-ASCII last-name password", async () => {
    vi.mocked(AllowedStudent.findOne).mockResolvedValue(
      fakeAllowed("Juan Peña") as any,
    );
    vi.mocked(User.findOne).mockResolvedValue(null);
    vi.mocked(User.create).mockResolvedValue({} as any);

    const res = await POST(
      makeRequest({ studentId: "19020241", course: "BSCS", year: "1" }),
    );

    expect(res.status).toBe(201);
    expect(bcrypt.hash).toHaveBeenCalledWith("pena19020241", 10);
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Juan Peña",
        email: "19020241@usc.edu.ph",
        studentId: "19020241",
        password: "hashed-password",
      }),
    );
  });

  it("strips non-alphanumeric characters from a hyphenated/apostrophe last name", async () => {
    vi.mocked(AllowedStudent.findOne).mockResolvedValue(
      fakeAllowed("Mary O'Brien-Smith") as any,
    );
    vi.mocked(User.findOne).mockResolvedValue(null);
    vi.mocked(User.create).mockResolvedValue({} as any);

    await POST(makeRequest({ studentId: "111", course: "BSIT", year: "2" }));

    expect(bcrypt.hash).toHaveBeenCalledWith("obriensmith111", 10);
  });
});
