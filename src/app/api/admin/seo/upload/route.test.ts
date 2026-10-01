import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/lib/auth", () => ({ isAdminRequest: vi.fn() }));
vi.mock("fs/promises", () => ({
  mkdir: vi.fn(async () => undefined),
  writeFile: vi.fn(async () => undefined),
}));
vi.mock("crypto", () => ({
  default: { randomUUID: () => "fixed-uuid" },
  randomUUID: () => "fixed-uuid",
}));

import { POST } from "./route";
import { isAdminRequest } from "@/lib/auth";
import { writeFile } from "fs/promises";

const makeRequest = (formData?: FormData) =>
  ({
    formData: async () => formData ?? new FormData(),
  }) as unknown as NextRequest;

describe("POST /api/admin/seo/upload", () => {
  beforeEach(() => {
    vi.mocked(isAdminRequest).mockReset();
    vi.mocked(writeFile).mockClear();
  });

  it("rejects a non-admin", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(false);
    const res = await POST(makeRequest());
    expect(res.status).toBe(403);
  });

  it("rejects a request with no file", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    const res = await POST(makeRequest());
    expect(res.status).toBe(400);
  });

  it("rejects a disallowed file type", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    const formData = new FormData();
    formData.set("file", new File(["x"], "a.gif", { type: "image/gif" }));
    const res = await POST(makeRequest(formData));
    expect(res.status).toBe(400);
  });

  it("rejects a file over 5MB", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    const big = new Uint8Array(5 * 1024 * 1024 + 1);
    const formData = new FormData();
    formData.set("file", new File([big], "a.png", { type: "image/png" }));
    const res = await POST(makeRequest(formData));
    expect(res.status).toBe(400);
  });

  it("accepts a valid PNG and returns its uploaded url", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    const formData = new FormData();
    formData.set("file", new File(["x"], "a.png", { type: "image/png" }));
    const res = await POST(makeRequest(formData));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.url).toBe("/uploads/seo/fixed-uuid.png");
    expect(writeFile).toHaveBeenCalled();
  });
});
