# Ciscogni

Ciscogni is a gamified practice platform for USC (University of San Carlos) students taking **Programming 1** and **Programming 2**. It turns exam review into short, repeatable quiz sessions — multiple-choice questions on output prediction, bug detection, logic tracing, and concepts — with XP, streaks, achievements, and a class leaderboard to keep students coming back.

## Features

- **Practice mode** — drill questions by topic (e.g. Control Structures, Pointers & Arrays, Linked Lists) at your own pace.
- **Competitive mode** — timed, exam-style sessions scoped to a class's Midterms or Finals coverage.
- **Daily challenge** — 5 random questions per day; completing it extends your streak and awards bonus XP. Missing a day can be covered by a grace day.
- **XP, streaks & achievements** — points and unlockable badges (e.g. "Loop Master", "Debug King", "Week Warrior") based on accuracy, volume, and streak milestones.
- **Leaderboard** — ranks students by XP within their class.
- **Progress tracking** — per-topic and per-question-type accuracy breakdown.
- **Admin panel** — manage classes, questions (including bulk import), and users; verify admin access separately from regular login.
- **Gated registration** — only students pre-listed in an allowed-students table can register; an account is created automatically with a default password derived from their name and student ID, using their `@usc.edu.ph` address.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Sequelize](https://sequelize.org) on MariaDB/MySQL
- JWT-based auth (`jsonwebtoken` + `bcrypt`), issued as an HTTP-only cookie and checked in `middleware.ts` for protected routes
- react-icons for topic/achievement iconography

## Project structure

```
src/
  app/
    api/            REST endpoints (auth, questions, attempts, sessions, daily, streak, achievements, leaderboard, progress, admin)
    admin/           Admin UI: classes, questions, users
    practice/        Practice mode, per-class
    competitive/     Competitive (exam) mode, per-class
    daily/           Daily challenge
    dashboard/       Student home
    leaderboard/     Class rankings
    profile/         User profile & achievements
    progress/        Accuracy/stats breakdown
    login/, register/, onboarding/
  components/        Header, Sidebar, Toast, Loader, Skeleton, ThemeToggle, etc.
  config/classes.ts  Class/topic/mode definitions (Programming 1, Programming 2, ...)
  context/           Theme and Toast React contexts
  lib/                db connection, auth helpers, question-choice shuffling, DB sync, seeding
  models/             Sequelize models: User, Question, Attempt, Session, AllowedStudent
```

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in your database credentials and a JWT secret:
   ```bash
   cp .env.example .env.local
   ```
3. Seed the database with question data (Programming 1/2 midterms & finals):
   ```bash
   npm run seed
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description                              |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Start the Next.js dev server              |
| `npm run build` | Production build                          |
| `npm run start` | Start the production server               |
| `npm run lint`  | Run ESLint                                |
| `npm run seed`  | Seed the database with questions          |

## Deployment

`deploy.sh` pulls the latest `main`, installs dependencies, builds, and restarts the app under PM2 (process name `ciscogni`).
