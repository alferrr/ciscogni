import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { syncDB } from "@/lib/sync";

export async function POST(req: NextRequest) {
  await syncDB();
  try {
    const { name, email, password, year, course } = await req.json();

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "Email already in use." },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, year, course });

    return NextResponse.json(
      { message: "Account created successfully." },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Server error.", error: err },
      { status: 500 },
    );
  }
}
