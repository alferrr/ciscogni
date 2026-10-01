import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/lib/auth", () => ({ isAdminRequest: vi.fn() }));
vi.mock("@/models/Question", () => ({
  default: {
    findAll: vi.fn(),
    create: vi.fn(),
    destroy: vi.fn(),
    update: vi.fn(),
  },
}));

import { GET, POST, DELETE, PUT } from "./route";
import { isAdminRequest } from "@/lib/auth";
import Question from "@/models/Question";

const makeRequest = (method: string, body?: unknown) =>
  new NextRequest("http://localhost/api/admin/questions", {
    method,
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

describe("admin/questions route", () => {
  beforeEach(() => {
    vi.mocked(isAdminRequest).mockReset();
    vi.mocked(Question.findAll).mockReset();
    vi.mocked(Question.create).mockReset();
    vi.mocked(Question.destroy).mockReset();
    vi.mocked(Question.update).mockReset();
  });

  it("GET rejects a non-admin", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(false);
    const res = await GET(makeRequest("GET"));
    expect(res.status).toBe(403);
  });

  it("GET returns all questions for an admin", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    vi.mocked(Question.findAll).mockResolvedValue([{ id: 1 }] as any);
    const res = await GET(makeRequest("GET"));
    const json = await res.json();
    expect(json).toEqual([{ id: 1 }]);
  });

  it("POST creates a question for an admin", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    vi.mocked(Question.create).mockResolvedValue({ id: 5 } as any);
    const res = await POST(makeRequest("POST", { questionText: "x" }));
    expect(res.status).toBe(201);
    expect(Question.create).toHaveBeenCalledWith({ questionText: "x" });
  });

  it("POST rejects a non-admin", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(false);
    const res = await POST(makeRequest("POST", {}));
    expect(res.status).toBe(403);
    expect(Question.create).not.toHaveBeenCalled();
  });

  it("DELETE removes the question by id for an admin", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    const res = await DELETE(makeRequest("DELETE", { id: 7 }));
    expect(res.status).toBe(200);
    expect(Question.destroy).toHaveBeenCalledWith({ where: { id: 7 } });
  });

  it("PUT updates the question by id for an admin", async () => {
    vi.mocked(isAdminRequest).mockResolvedValue(true);
    const res = await PUT(makeRequest("PUT", { id: 7, topic: "loops" }));
    expect(res.status).toBe(200);
    expect(Question.update).toHaveBeenCalledWith(
      { topic: "loops" },
      { where: { id: 7 } },
    );
  });
});
