import { NextRequest, NextResponse } from "next/server";
import { getAuthedUser } from "@/lib/auth";
import { syncDB } from "@/lib/sync";

export async function GET(req: NextRequest) {
  await syncDB();
  try {
    const user = await getAuthedUser(req);
    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (user.getDataValue("role") !== "admin")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    return NextResponse.json({ role: user.getDataValue("role") });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
