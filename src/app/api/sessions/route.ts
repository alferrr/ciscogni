import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import Session from "@/models/Session";
import { MAX_COMPETITIVE_XP, clamp } from "@/lib/xp";

const VALID_MODES = ["practice", "midterms", "finals"];
const MAX_QUESTIONS = 100;

export async function POST(req: NextRequest) {
  await syncDB();

  try {
    const decoded: any = getAuthPayload(req);
    if (!decoded)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { mode, score, total, xpEarned } = await req.json();

    if (!VALID_MODES.includes(mode))
      return NextResponse.json({ message: "Invalid mode" }, { status: 400 });

    // Clamp to sane bounds so a forged request can't record impossible values.
    // Per-attempt XP is already validated server-side; this session row is a
    // history/display record. Note: score === total (the perfect-exam
    // achievement) is not yet cross-checked against actual attempts — that
    // needs a session/attempt link and is tracked separately.
    const safeTotal = clamp(total, 0, MAX_QUESTIONS);
    const safeScore = clamp(score, 0, safeTotal);
    const safeXp = clamp(xpEarned, 0, safeScore * MAX_COMPETITIVE_XP);

    const session = await Session.create({
      userId: decoded.id,
      mode,
      score: safeScore,
      total: safeTotal,
      xpEarned: safeXp,
    });

    return NextResponse.json(session);
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  await syncDB();

  try {
    const decoded: any = getAuthPayload(req);
    if (!decoded)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const sessions = await Session.findAll({
      where: { userId: decoded.id },
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    return NextResponse.json(sessions);
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
