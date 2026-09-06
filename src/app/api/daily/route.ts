import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import { syncDB } from "@/lib/sync";
import Question from "@/models/Question";
import User from "@/models/User";
import Attempt from "@/models/Attempt";
import { getAuthPayload } from "@/lib/auth";
import sequelize from "@/lib/db";
import { shuffleQuestionChoices } from "@/lib/shuffle";
import { CLASSES } from "@/config/classes";

// 1st years are still on Programming 1; everyone else has moved on to
// Programming 2 (and DSA, once it has content).
function topicsForYear(year: string) {
  const classIds = parseInt(year, 10) <= 1 ? ["prog1"] : ["prog2", "dsa"];
  return CLASSES.filter((c) => classIds.includes(c.id)).flatMap((c) =>
    c.topics.map((t) => t.id),
  );
}

export async function GET(req: NextRequest) {
  await syncDB();

  try {
    const decoded: any = getAuthPayload(req);
    if (!decoded)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const today = new Date().toISOString().split("T")[0];
    const lastDaily = user.getDataValue("lastDailyAt");

    if (lastDaily === today) {
      return NextResponse.json({ alreadyTaken: true }, { status: 200 });
    }

    const topics = topicsForYear(user.getDataValue("year"));
    const baseWhere = topics.length ? { topic: { [Op.in]: topics } } : {};

    const attempts = await Attempt.findAll({
      where: { userId: decoded.id },
      attributes: ["questionId"],
    });
    const attemptedIds = attempts.map((a) => a.getDataValue("questionId"));

    // Prefer questions the student hasn't seen yet.
    const fresh = await Question.findAll({
      where: attemptedIds.length
        ? { ...baseWhere, id: { [Op.notIn]: attemptedIds } }
        : baseWhere,
      order: sequelize.literal("RAND()"),
      limit: 5,
    });

    // Top off with previously-seen questions if the unseen pool runs short
    // (e.g. a topic with few questions, or a student who's answered most of it).
    let questions = fresh;
    if (questions.length < 5) {
      const excludeIds = questions.map((q) => q.getDataValue("id"));
      const fallback = await Question.findAll({
        where: {
          ...baseWhere,
          ...(excludeIds.length ? { id: { [Op.notIn]: excludeIds } } : {}),
        },
        order: sequelize.literal("RAND()"),
        limit: 5 - questions.length,
      });
      questions = [...questions, ...fallback];
    }

    return NextResponse.json({
      alreadyTaken: false,
      questions: shuffleQuestionChoices(questions),
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
