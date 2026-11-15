import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import Question from "@/models/Question";
import { logActivity } from "@/lib/activity";

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
  await logActivity(req, {
    action: "admin.question_create",
    target: `question #${(question as any).id}`,
  });
  return NextResponse.json(question, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  await Question.destroy({ where: { id } });
  await logActivity(req, {
    action: "admin.question_delete",
    target: `question #${id}`,
  });
  return NextResponse.json({ message: "Question deleted." });
}

export async function PUT(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id, ...updates } = await req.json();
  await Question.update(updates, { where: { id } });
  await logActivity(req, {
    action: "admin.question_update",
    target: `question #${id}`,
  });
  return NextResponse.json({ message: "Question updated." });
}
