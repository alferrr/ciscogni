import { NextRequest, NextResponse } from "next/server";
import { Op, WhereOptions } from "sequelize";
import { isAdminRequest } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import Session from "@/models/Session";
import User from "@/models/User";

export const dynamic = "force-dynamic";

const MAX_PER_PAGE = 100;
const MODES = ["practice", "midterms", "finals"];

export async function GET(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const params = req.nextUrl.searchParams;
  const page = Math.max(parseInt(params.get("page") ?? "1") || 1, 1);
  const perPage = Math.min(
    Math.max(parseInt(params.get("perPage") ?? "20") || 20, 1),
    MAX_PER_PAGE,
  );

  const where: WhereOptions[] = [];
  const mode = params.get("mode");
  if (mode && MODES.includes(mode)) where.push({ mode });
  const q = params.get("q")?.trim();
  if (q) {
    const like = `%${q.replace(/[%_\\]/g, "\\$&")}%`;
    where.push({
      [Op.or]: [
        { "$user.name$": { [Op.like]: like } },
        { "$user.studentId$": { [Op.like]: like } },
      ],
    });
  }

  const { rows, count } = await Session.findAndCountAll({
    where: where.length ? { [Op.and]: where } : {},
    include: [
      {
        model: User,
        as: "user",
        attributes: ["name", "studentId", "course"],
        required: true,
      },
    ],
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    limit: perPage,
    offset: (page - 1) * perPage,
    subQuery: false,
  });

  const results = rows.map((r) => {
    const user = r.get("user") as {
      getDataValue: (k: string) => string | null;
    } | null;
    return {
      id: r.getDataValue("id"),
      createdAt: r.getDataValue("createdAt"),
      mode: r.getDataValue("mode"),
      score: r.getDataValue("score"),
      total: r.getDataValue("total"),
      name: user?.getDataValue("name") ?? null,
      studentId: user?.getDataValue("studentId") ?? null,
      course: user?.getDataValue("course") ?? null,
    };
  });

  return NextResponse.json({
    results,
    total: count,
    page,
    perPage,
    totalPages: Math.max(Math.ceil(count / perPage), 1),
  });
}
