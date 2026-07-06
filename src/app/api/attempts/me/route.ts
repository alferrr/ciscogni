import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import Attempt from "@/models/Attempt";
import Question from "@/models/Question";
import "@/models/associations";

export async function GET(req: NextRequest) {
  await syncDB();

  try {
    const decoded: any = getAuthPayload(req);
    if (!decoded)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const attempts = await Attempt.findAll({
      where: { userId: decoded.id },
      include: [
        {
          model: Question,
          as: "question",
          attributes: ["questionText", "type", "topic", "mode"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    return NextResponse.json(attempts);
  } catch (err) {
    console.error("Attempts error:", err);
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
