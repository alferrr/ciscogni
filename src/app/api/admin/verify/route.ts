import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  await syncDB();
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    if (user.getDataValue("role") !== "admin")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    return NextResponse.json({ role: user.getDataValue("role") });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
