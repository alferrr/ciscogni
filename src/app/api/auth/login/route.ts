import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";
import AllowedStudent from "@/models/AllowedStudent";
import { Op } from "sequelize";

export async function POST(req: NextRequest) {
  await syncDB();

  try {
    const { studentId, password } = await req.json();

    // check if student is allowed
    const allowed = await AllowedStudent.findOne({ where: { studentId } });
    if (!allowed) {
      return NextResponse.json(
        { message: "Student ID not found in the system." },
        { status: 403 },
      );
    }

    const name = allowed.getDataValue("name");

    // extract last name for default password
    const nameParts = name.split(" ");
    const lastName = nameParts[nameParts.length - 1]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const defaultPassword = `${lastName}${studentId}`;

    // check if account exists, if not create it
    let user = await User.findOne({
      where: {
        [Op.or]: [{ studentId }, { email: `${studentId}@usc.edu.ph` }],
      },
    });

    if (!user) {
      const hashed = await bcrypt.hash(defaultPassword, 10);
      user = await User.create({
        name,
        email: `${studentId}@usc.edu.ph`,
        studentId,
        password: hashed,
        course: "",
        year: "",
      });
    } else if (!user.getDataValue("studentId")) {
      await user.update({ studentId });
    }

    // verify password
    const valid = await bcrypt.compare(password, user.getDataValue("password"));
    if (!valid) {
      return NextResponse.json(
        { message: "Incorrect password." },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      {
        id: user.getDataValue("id"),
        studentId: user.getDataValue("studentId"),
        role: user.getDataValue("role"),
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    const res = NextResponse.json({
      message: "Login successful.",
      token,
      user: {
        id: user.getDataValue("id"),
        name: user.getDataValue("name"),
        email: user.getDataValue("email"),
        studentId: user.getDataValue("studentId"),
        course: user.getDataValue("course"),
        year: user.getDataValue("year"),
        xp: user.getDataValue("xp"),
        streak: user.getDataValue("streak"),
        role: user.getDataValue("role"),
      },
    });

    res.cookies.set("token", token, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Server error.", error: String(err) },
      { status: 500 },
    );
  }
}
