import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import Session from "@/models/Session";

export async function POST(req: NextRequest) {
  await syncDB();

  try {
    const decoded: any = getAuthPayload(req);
    if (!decoded)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { mode, score, total, xpEarned } = await req.json();

    const session = await Session.create({
      userId: decoded.id,
      mode,
      score,
      total,
      xpEarned,
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
