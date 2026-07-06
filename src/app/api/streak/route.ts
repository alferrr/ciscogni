import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";

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
    const DAILY_XP_BONUS = 50;
    await user.update({
      streak: user.getDataValue("streak") + 1,
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
