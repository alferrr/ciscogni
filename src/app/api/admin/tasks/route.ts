import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import AdminTask from "@/models/AdminTask";

export async function GET(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const tasks = await AdminTask.findAll({ order: [["createdAt", "DESC"]] });
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { text } = await req.json();
  if (!text || !String(text).trim())
    return NextResponse.json({ message: "Text is required" }, { status: 400 });

  const task = await AdminTask.create({ text: String(text).trim() });
  return NextResponse.json(task, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id, ...body } = await req.json();
  const updates: Record<string, unknown> = {};
  if ("done" in body) updates.done = Boolean(body.done);
  if ("text" in body) updates.text = String(body.text).trim();

  await AdminTask.update(updates, { where: { id } });
  return NextResponse.json({ message: "Task updated." });
}

export async function DELETE(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  await AdminTask.destroy({ where: { id } });
  return NextResponse.json({ message: "Task deleted." });
}
