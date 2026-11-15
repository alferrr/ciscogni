---
version: 1
slug: "src-app-admin-page-tsx"
primary_target: "src/app/admin/page.tsx"
related_targets: ["src/app/admin/AdminShell.tsx"]
---

# Admin dashboard (/admin) and admin shell

Scope: the /admin dashboard page plus the shell that frames every admin page. Visitor mode: Operate.

Audience and task: the student dev team glance at the platform's health (people, questions, quizzes, traffic) and jump to the page they need. Desktop first, must not break on narrow screens. Real data only: users, questions, quiz sessions, page views, the XP leaderboard. No fake notifications, search or earnings.

Pinned by the user: a reference image (soft grey ground, white rounded cards, icon-only left rail, top bar with profile, stat cards with mini bar charts, one large line/area chart, overlapping-bubble breakdown) and Ciscogni's existing blue accent. Panels chosen: stat cards with mini bars, big traffic chart, question-type bubbles plus top students. Scope: the whole admin shell.

## Direction contract

THESIS: One calm, card-based overview where every figure has its own small chart, instead of three link cards over a chart. Refuses the old top pill nav and the stacked "action card" scaffold.

OWN-WORLD: Soft blue-tinted grey ground with white (dark-theme: near-black) rounded cards, 1px hairline borders and a faint soft shadow. Single blue accent for primary data, yellow and coral as highlight colours on the other two stat bars and bubbles. Icon-only rail, 22px radius cards, tabular numerals, the app's existing heading and body faces.

STORY: An admin opens /admin and in seconds sees totals with a week of movement, how traffic is trending, which question types dominate and who is leading, and can reach any admin area from the rail.

FIRST VIEWPORT: Left rail of icons (logo mark on top, back-to-app at the bottom). Top bar with page title area left, admin name and email right. Content: left column of three stat cards (label, icon, big number, 7 bars with the latest highlighted); right of them one large traffic area chart spanning the three rows with a highlighted day and tooltip. Below: shortcut links card, top students card, question-type bubbles card with role totals underneath.

FORM: Operate dashboard grid after the user's reference image; seed: none (pinned), pinned by "I want to redesign the admin dashboard as something like this" with the attached image.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
