import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import { isAdminRequest } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import sequelize from "@/lib/db";
import User from "@/models/User";
import Question from "@/models/Question";
import PageView from "@/models/PageView";

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

  const trafficRows = (await PageView.findAll({
    attributes: [
      [sequelize.fn("DATE", sequelize.col("createdAt")), "day"],
      [sequelize.fn("COUNT", sequelize.col("id")), "views"],
      [
        sequelize.fn(
          "COUNT",
          sequelize.fn("DISTINCT", sequelize.col("userId")),
        ),
        "users",
      ],
    ],
    where: { createdAt: { [Op.gte]: rangeStart } },
    group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
    raw: true,
  })) as unknown as { day: string; views: string; users: string }[];

  const traffic = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(rangeStart);
    d.setDate(rangeStart.getDate() + i);
    const key = d.toISOString().split("T")[0];
    const row = trafficRows.find(
      (r) => new Date(r.day).toISOString().split("T")[0] === key,
    );
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      views: row ? Number(row.views) : 0,
      users: row ? Number(row.users) : 0,
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
    traffic,
  });
}
