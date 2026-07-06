import { NextRequest, NextResponse } from "next/server";
import { syncDB } from "@/lib/sync";
import Question from "@/models/Question";
import User from "@/models/User";
import { getAuthPayload } from "@/lib/auth";
import sequelize from "@/lib/db";
import { shuffleQuestionChoices } from "@/lib/shuffle";

export async function GET(req: NextRequest) {
  await syncDB();

  try {
    const decoded: any = getAuthPayload(req);
    if (!decoded)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const today = new Date().toISOString().split("T")[0];
    const lastDaily = user.getDataValue("lastDailyAt");

    if (lastDaily === today) {
      return NextResponse.json({ alreadyTaken: true }, { status: 200 });
    }

    const questions = await Question.findAll({
      order: sequelize.literal("RAND()"),
      limit: 5,
    });

    return NextResponse.json({
      alreadyTaken: false,
      questions: shuffleQuestionChoices(questions),
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
