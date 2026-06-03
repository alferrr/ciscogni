import { NextRequest, NextResponse } from "next/server";
import { syncDB } from "@/lib/sync";
import Question from "@/models/Question";
import { Op } from "sequelize";

export async function GET(req: NextRequest) {
  await syncDB();

  const { searchParams } = new URL(req.url);
  const topics = searchParams.get("topics")?.split(",") ?? [];
  const count = Math.min(parseInt(searchParams.get("count") ?? "10"), 50);
  const mode = searchParams.get("mode") ?? "practice";

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
        mode,
      },
    });

    let pool = [...questions];

    if (questions.length < count) {
      while (pool.length < count) {
        pool = [...pool, ...questions];
      }
    }

    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, count);

    return NextResponse.json(shuffled);
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
