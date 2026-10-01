import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/lib/auth", () => ({ isAdminRequest: vi.fn() }));
vi.mock("@/models/AdminTask", () => ({
  default: {
    findAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
  },
}));

import { GET, POST, PUT, DELETE } from "./route";
import { isAdminRequest } from "@/lib/auth";
import AdminTask from "@/models/AdminTask";

const makeRequest = (method: string, url: string, body?: unknown) =>
  new NextRequest(url, {
    method,
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

describe("admin/tasks route", () => {
  beforeEach(() => {
    vi.mocked(isAdminRequest).mockReset();
    vi.mocked(AdminTask.findAll).mockReset();
    vi.mocked(AdminTask.create).mockReset();
    vi.mocked(AdminTask.update).mockReset();
    vi.mocked(AdminTask.destroy).mockReset();
  });

  it("GET rejects a non-admin", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(false);
    const res = await GET(makeRequest("GET", "http://localhost/api/admin/tasks"));
    expect(res.status).toBe(403);
  });

  it("GET filters by pageId when provided", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    vi.mocked(AdminTask.findAll).mockResolvedValue([] as any);
    await GET(
      makeRequest("GET", "http://localhost/api/admin/tasks?pageId=dashboard"),
    );
    expect(AdminTask.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { pageId: "dashboard" } }),
    );
  });

  it("POST rejects empty text", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    const res = await POST(
      makeRequest("POST", "http://localhost/api/admin/tasks", { text: "   " }),
    );
    expect(res.status).toBe(400);
  });

  it("POST trims text and creates a task", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    vi.mocked(AdminTask.create).mockResolvedValue({ id: 1 } as any);
    const res = await POST(
      makeRequest("POST", "http://localhost/api/admin/tasks", {
        text: "  do thing  ",
      }),
    );
    expect(res.status).toBe(201);
    expect(AdminTask.create).toHaveBeenCalledWith({
      text: "do thing",
      pageId: null,
    });
  });

  it("PUT only applies allowed fields (done, text)", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    await PUT(
      makeRequest("PUT", "http://localhost/api/admin/tasks", {
        id: 1,
        done: true,
        role: "admin",
      }),
    );
    expect(AdminTask.update).toHaveBeenCalledWith(
      { done: true },
      { where: { id: 1 } },
    );
  });

  it("DELETE removes a task by id", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    await DELETE(
      makeRequest("DELETE", "http://localhost/api/admin/tasks", { id: 3 }),
    );
    expect(AdminTask.destroy).toHaveBeenCalledWith({ where: { id: 3 } });
  });
});
