import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import Attempt from "@/models/Attempt";
import User from "@/models/User";
import Question from "@/models/Question";
import { competitiveXP } from "@/lib/xp";
import { logActivity, actorFromUser } from "@/lib/activity";

export async function POST(req: NextRequest) {
  await syncDB();

  try {
    const decoded: any = getAuthPayload(req);
    if (!decoded)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { questionId, selectedAnswer, timeLeft } = await req.json();

    const question = await Question.findOne({ where: { id: questionId } });
    if (!question)
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 },
      );

    const isCorrect = question.getDataValue("correctAnswer") === selectedAnswer;

    // XP is computed here, never accepted from the client. Only timed
    // (competitive) attempts send a `timeLeft`; practice/daily award no XP
    // per attempt (daily XP comes from the streak endpoint).
    const xpGained =
      typeof timeLeft === "number" ? competitiveXP(timeLeft, isCorrect) : 0;

    await Attempt.create({
      userId: decoded.id,
      questionId,
      selectedAnswer,
      isCorrect,
    });

    const user = xpGained > 0
      ? await User.findOne({ where: { id: decoded.id } })
      : null;
    if (user) {
      await user.update({ xp: user.getDataValue("xp") + xpGained });
    }

    await logActivity(req, {
      action:
        typeof timeLeft === "number"
          ? "quiz.competitive_answer"
          : "quiz.practice_answer",
      actor: user ? actorFromUser(user) : { id: decoded.id, role: decoded.role },
      target: `question #${questionId}`,
      details: {
        topic: question.getDataValue("topic"),
        selectedAnswer,
        correctAnswer: question.getDataValue("correctAnswer"),
        isCorrect,
        xpGained,
        ...(typeof timeLeft === "number" ? { timeLeft } : {}),
      },
    });

    return NextResponse.json({
      isCorrect,
      correctAnswer: question.getDataValue("correctAnswer"),
      explanation: question.getDataValue("explanation"),
      xpGained,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
