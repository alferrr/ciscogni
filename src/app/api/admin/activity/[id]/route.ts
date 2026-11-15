import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import { getQuizResult } from "@/lib/quizResult";

export const dynamic = "force-dynamic";

// Full quiz result (score + every answer) for a "finished a quiz" log entry.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const id = parseInt((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  const result = await getQuizResult(id);
  if (!result)
    return NextResponse.json({ message: "No result found" }, { status: 404 });
  return NextResponse.json(result);
}
