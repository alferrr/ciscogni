// Turns raw activity log rows into plain-English text for the admin page.

type LogLike = {
  action: string;
  studentId?: string | null;
  userName: string | null;
  userId: number | null;
  target: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  auth: "Sign in & accounts",
  user: "Profile changes",
  quiz: "Quizzes",
  admin: "Admin actions",
};

export const categoryLabel = (c: string) =>
  CATEGORY_LABELS[c] ?? c.charAt(0).toUpperCase() + c.slice(1);

// e.g. 11/15/2026, 1:40:40 PM
export const formatTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

const num = (target: string | null) => target?.match(/#(\d+)/)?.[1];

const modeName = (m: string | null) =>
  m === "competitive" ? "a competitive" : m ? `a ${m}` : "a";

const whoLabel = (l: LogLike): string => {
  const sid =
    l.studentId ?? (l.action.startsWith("auth.") ? l.target : null) ?? null;
  const name = l.userName ?? (l.userId ? `User #${l.userId}` : null);
  if (sid && name) return `[${sid} - ${name}]`;
  if (sid || name) return `[${sid ?? name}]`;
  return "[Anonymous]";
};

const ACTION_TYPES: Record<string, string> = {
  "auth.login": "Session start",
  "auth.login_failed": "Login failed",
  "auth.register": "Sign up",
  "auth.account_activated": "Activation",
  "user.profile_update": "Profile update",
  "user.password_change": "Password change",
  "user.password_change_failed": "Password failed",
  "user.course_change": "Course change",
  "user.year_change": "Year change",
  "quiz.practice_answer": "Practice answer",
  "quiz.competitive_answer": "Competitive answer",
  "quiz.practice_complete": "Practice done",
  "quiz.session_complete": "Session done",
  "quiz.daily_claim": "Daily reward",
  "admin.build_logs_view": "View logs",
};

// Short badge label, e.g. "SESSION START".
export const actionType = (action: string): string => {
  if (ACTION_TYPES[action]) return ACTION_TYPES[action].toUpperCase();
  const [cat, ...rest] = action.split(".");
  return (rest.join(" ") || cat).replace(/_/g, " ").toUpperCase();
};

// A full sentence, e.g. "[19020241 - Ann Lee] logged in."
const sentence = (l: LogLike): string => {
  const who = whoLabel(l);
  const id = num(l.target);

  switch (l.action) {
    case "auth.login":
      return `${who} logged in`;
    case "auth.login_failed":
      return `${who} failed to log in`;
    case "auth.register":
      return `${who} created an account`;
    case "auth.account_activated":
      return `${who} activated their account`;
    case "user.profile_update":
      return `${who} updated their profile`;
    case "user.password_change":
      return `${who} changed their password`;
    case "user.password_change_failed":
      return `${who} failed to change their password`;
    case "user.course_change":
      return `${who} changed their course`;
    case "user.year_change":
      return `${who} changed their year level`;
    case "quiz.practice_answer":
      return `${who} answered a practice question`;
    case "quiz.competitive_answer":
      return `${who} answered a competitive question`;
    case "quiz.practice_complete":
      return `${who} finished a practice quiz`;
    case "quiz.session_complete":
      return `${who} finished ${modeName(l.target)} session`;
    case "quiz.daily_claim":
      return `${who} claimed their daily reward`;
    case "admin.question_create":
      return `${who} added a question`;
    case "admin.question_update":
      return `${who} edited question ${id ? `#${id}` : ""}`.trim();
    case "admin.question_delete":
      return `${who} deleted question ${id ? `#${id}` : ""}`.trim();
    case "admin.task_create":
      return `${who} added a task`;
    case "admin.task_update":
      return `${who} edited task ${id ? `#${id}` : ""}`.trim();
    case "admin.task_delete":
      return `${who} deleted task ${id ? `#${id}` : ""}`.trim();
    case "admin.user_update":
      return `${who} edited user ${id ? `#${id}` : ""}`.trim();
    case "admin.user_delete":
      return `${who} deleted user ${id ? `#${id}` : ""}`.trim();
    case "admin.seo_update":
      return `${who} updated the SEO settings`;
    case "admin.seo_upload":
      return `${who} uploaded an SEO image`;
    case "admin.build_logs_view":
      return `${who} viewed the build logs`;
    default: {
      const words = l.action.split(".").pop()!.replace(/_/g, " ");
      return `${who}: ${words}`;
    }
  }
};

export const describeAction = (l: LogLike): string => `${sentence(l)}.`;
