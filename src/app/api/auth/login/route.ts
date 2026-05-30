import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { syncDB } from "@/lib/sync";

import dotenv from "dotenv";
dotenv.config();

console.log("JWT SECRET:", process.env.JWT_SECRET);

export async function POST(req: NextRequest) {
  await syncDB();
  try {
    const { email, password } = await req.json();

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.getDataValue("password"));
    if (!valid) {
      return NextResponse.json(
        { message: "Incorrect password." },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      { id: user.getDataValue("id"), email: user.getDataValue("email") },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    return NextResponse.json({
      message: "Login successful.",
      token,
      user: {
        id: user.getDataValue("id"),
        name: user.getDataValue("name"),
        email: user.getDataValue("email"),
        xp: user.getDataValue("xp"),
        streak: user.getDataValue("streak"),
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Server error.", error: String(err) },
      { status: 500 },
    );
  }
}
