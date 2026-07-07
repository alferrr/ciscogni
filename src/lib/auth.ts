import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { syncDB } from "./sync";
import User from "@/models/User";

// Returns the decoded token payload, or null if the token is
// missing, expired, or invalid (routes should respond with 401).
export const getAuthPayload = (req: NextRequest): any | null => {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
};

// Verifies the session and loads the corresponding user row.
// Returns null if the token is missing/invalid or the user no longer exists.
export const getAuthedUser = async (req: NextRequest) => {
  const decoded = getAuthPayload(req);
  if (!decoded) return null;
  await syncDB();
  return User.findOne({ where: { id: decoded.id } });
};

export const isAdminRequest = async (req: NextRequest) => {
  const user = await getAuthedUser(req);
  return user?.getDataValue("role") === "admin";
};
