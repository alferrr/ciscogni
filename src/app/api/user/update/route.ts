import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";

export async function PUT(req: NextRequest) {
  await syncDB();

  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const { name, course, year, currentPassword, newPassword } =
      await req.json();

    const updates: any = { name, course, year };

    if (currentPassword && newPassword) {
      const valid = await bcrypt.compare(
        currentPassword,
        user.getDataValue("password"),
      );
      if (!valid)
        return NextResponse.json(
          { message: "Current password is incorrect." },
          { status: 400 },
        );
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    await user.update(updates);

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: {
        id: user.getDataValue("id"),
        name: user.getDataValue("name"),
        email: user.getDataValue("email"),
        course: user.getDataValue("course"),
        year: user.getDataValue("year"),
        xp: user.getDataValue("xp"),
        streak: user.getDataValue("streak"),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
