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
