import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";

const isAdmin = async (req: NextRequest) => {
  const decoded: any = getAuthPayload(req);
  if (!decoded) return false;
  const user = await User.findOne({ where: { id: decoded.id } });
  return user?.getDataValue("role") === "admin";
};

export async function GET(req: NextRequest) {
  await syncDB();
  if (!(await isAdmin(req)))
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
  if (!(await isAdmin(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  await User.destroy({ where: { id } });
  return NextResponse.json({ message: "User deleted." });
}
