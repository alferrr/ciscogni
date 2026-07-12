import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import { syncDB } from "@/lib/sync";
import { getAuthPayload } from "@/lib/auth";
import Attempt from "@/models/Attempt";
import Question from "@/models/Question";
import { shuffleArray, shuffleQuestionChoices } from "@/lib/shuffle";

export async function GET(req: NextRequest) {
  await syncDB();

  const decoded: any = getAuthPayload(req);
  if (!decoded)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const topics = searchParams.get("topics")?.split(",").filter(Boolean) ?? [];
  const parsedCount = parseInt(searchParams.get("count") ?? "20");
  const count = Math.min(Math.max(isNaN(parsedCount) ? 20 : parsedCount, 1), 50);

  try {
    // Walk the user's attempts oldest-first so the map ends holding the most
    // recent result per question. A question is only a "mistake" if the latest
    // attempt on it was wrong — one they've since gotten right drops off.
    const attempts = (await Attempt.findAll({
      where: { userId: decoded.id },
      attributes: ["questionId", "isCorrect"],
      order: [
        ["createdAt", "ASC"],
        ["id", "ASC"],
      ],
      raw: true,
    })) as unknown as { questionId: number; isCorrect: boolean }[];

    const lastCorrectById = new Map<number, boolean>();
    for (const a of attempts) lastCorrectById.set(a.questionId, !!a.isCorrect);

    const missedIds = [...lastCorrectById.entries()]
      .filter(([, correct]) => !correct)
      .map(([id]) => id);

    if (missedIds.length === 0) return NextResponse.json([]);

    const where: Record<string, unknown> = { id: { [Op.in]: missedIds } };
    if (topics.length) where.topic = { [Op.in]: topics };

    const questions = await Question.findAll({ where });
    const shuffled = shuffleArray(questions).slice(0, count);

    return NextResponse.json(shuffleQuestionChoices(shuffled));
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
