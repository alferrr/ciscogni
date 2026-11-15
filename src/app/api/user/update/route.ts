import { NextRequest, NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/auth";
import bcrypt from "bcrypt";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";
import { logActivity, actorFromUser } from "@/lib/activity";

export async function PUT(req: NextRequest) {
  await syncDB();

  try {
    const decoded: any = getAuthPayload(req);
    if (!decoded)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const { name, course, year, currentPassword, newPassword } =
      await req.json();

    const updates: any = { name, course, year };
    const before = {
      name: user.getDataValue("name"),
      course: user.getDataValue("course"),
      year: user.getDataValue("year"),
    };
    const actor = actorFromUser(user);

    if (currentPassword && newPassword) {
      const valid = await bcrypt.compare(
        currentPassword,
        user.getDataValue("password"),
      );
      if (!valid) {
        await logActivity(req, {
          action: "user.password_change_failed",
          actor,
        });
        return NextResponse.json(
          { message: "Current password is incorrect." },
          { status: 400 },
        );
      }
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    await user.update(updates);

    await logActivity(req, {
      action: "user.profile_update",
      actor,
    });
    if ("password" in updates) {
      await logActivity(req, { action: "user.password_change", actor });
    }
    if (course !== before.course) {
      await logActivity(req, {
        action: "user.course_change",
        actor,
      });
    }
    if (year !== before.year) {
      await logActivity(req, {
        action: "user.year_change",
        actor,
      });
    }

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
