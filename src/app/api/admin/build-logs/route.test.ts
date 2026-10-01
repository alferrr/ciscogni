import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/auth", () => ({ getAuthedUser: vi.fn() }));

import { GET } from "./route";
import { getAuthedUser } from "@/lib/auth";

const fakeUser = (role: string) => ({
  getDataValue: (key: string) => (key === "role" ? role : undefined),
});

const makeRequest = (token?: string) =>
  new NextRequest(
    `http://localhost/api/admin/build-logs${token ? `?token=${token}` : ""}`,
  );

describe("GET /api/admin/build-logs", () => {
  beforeEach(() => {
    vi.mocked(getAuthedUser).mockReset();
  });

  afterEach(() => {
    delete process.env.BUILD_LOG_TOKEN;
  });

  it("rejects an unauthenticated request", async () => {
    vi.mocked(getAuthedUser).mockResolvedValue(null as any);
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it("rejects a non-admin user", async () => {
    vi.mocked(getAuthedUser).mockResolvedValue(fakeUser("student") as any);
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it("rejects an admin without the correct build-log token", async () => {
    process.env.BUILD_LOG_TOKEN = "secret-token";
    vi.mocked(getAuthedUser).mockResolvedValue(fakeUser("admin") as any);
    const res = await GET(makeRequest("wrong-token"));
    expect(res.status).toBe(403);
  });

  it("rejects every admin when no server token is configured", async () => {
    vi.mocked(getAuthedUser).mockResolvedValue(fakeUser("admin") as any);
    const res = await GET(makeRequest("anything"));
    expect(res.status).toBe(403);
  });

  it("opens the SSE stream for a valid admin + token", async () => {
    process.env.BUILD_LOG_TOKEN = "secret-token";
    vi.mocked(getAuthedUser).mockResolvedValue(fakeUser("admin") as any);
    const res = await GET(makeRequest("secret-token"));
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/event-stream");
    (res.body as ReadableStream)?.cancel();
  });
});
