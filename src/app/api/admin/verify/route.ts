import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  await syncDB();
  try {
    const decoded: any = getAuthPayload(req);
    if (!decoded)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
