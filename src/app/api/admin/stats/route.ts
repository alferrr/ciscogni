import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import { isAdminRequest } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import sequelize from "@/lib/db";
import User from "@/models/User";
import Question from "@/models/Question";
import Attempt from "@/models/Attempt";

export async function GET(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const [userCount, students, teachers, admins, questionCount, typeCounts] =
    await Promise.all([
      User.count(),
      User.count({ where: { role: "student" } }),
      User.count({ where: { role: "teacher" } }),
      User.count({ where: { role: "admin" } }),
      Question.count(),
      Question.findAll({
        attributes: [
          "type",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        group: ["type"],
        raw: true,
      }),
    ]);

  const rangeStart = new Date();
  rangeStart.setDate(rangeStart.getDate() - 6);
  rangeStart.setHours(0, 0, 0, 0);

  const dailyRows = (await Attempt.findAll({
    attributes: [
      [sequelize.fn("DATE", sequelize.col("createdAt")), "day"],
      [sequelize.fn("COUNT", sequelize.col("id")), "attempts"],
      [sequelize.fn("SUM", sequelize.col("isCorrect")), "correct"],
    ],
    where: { createdAt: { [Op.gte]: rangeStart } },
    group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
    raw: true,
  })) as unknown as { day: string; attempts: string; correct: string }[];

  const daily = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(rangeStart);
    d.setDate(rangeStart.getDate() + i);
    const key = d.toISOString().split("T")[0];
    const row = dailyRows.find(
      (r) => new Date(r.day).toISOString().split("T")[0] === key,
    );
    const attempts = row ? Number(row.attempts) : 0;
    const correct = row ? Number(row.correct) : 0;
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      attempts,
      accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
    };
  });

  return NextResponse.json({
    totals: {
      users: userCount,
      students,
      teachers,
      admins,
      questions: questionCount,
    },
    typeBreakdown: (typeCounts as unknown as { type: string; count: string }[]).map(
      (t) => ({ type: t.type, count: Number(t.count) }),
    ),
    daily,
  });
}
