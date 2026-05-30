import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";
import { Op } from "sequelize";

export async function GET(req: NextRequest) {
  await syncDB();

  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    const lastDaily = user.getDataValue("lastDailyAt");

    // if last daily was not today and not yesterday, streak is broken
    if (lastDaily && lastDaily !== today && lastDaily !== yesterday) {
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
