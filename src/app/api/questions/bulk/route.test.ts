import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/Question", () => ({ default: { findAll: vi.fn() } }));

import { GET } from "./route";
import Question from "@/models/Question";

const SECRET = "test-secret";

const makeRequest = (url: string, token?: string) =>
  new NextRequest(url, { headers: token ? { cookie: `token=${token}` } : {} });

const fakeQuestion = (id: number) => ({
  getDataValue: (key: string) => (key === "id" ? id : undefined),
  toJSON: () => ({ id, choices: ["a", "b"] }),
});

describe("GET /api/questions/bulk", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(Question.findAll).mockReset();
  });

  const validToken = () => jwt.sign({ id: 1 }, SECRET);

  it("rejects an unauthenticated request", async () => {
    const res = await GET(
      makeRequest("http://localhost/api/questions/bulk?topics=loops"),
    );
    expect(res.status).toBe(401);
  });

  it("rejects a request with no topics", async () => {
    const res = await GET(
      makeRequest("http://localhost/api/questions/bulk", validToken()),
    );
    expect(res.status).toBe(400);
  });

  it("clamps count to between 1 and 50", async () => {
    vi.mocked(Question.findAll).mockResolvedValue(
      Array.from({ length: 60 }, (_, i) => fakeQuestion(i)) as any,
    );
    const res = await GET(
      makeRequest(
        "http://localhost/api/questions/bulk?topics=loops&count=999",
        validToken(),
      ),
    );
    const json = await res.json();
    expect(json).toHaveLength(50);
  });

  it("defaults count to 10 when invalid", async () => {
    vi.mocked(Question.findAll).mockResolvedValue(
      Array.from({ length: 20 }, (_, i) => fakeQuestion(i)) as any,
    );
    const res = await GET(
      makeRequest(
        "http://localhost/api/questions/bulk?topics=loops&count=notanumber",
        validToken(),
      ),
    );
    const json = await res.json();
    expect(json).toHaveLength(10);
  });
});
