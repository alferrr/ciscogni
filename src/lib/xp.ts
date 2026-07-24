// Authoritative XP rules. The server is the source of truth; any client-side
// copy (e.g. optimistic display) must stay in sync with these values.

export const MAX_COMPETITIVE_XP = 30;
export const DAILY_XP_BONUS = 50;

// Competitive mode rewards faster correct answers. `timeLeft` is the seconds
// remaining on the 15-second per-question timer. Wrong answers earn nothing.
// Input is clamped so a client cannot claim more than a legitimate fast answer.
export function competitiveXP(timeLeft: number, isCorrect: boolean): number {
  if (!isCorrect) return 0;
  const t = Math.max(0, Math.min(15, Math.floor(timeLeft)));
  if (t >= 10) return MAX_COMPETITIVE_XP;
  if (t >= 5) return 20;
  return 10;
}

// Clamps an arbitrary value into [min, max], flooring it and treating
// non-finite input as `min`. Used to bound client-submitted numbers
// (e.g. session totals) so a forged request can't record impossible values.
export function clamp(value: unknown, min: number, max: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(Math.floor(n), max));
}
