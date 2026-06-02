import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";
import Attempt from "@/models/Attempt";
import Question from "@/models/Question";
import "@/models/associations";

const ACHIEVEMENTS = [
  {
    id: "first_blood",
    label: "First Blood",
    description: "Answer your first question correctly.",
    icon: "FaBullseye",
    condition: (stats: any) => stats.totalCorrect >= 1,
  },
  {
    id: "loop_master",
    label: "Loop Master",
    description: "Get 80% accuracy on Loops questions.",
    icon: "FaArrowsRotate",
    condition: (stats: any) => stats.topics?.loops?.accuracy >= 80,
  },
  {
    id: "debug_king",
    label: "Debug King",
    description: "Get 80% accuracy on Bug Detection questions.",
    icon: "FaBug",
    condition: (stats: any) => stats.types?.bug_detection?.accuracy >= 80,
  },
  {
    id: "function_wizard",
    label: "Function Wizard",
    description: "Get 80% accuracy on Functions questions.",
    icon: "FaWandMagicSparkles",
    condition: (stats: any) => stats.topics?.functions?.accuracy >= 80,
  },
  {
    id: "output_oracle",
    label: "Output Oracle",
    description: "Get 80% accuracy on Output Prediction questions.",
    icon: "FaEye",
    condition: (stats: any) => stats.types?.output_prediction?.accuracy >= 80,
  },
  {
    id: "pointer_survivor",
    label: "Pointer Survivor",
    description: "Get 80% accuracy on Arrays & Pointers questions.",
    icon: "FaLocationDot",
    condition: (stats: any) => stats.topics?.arrays_pointers?.accuracy >= 80,
  },
  {
    id: "streak_3",
    label: "On Fire",
    description: "Reach a 3-day streak.",
    icon: "FaFire",
    condition: (stats: any) => stats.streak >= 3,
  },
  {
    id: "streak_7",
    label: "Week Warrior",
    description: "Reach a 7-day streak.",
    icon: "FaSword",
    condition: (stats: any) => stats.streak >= 7,
  },
  {
    id: "xp_100",
    label: "Century",
    description: "Earn 100 XP.",
    icon: "FaStar",
    condition: (stats: any) => stats.xp >= 100,
  },
  {
    id: "xp_500",
    label: "XP Grinder",
    description: "Earn 500 XP.",
    icon: "FaGem",
    condition: (stats: any) => stats.xp >= 500,
  },
  {
    id: "xp_1000",
    label: "Legend",
    description: "Earn 1000 XP.",
    icon: "FaCrown",
    condition: (stats: any) => stats.xp >= 1000,
  },
  {
    id: "answered_50",
    label: "Half Century",
    description: "Answer 50 questions.",
    icon: "FaBook",
    condition: (stats: any) => stats.totalAnswered >= 50,
  },
  {
    id: "answered_100",
    label: "Centurion",
    description: "Answer 100 questions.",
    icon: "FaBookOpen",
    condition: (stats: any) => stats.totalAnswered >= 100,
  },
  {
    id: "perfect_exam",
    label: "Perfect Score",
    description: "Get 100% on a competitive exam.",
    icon: "FaTrophy",
    condition: (stats: any) => stats.perfectExam,
  },
  {
    id: "concept_king",
    label: "Concept King",
    description: "Get 80% accuracy on Concept questions.",
    icon: "FaBrain",
    condition: (stats: any) => stats.types?.concept?.accuracy >= 80,
  },
];

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

    const attempts = await Attempt.findAll({
      where: { userId: decoded.id },
      include: [
        { model: Question, as: "question", attributes: ["topic", "type"] },
      ],
    });

    const totalAnswered = attempts.length;
    const totalCorrect = attempts.filter((a) =>
      a.getDataValue("isCorrect"),
    ).length;

    const topicMap: Record<string, { correct: number; total: number }> = {};
    const typeMap: Record<string, { correct: number; total: number }> = {};

    attempts.forEach((a) => {
      const topic = a.getDataValue("question")?.topic ?? "unknown";
      const type = a.getDataValue("question")?.type ?? "unknown";
      const isCorrect = a.getDataValue("isCorrect");

      if (!topicMap[topic]) topicMap[topic] = { correct: 0, total: 0 };
      topicMap[topic].total++;
      if (isCorrect) topicMap[topic].correct++;

      if (!typeMap[type]) typeMap[type] = { correct: 0, total: 0 };
      typeMap[type].total++;
      if (isCorrect) typeMap[type].correct++;
    });

    const topics: Record<string, any> = {};
    Object.entries(topicMap).forEach(([k, v]) => {
      topics[k] = { ...v, accuracy: Math.round((v.correct / v.total) * 100) };
    });

    const types: Record<string, any> = {};
    Object.entries(typeMap).forEach(([k, v]) => {
      types[k] = { ...v, accuracy: Math.round((v.correct / v.total) * 100) };
    });

    const sessions = await (
      await import("@/models/Session")
    ).default.findAll({
      where: { userId: decoded.id },
    });

    const perfectExam = sessions.some(
      (s) => s.getDataValue("score") === s.getDataValue("total"),
    );

    const stats = {
      totalAnswered,
      totalCorrect,
      xp: user.getDataValue("xp"),
      streak: user.getDataValue("streak"),
      topics,
      types,
      perfectExam,
    };

    const earned = user.getDataValue("achievements") || [];
    const newlyUnlocked: string[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (!earned.includes(achievement.id) && achievement.condition(stats)) {
        earned.push(achievement.id);
        newlyUnlocked.push(achievement.id);
      }
    }

    if (newlyUnlocked.length > 0) {
      await user.update({ achievements: earned });
    }

    const result = ACHIEVEMENTS.map((a) => ({
      ...a,
      condition: undefined,
      unlocked: earned.includes(a.id),
    }));

    return NextResponse.json({ achievements: result, newlyUnlocked });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
