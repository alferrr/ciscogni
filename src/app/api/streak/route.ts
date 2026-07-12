import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";
import { DAILY_XP_BONUS } from "@/lib/xp";

export async function POST(req: NextRequest) {
  await syncDB();

  try {
    const decoded: any = getAuthPayload(req);
    if (!decoded)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000)
      .toISOString()
      .split("T")[0];
    const lastDaily = user.getDataValue("lastDailyAt");

    // Guard against double claims: the daily reward can only be granted once
    // per calendar day, no matter how many times this endpoint is hit.
    if (lastDaily === today) {
      return NextResponse.json({
        alreadyClaimed: true,
        streak: user.getDataValue("streak"),
        xp: user.getDataValue("xp"),
        xpEarned: 0,
      });
    }

    // Continue the streak if the last claim was yesterday, or the day before
    // (the one-day grace window mirrored from /api/user/me); otherwise it resets.
    const continues = lastDaily === yesterday || lastDaily === twoDaysAgo;
    const newStreak = continues ? user.getDataValue("streak") + 1 : 1;

    await user.update({
      streak: newStreak,
      lastDailyAt: today,
      xp: user.getDataValue("xp") + DAILY_XP_BONUS,
    });

    return NextResponse.json({
      streak: user.getDataValue("streak"),
      xp: user.getDataValue("xp"),
      xpEarned: DAILY_XP_BONUS,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
