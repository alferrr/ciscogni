import { NextRequest, NextResponse } from "next/server";
import { syncDB } from "@/lib/sync";
import { getAuthPayload } from "@/lib/auth";
import PageView from "@/models/PageView";

export async function POST(req: NextRequest) {
  await syncDB();

  try {
    const { path } = await req.json();
    if (!path || typeof path !== "string") {
      return NextResponse.json({ message: "Invalid path" }, { status: 400 });
    }

    const decoded = getAuthPayload(req);
    await PageView.create({
      path: path.slice(0, 255),
      userId: decoded?.id ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
