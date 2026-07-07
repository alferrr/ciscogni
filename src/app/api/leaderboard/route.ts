import { NextRequest, NextResponse } from "next/server";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";
import { getAuthPayload } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await syncDB();

  const decoded = getAuthPayload(req);
  if (!decoded)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const users = await User.findAll({
      attributes: ["id", "name", "course", "year", "xp", "streak"],
      order: [["xp", "DESC"]],
      limit: 20,
    });

    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
