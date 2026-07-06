import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import Attempt from "@/models/Attempt";
import User from "@/models/User";
import Question from "@/models/Question";

export async function POST(req: NextRequest) {
  await syncDB();

  try {
    const decoded: any = getAuthPayload(req);
    if (!decoded)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { questionId, selectedAnswer, xpEarned } = await req.json();

    const question = await Question.findOne({ where: { id: questionId } });
    if (!question)
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 },
      );

    const isCorrect = question.getDataValue("correctAnswer") === selectedAnswer;

    await Attempt.create({
      userId: decoded.id,
      questionId,
      selectedAnswer,
      isCorrect,
    });

    if (isCorrect && xpEarned) {
      const user = await User.findOne({ where: { id: decoded.id } });
      await user?.update({ xp: user.getDataValue("xp") + xpEarned });
    }

    return NextResponse.json({
      isCorrect,
      correctAnswer: question.getDataValue("correctAnswer"),
      explanation: question.getDataValue("explanation"),
      xpGained: xpEarned ?? 0,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
