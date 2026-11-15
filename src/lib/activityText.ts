// Turns raw activity log rows into plain-English text for the admin page.

type LogLike = {
  action: string;
  userName: string | null;
  userId: number | null;
  target: string | null;
  details: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  auth: "Sign in & accounts",
  user: "Profile changes",
  quiz: "Quizzes",
  admin: "Admin actions",
};

export const categoryLabel = (c: string) =>
  CATEGORY_LABELS[c] ?? c.charAt(0).toUpperCase() + c.slice(1);

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const parse = (raw: string | null): Record<string, unknown> => {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw);
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
};

const num = (target: string | null) => target?.match(/#(\d+)/)?.[1];

const verdict = (ok: unknown) =>
  ok === true ? " correctly" : ok === false ? " incorrectly" : "";

const modeName = (m: string | null) =>
  m === "competitive" ? "a competitive" : m ? `a ${m}` : "a";

// A full sentence, e.g. "19020241 logged in".
export const describeAction = (l: LogLike): string => {
  const d = parse(l.details);
  const who =
    l.action.startsWith("auth.") && l.target
      ? l.target
      : (l.userName ?? (l.userId ? `User #${l.userId}` : "Someone"));
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
      return `${who} answered a practice question${verdict(d.isCorrect)}`;
    case "quiz.competitive_answer":
      return `${who} answered a competitive question${verdict(d.isCorrect)}`;
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

const KEY_LABELS: Record<string, string> = {
  studentId: "Student ID",
  xpEarned: "XP earned",
  selectedAnswer: "Chose",
  correctAnswer: "Correct answer",
  passwordChanged: "Password changed",
  ogImageUrl: "Share image",
};

const humanKey = (k: string) =>
  KEY_LABELS[k] ??
  k
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

const humanValue = (v: unknown): string => {
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.join(", ");
  if (v && typeof v === "object") return JSON.stringify(v);
  return String(v);
};

// Short, readable extra info shown beside the sentence.
export const describeDetails = (l: LogLike): string => {
  const d = parse(l.details);
  if (!l.details) return "";
  if (Object.keys(d).length === 0) return l.details;

  if (
    ["quiz.practice_complete", "quiz.session_complete"].includes(l.action) &&
    d.score != null &&
    d.total != null
  ) {
    const xp = d.xpEarned ? ` · +${d.xpEarned} XP` : "";
    return `Score ${d.score}/${d.total}${xp}`;
  }
  if (l.action === "quiz.daily_claim")
    return `${d.streak}-day streak · +${d.xpEarned} XP`;
  if (l.action.endsWith("_change") && d.from != null)
    return `${d.from} → ${d.to}`;
  if (l.action === "auth.login_failed" && d.reason)
    return String(d.reason).replace(/^./, (c) => c.toUpperCase());

  return Object.entries(d)
    .map(([k, v]) => `${humanKey(k)}: ${humanValue(v)}`)
    .join(" · ");
};
