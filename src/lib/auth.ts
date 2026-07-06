import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

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
