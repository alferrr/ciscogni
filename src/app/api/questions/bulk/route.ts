import { NextRequest, NextResponse } from "next/server";
import { syncDB } from "@/lib/sync";
import Question from "@/models/Question";
import { Op } from "sequelize";

export async function GET(req: NextRequest) {
  await syncDB();

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

    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return NextResponse.json(shuffled.slice(0, count));
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
