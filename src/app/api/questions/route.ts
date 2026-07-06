import { NextRequest, NextResponse } from "next/server";
import { syncDB } from "@/lib/sync";
import { Op } from "sequelize";
import Question from "@/models/Question";
import { shuffleQuestionChoices } from "@/lib/shuffle";

export async function GET(req: NextRequest) {
  await syncDB();

  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");
  const mode = searchParams.get("mode");
  const topics = searchParams.get("topics");

  const where: any = {};
  if (topic) where.topic = topic;
  if (mode) where.mode = mode;
  if (topics) where.topic = { [Op.in]: topics.split(",") };

  const questions = await Question.findAll({ where });
  return NextResponse.json(shuffleQuestionChoices(questions));
}
