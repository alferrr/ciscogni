import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";
import AllowedStudent from "@/models/AllowedStudent";

export async function POST(req: NextRequest) {
  await syncDB();

  try {
    const { studentId, course, year } = await req.json();

    // check if student is allowed
    const allowed = await AllowedStudent.findOne({ where: { studentId } });
    if (!allowed) {
      return NextResponse.json(
        { message: "Student ID not found in the system." },
        { status: 403 },
      );
    }

    // check if already registered
    const existing = await User.findOne({ where: { studentId } });
    if (existing) {
      return NextResponse.json(
        { message: "This student ID is already registered." },
        { status: 400 },
      );
    }

    const name = allowed.getDataValue("name");

    // extract last name for password
    const nameParts = name.split(" ");
    const lastName = nameParts[nameParts.length - 1]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const defaultPassword = `${lastName}${studentId}`;
    const hashed = await bcrypt.hash(defaultPassword, 10);

    const email = `${studentId}@usc.edu.ph`;

    await User.create({
      name,
      email,
      studentId,
      password: hashed,
      course,
      year,
    });

    return NextResponse.json(
      { message: "Account created successfully." },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Server error.", error: String(err) },
      { status: 500 },
    );
  }
}
