import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";
import { getAuthPayload } from "@/lib/auth";

const ATTRIBUTES = ["id", "name", "course", "year", "xp", "streak"] as const;

export async function GET(req: NextRequest) {
  await syncDB();

  const decoded = getAuthPayload(req);
  if (!decoded)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab") ?? "xp";
    const metric = tab === "streak" ? "streak" : "xp";

    const me = await User.findOne({
      where: { id: decoded.id },
      attributes: [...ATTRIBUTES],
    });
    if (!me)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    // "year" scopes the board to the caller's own cohort; xp/streak stay global.
    const scopeWhere = tab === "year" ? { year: me.getDataValue("year") } : {};

    // Rank is a single COUNT query (indexed comparison), not a full-table fetch.
    const [top, higherCount] = await Promise.all([
      User.findAll({
        where: scopeWhere,
        attributes: [...ATTRIBUTES],
        order: [[metric, "DESC"]],
        limit: 10,
      }),
      User.count({
        where: {
          ...scopeWhere,
          [metric]: { [Op.gt]: me.getDataValue(metric) },
        },
      }),
    ]);

    return NextResponse.json({
      top,
      me: { ...me.toJSON(), rank: higherCount + 1 },
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
