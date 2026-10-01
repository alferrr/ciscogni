import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/PageView", () => ({ default: { create: vi.fn() } }));

import { POST } from "./route";
import PageView from "@/models/PageView";

const SECRET = "test-secret";

const makeRequest = (body: unknown, token?: string) =>
  new NextRequest("http://localhost/api/track", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { cookie: `token=${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

describe("POST /api/track", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(PageView.create).mockReset();
  });

  it("rejects a missing path", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    expect(PageView.create).not.toHaveBeenCalled();
  });

  it("rejects a non-string path", async () => {
    const res = await POST(makeRequest({ path: 123 }));
    expect(res.status).toBe(400);
  });

  it("records an anonymous page view with no auth cookie", async () => {
    vi.mocked(PageView.create).mockResolvedValue({} as any);
    const res = await POST(makeRequest({ path: "/dashboard" }));
    expect(res.status).toBe(200);
    expect(PageView.create).toHaveBeenCalledWith({
      path: "/dashboard",
      userId: null,
    });
  });

  it("attributes the page view to the logged-in user", async () => {
    vi.mocked(PageView.create).mockResolvedValue({} as any);
    const token = jwt.sign({ id: 7 }, SECRET);
    await POST(makeRequest({ path: "/practice" }, token));
    expect(PageView.create).toHaveBeenCalledWith({
      path: "/practice",
      userId: 7,
    });
  });

  it("truncates an overly long path to 255 characters", async () => {
    vi.mocked(PageView.create).mockResolvedValue({} as any);
    const longPath = "/" + "a".repeat(300);
    await POST(makeRequest({ path: longPath }));
    const [{ path }] = vi.mocked(PageView.create).mock.calls[0];
    expect((path as string).length).toBe(255);
  });
});
