import { describe, it, expect } from "vitest";
import { competitiveXP, clamp, MAX_COMPETITIVE_XP, DAILY_XP_BONUS } from "./xp";

describe("competitiveXP", () => {
  it("awards 0 for a wrong answer regardless of timeLeft", () => {
    expect(competitiveXP(15, false)).toBe(0);
    expect(competitiveXP(0, false)).toBe(0);
    expect(competitiveXP(-5, false)).toBe(0);
    expect(competitiveXP(100, false)).toBe(0);
  });

  it("awards the low tier (10) for slow correct answers", () => {
    expect(competitiveXP(0, true)).toBe(10);
    expect(competitiveXP(4, true)).toBe(10);
    expect(competitiveXP(4.9, true)).toBe(10);
  });

  it("awards the mid tier (20) starting at 5s left", () => {
    expect(competitiveXP(5, true)).toBe(20);
    expect(competitiveXP(9.9, true)).toBe(20);
  });

  it("awards the max tier (30) starting at 10s left", () => {
    expect(competitiveXP(10, true)).toBe(MAX_COMPETITIVE_XP);
    expect(competitiveXP(15, true)).toBe(MAX_COMPETITIVE_XP);
  });

  it("clamps timeLeft above 15 to the max tier", () => {
    expect(competitiveXP(20, true)).toBe(MAX_COMPETITIVE_XP);
  });

  it("clamps negative timeLeft to the low tier", () => {
    expect(competitiveXP(-5, true)).toBe(10);
  });

  it("floors fractional timeLeft before tiering", () => {
    expect(competitiveXP(7.9, true)).toBe(20);
  });

  it("exposes the documented constants", () => {
    expect(MAX_COMPETITIVE_XP).toBe(30);
    expect(DAILY_XP_BONUS).toBe(50);
  });
});

describe("clamp", () => {
  it("returns the value unchanged when in range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps below the minimum", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("clamps above the maximum", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("treats non-numeric input as the minimum", () => {
    expect(clamp("abc", 0, 10)).toBe(0);
  });

  it("treats undefined input as the minimum", () => {
    expect(clamp(undefined, 2, 10)).toBe(2);
  });

  it("floors fractional values", () => {
    expect(clamp(7.9, 0, 10)).toBe(7);
  });
});
