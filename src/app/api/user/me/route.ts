import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";
import { Op } from "sequelize";

export async function GET(req: NextRequest) {
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

    // one grace day: streak only breaks after missing 2 full days
    if (
      lastDaily &&
      lastDaily !== today &&
      lastDaily !== yesterday &&
      lastDaily !== twoDaysAgo
    ) {
      await user.update({ streak: 0 });
    }

    const rank = await User.count({
      where: {
        xp: {
          [Op.gt]: user.getDataValue("xp"),
        },
      },
    });

    return NextResponse.json({
      id: user.getDataValue("id"),
      name: user.getDataValue("name"),
      email: user.getDataValue("email"),
      xp: user.getDataValue("xp"),
      streak: user.getDataValue("streak"),
      rank: rank + 1,
      year: user.getDataValue("year"),
      course: user.getDataValue("course"),
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
