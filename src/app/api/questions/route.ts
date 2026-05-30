import { NextRequest, NextResponse } from "next/server";
import { syncDB } from "@/lib/sync";
import Question from "@/models/Question";

export async function GET(req: NextRequest) {
  await syncDB();

  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");
  const mode = searchParams.get("mode");
  const difficulty = searchParams.get("difficulty");

  const where: any = {};
  if (topic) where.topic = topic;
  if (difficulty) where.difficulty = difficulty;
  if (mode) where.mode = mode;

  const questions = await Question.findAll({ where });

  return NextResponse.json(questions);
}
