import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { syncDB } from "@/lib/sync";
import ActivityLog from "@/models/ActivityLog";
import User from "@/models/User";

export type ActivityActor = {
  id?: number | null;
  name?: string | null;
  role?: string | null;
};

export type ActivityEvent = {
  action: string;
  actor?: ActivityActor | null;
  target?: string | number | null;
  details?: Record<string, unknown> | null;
};

const SENSITIVE_KEYS = /pass(word)?|token|secret/i;

const redact = (details: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(details).map(([k, v]) => [
      k,
      SENSITIVE_KEYS.test(k) ? "[redacted]" : v,
    ]),
  );

// Falls back to the request's session cookie when a route doesn't pass an
// actor, and fills in the user's name so the entry survives later deletion.
async function resolveActor(
  req: NextRequest,
  actor: ActivityActor | null | undefined,
): Promise<ActivityActor> {
  let resolved: ActivityActor = actor ?? {};
  if (resolved.id == null) {
    const token = req.cookies.get("token")?.value;
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
        resolved = { id: payload.id, role: payload.role, name: resolved.name };
      } catch {
        // invalid/expired token: log as anonymous
      }
    }
  }
  if (resolved.id != null && !resolved.name) {
    const user = await User.findByPk(resolved.id, {
      attributes: ["name", "role"],
    });
    if (user) {
      resolved = {
        ...resolved,
        name: user.getDataValue("name"),
        role: resolved.role ?? user.getDataValue("role"),
      };
    }
  }
  return resolved;
}

// Records one entry in the activity log. Logging must never break the request
// it describes, so every failure is swallowed (and printed to the server log).
export async function logActivity(req: NextRequest, event: ActivityEvent) {
  try {
    await syncDB();
    const { action, target, details } = event;
    const actor = await resolveActor(req, event.actor);
    await ActivityLog.create({
      userId: actor.id ?? null,
      userName: actor.name?.slice(0, 255) ?? null,
      userRole: actor.role ?? null,
      action,
      category: action.split(".")[0],
      target: target != null ? String(target).slice(0, 255) : null,
      details: details ? JSON.stringify(redact(details)).slice(0, 5000) : null,
      userAgent: req.headers.get("user-agent")?.slice(0, 255) ?? null,
    });
  } catch (err) {
    console.error("Failed to write activity log:", err);
  }
}

// Builds an actor from a Sequelize User row.
export const actorFromUser = (user: {
  getDataValue: (key: string) => any;
}): ActivityActor => ({
  id: user.getDataValue("id"),
  name: user.getDataValue("name"),
  role: user.getDataValue("role"),
});
