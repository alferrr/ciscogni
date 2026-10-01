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

describe("GET /api/questions", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    vi.mocked(Question.findAll).mockReset();
  });

  const validToken = () => jwt.sign({ id: 1 }, SECRET);

  it("rejects an unauthenticated request", async () => {
    const res = await GET(makeRequest("http://localhost/api/questions"));
    expect(res.status).toBe(401);
  });

  it("filters by a single topic and mode", async () => {
    vi.mocked(Question.findAll).mockResolvedValue([]);
    await GET(
      makeRequest(
        "http://localhost/api/questions?topic=loops&mode=midterms",
        validToken(),
      ),
    );
    expect(Question.findAll).toHaveBeenCalledWith({
      where: { topic: "loops", mode: "midterms" },
    });
  });

  it("filters by a comma-separated topics list", async () => {
    vi.mocked(Question.findAll).mockResolvedValue([]);
    await GET(
      makeRequest(
        "http://localhost/api/questions?topics=loops,arrays",
        validToken(),
      ),
    );
    const [{ where }] = vi.mocked(Question.findAll).mock.calls[0];
    const [inSymbol] = Object.getOwnPropertySymbols((where as any).topic);
    expect((where as any).topic[inSymbol]).toEqual(["loops", "arrays"]);
  });

  it("returns an empty where clause with no filters", async () => {
    vi.mocked(Question.findAll).mockResolvedValue([]);
    await GET(makeRequest("http://localhost/api/questions", validToken()));
    expect(Question.findAll).toHaveBeenCalledWith({ where: {} });
  });
});
