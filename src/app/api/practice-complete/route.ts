import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import { clamp } from "@/lib/xp";
import Session from "@/models/Session";
import { logActivity } from "@/lib/activity";

const MAX_QUESTIONS = 100;

// Practice awards no XP, but the final score is stored as a Session row so
// admins can review it under Quiz Results.
export async function POST(req: NextRequest) {
  await syncDB();

  try {
    const decoded: any = getAuthPayload(req);
    if (!decoded)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { classId, score, total } = await req.json();
    const safeTotal = clamp(total, 0, MAX_QUESTIONS);
    const safeScore = clamp(score, 0, safeTotal);

    await Session.create({
      userId: decoded.id,
      mode: "practice",
      score: safeScore,
      total: safeTotal,
      xpEarned: 0,
    });

    await logActivity(req, {
      action: "quiz.practice_complete",
      actor: { id: decoded.id, role: decoded.role },
      target: typeof classId === "string" ? classId.slice(0, 64) : null,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
