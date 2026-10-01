import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/lib/auth", () => ({ isAdminRequest: vi.fn() }));
vi.mock("@/lib/seo", () => ({
  getSeoSettings: vi.fn(),
  updateSeoSettings: vi.fn(),
}));

import { GET, PUT } from "./route";
import { isAdminRequest } from "@/lib/auth";
import { getSeoSettings, updateSeoSettings } from "@/lib/seo";

const makeRequest = (method: string, body?: unknown) =>
  new NextRequest("http://localhost/api/admin/seo", {
    method,
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

describe("admin/seo route", () => {
  beforeEach(() => {
    vi.mocked(isAdminRequest).mockReset();
    vi.mocked(getSeoSettings).mockReset();
    vi.mocked(updateSeoSettings).mockReset();
  });

  it("GET rejects a non-admin", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(false);
    const res = await GET(makeRequest("GET"));
    expect(res.status).toBe(403);
  });

  it("GET returns the current settings for an admin", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    vi.mocked(getSeoSettings).mockResolvedValue({
      title: "t",
      description: "d",
      keywords: "k",
      ogImageUrl: null,
    });
    const res = await GET(makeRequest("GET"));
    const json = await res.json();
    expect(json.title).toBe("t");
  });

  it("PUT rejects missing title/description", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    const res = await PUT(makeRequest("PUT", { title: "", description: "" }));
    expect(res.status).toBe(400);
    expect(updateSeoSettings).not.toHaveBeenCalled();
  });

  it("PUT updates settings when valid", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    vi.mocked(updateSeoSettings).mockResolvedValue({
      title: "New",
      description: "New desc",
      keywords: "",
      ogImageUrl: null,
    });
    const res = await PUT(
      makeRequest("PUT", {
        title: "New",
        description: "New desc",
        keywords: "",
        ogImageUrl: null,
      }),
    );
    const json = await res.json();
    expect(json.title).toBe("New");
  });
});
