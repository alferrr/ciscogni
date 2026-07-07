import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import Question from "@/models/Question";

export async function GET(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const questions = await Question.findAll({ order: [["id", "DESC"]] });
  return NextResponse.json(questions);
}

export async function POST(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const question = await Question.create(body);
  return NextResponse.json(question, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  await Question.destroy({ where: { id } });
  return NextResponse.json({ message: "Question deleted." });
}

export async function PUT(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id, ...updates } = await req.json();
  await Question.update(updates, { where: { id } });
  return NextResponse.json({ message: "Question updated." });
}
