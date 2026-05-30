import { NextResponse } from "next/server";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";

export async function GET() {
  await syncDB();

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
