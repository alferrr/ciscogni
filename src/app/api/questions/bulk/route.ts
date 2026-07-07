import { NextRequest, NextResponse } from "next/server";
import { syncDB } from "@/lib/sync";
import Question from "@/models/Question";
import { Op } from "sequelize";
import { shuffleArray, shuffleQuestionChoices } from "@/lib/shuffle";
import { getAuthPayload } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await syncDB();

  const decoded = getAuthPayload(req);
  if (!decoded)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const topics = searchParams.get("topics")?.split(",").filter(Boolean) ?? [];
  const parsedCount = parseInt(searchParams.get("count") ?? "10");
  const count = Math.min(Math.max(isNaN(parsedCount) ? 10 : parsedCount, 1), 50);

  if (topics.length === 0) {
    return NextResponse.json(
      { message: "No topics provided" },
      { status: 400 },
    );
  }

  try {
    const questions = await Question.findAll({
      where: {
        topic: { [Op.in]: topics },
      },
    });

    const shuffled = shuffleArray(questions).slice(0, count);

    return NextResponse.json(shuffleQuestionChoices(shuffled));
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
