import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { syncDB } from "@/lib/sync";
import Question from "@/models/Question";
import User from "@/models/User";

const isAdmin = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return false;
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findOne({ where: { id: decoded.id } });
    return user?.getDataValue("role") === "admin";
  } catch {
    return false;
  }
};

export async function GET(req: NextRequest) {
  await syncDB();
  if (!(await isAdmin(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const questions = await Question.findAll({ order: [["id", "DESC"]] });
  return NextResponse.json(questions);
}

export async function POST(req: NextRequest) {
  await syncDB();
  if (!(await isAdmin(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const question = await Question.create(body);
  return NextResponse.json(question, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  await syncDB();
  if (!(await isAdmin(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  await Question.destroy({ where: { id } });
  return NextResponse.json({ message: "Question deleted." });
}

export async function PUT(req: NextRequest) {
  await syncDB();
  if (!(await isAdmin(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id, ...updates } = await req.json();
  await Question.update(updates, { where: { id } });
  return NextResponse.json({ message: "Question updated." });
}
