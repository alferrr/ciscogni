import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/User", () => ({ default: { update: vi.fn() } }));

import { resetExpiredStreaks } from "./streakReset";
import User from "@/models/User";

describe("resetExpiredStreaks", () => {
  beforeEach(() => {
    vi.mocked(User.update).mockReset();
  });

  it("resets streak to 0 for users whose grace window has lapsed", async () => {
    vi.mocked(User.update).mockResolvedValue([3] as any);

    const count = await resetExpiredStreaks();

    expect(count).toBe(3);
    expect(User.update).toHaveBeenCalledWith(
      { streak: 0 },
      expect.objectContaining({
        where: expect.objectContaining({
          streak: expect.anything(),
          lastDailyAt: expect.anything(),
        }),
      }),
    );
  });

  it("only targets users with a streak greater than 0", async () => {
    vi.mocked(User.update).mockResolvedValue([0] as any);

    await resetExpiredStreaks();

    const [, options] = vi.mocked(User.update).mock.calls[0];
    const streakClause = (options as any).where.streak;
    const [gtSymbol] = Object.getOwnPropertySymbols(streakClause);
    expect(streakClause[gtSymbol]).toBe(0);
  });

  it("excludes today, yesterday, and two days ago from the reset", async () => {
    vi.mocked(User.update).mockResolvedValue([0] as any);

    await resetExpiredStreaks();

    const [, options] = vi.mocked(User.update).mock.calls[0];
    const lastDailyClause = (options as any).where.lastDailyAt;
    const [andSymbol] = Object.getOwnPropertySymbols(lastDailyClause);
    const andClauses = lastDailyClause[andSymbol] as unknown[];
    expect(andClauses).toHaveLength(3);
  });
});
