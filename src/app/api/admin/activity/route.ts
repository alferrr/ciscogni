import { NextRequest, NextResponse } from "next/server";
import { Op, WhereOptions } from "sequelize";
import { isAdminRequest } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import ActivityLog from "@/models/ActivityLog";

export const dynamic = "force-dynamic";

const MAX_PER_PAGE = 100;

export async function GET(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const params = req.nextUrl.searchParams;
  const page = Math.max(parseInt(params.get("page") ?? "1") || 1, 1);
  const perPage = Math.min(
    Math.max(parseInt(params.get("perPage") ?? "50") || 50, 1),
    MAX_PER_PAGE,
  );

  const where: WhereOptions[] = [];
  const category = params.get("category");
  if (category) where.push({ category });
  const userId = parseInt(params.get("userId") ?? "");
  if (!isNaN(userId)) where.push({ userId });
  const from = params.get("from");
  const to = params.get("to");
  if (from && !isNaN(Date.parse(from)))
    where.push({ createdAt: { [Op.gte]: new Date(from) } });
  if (to && !isNaN(Date.parse(to)))
    where.push({ createdAt: { [Op.lt]: new Date(to) } });
  const q = params.get("q")?.trim();
  if (q) {
    const like = `%${q.replace(/[%_\\]/g, "\\$&")}%`;
    where.push({
      [Op.or]: [
        { userName: { [Op.like]: like } },
        { action: { [Op.like]: like } },
        { target: { [Op.like]: like } },
        { details: { [Op.like]: like } },
        { ip: { [Op.like]: like } },
      ],
    });
  }

  const { rows, count } = await ActivityLog.findAndCountAll({
    where: where.length ? { [Op.and]: where } : {},
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    limit: perPage,
    offset: (page - 1) * perPage,
  });

  const categories = (
    await ActivityLog.findAll({
      attributes: ["category"],
      group: ["category"],
      order: [["category", "ASC"]],
    })
  ).map((r) => r.getDataValue("category"));

  return NextResponse.json({
    logs: rows,
    total: count,
    page,
    perPage,
    totalPages: Math.max(Math.ceil(count / perPage), 1),
    categories,
  });
}
