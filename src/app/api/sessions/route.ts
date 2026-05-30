import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { syncDB } from "@/lib/sync";
import Session from "@/models/Session";

export async function POST(req: NextRequest) {
  await syncDB();

  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
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
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

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
