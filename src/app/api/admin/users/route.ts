import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const users = await User.findAll({
    attributes: [
      "id",
      "name",
      "email",
      "course",
      "year",
      "xp",
      "streak",
      "role",
      "createdAt",
    ],
    order: [["createdAt", "DESC"]],
  });

  return NextResponse.json(users);
}

export async function DELETE(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  await User.destroy({ where: { id } });
  return NextResponse.json({ message: "User deleted." });
}

const EDITABLE_FIELDS = ["name", "role", "course", "year"] as const;
const VALID_ROLES = ["student", "teacher", "admin"];

export async function PUT(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id, ...body } = await req.json();
  const updates: Record<string, unknown> = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in body) updates[field] = body[field];
  }

  if ("role" in updates && !VALID_ROLES.includes(updates.role as string))
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });

  await User.update(updates, { where: { id } });
  return NextResponse.json({ message: "User updated." });
}
