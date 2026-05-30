import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { syncDB } from "@/lib/sync";
import Attempt from "@/models/Attempt";
import Session from "@/models/Session";
import Question from "@/models/Question";
import "@/models/associations";

export async function GET(req: NextRequest) {
  await syncDB();

  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const attempts = await Attempt.findAll({
      where: { userId: decoded.id },
      include: [
        {
          model: Question,
          as: "question",
          attributes: ["topic", "type", "difficulty"],
        },
      ],
    });

    const sessions = await Session.findAll({
      where: { userId: decoded.id },
      order: [["createdAt", "DESC"]],
    });

    const totalAnswered = attempts.length;
    const totalCorrect = attempts.filter((a) =>
      a.getDataValue("isCorrect"),
    ).length;
    const accuracy =
      totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    // accuracy per topic
    const topicMap: Record<string, { correct: number; total: number }> = {};
    attempts.forEach((a) => {
      const topic = a.getDataValue("question")?.topic ?? "unknown";
      if (!topicMap[topic]) topicMap[topic] = { correct: 0, total: 0 };
      topicMap[topic].total++;
      if (a.getDataValue("isCorrect")) topicMap[topic].correct++;
    });

    const topicStats = Object.entries(topicMap).map(([topic, stats]) => ({
      topic,
      correct: stats.correct,
      total: stats.total,
      accuracy: Math.round((stats.correct / stats.total) * 100),
    }));

    // accuracy per type
    const typeMap: Record<string, { correct: number; total: number }> = {};
    attempts.forEach((a) => {
      const type = a.getDataValue("question")?.type ?? "unknown";
      if (!typeMap[type]) typeMap[type] = { correct: 0, total: 0 };
      typeMap[type].total++;
      if (a.getDataValue("isCorrect")) typeMap[type].correct++;
    });

    const typeStats = Object.entries(typeMap).map(([type, stats]) => ({
      type,
      correct: stats.correct,
      total: stats.total,
      accuracy: Math.round((stats.correct / stats.total) * 100),
    }));

    return NextResponse.json({
      totalAnswered,
      totalCorrect,
      accuracy,
      topicStats,
      typeStats,
      sessions,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
