# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Students** of the University of San Carlos (USC) taking Programming 1 and Programming 2, across BSIT, BSCS, BSIS and BSDS. They use it to review for midterms and finals in short sessions, and mostly on phones.
- **Admins** are the student dev team who run the platform. They add and edit questions, manage users, and review activity and student quiz results.

## Product Purpose
Ciscogni is a gamified practice platform that turns exam review into short, repeatable multiple-choice quiz sessions (output prediction, bug detection, logic tracing, concepts). Success is students coming back to practice and improving their accuracy before exams.

## Positioning
Built for USC courses: questions follow USC Programming 1 and 2 midterm and finals coverage, and registration is gated to students pre-listed in an allowed-students table. XP, streaks, achievements and a class leaderboard keep students returning.

## Operating Context
- Students: practice mode (by topic), competitive mode (timed, Midterms or Finals scope), daily challenge (5 random questions, extends streak, grace day), leaderboard, progress breakdown, profile and achievements.
- Admins: admin panel for classes, questions (including bulk import), users, SEO settings, a checklist and a UI preview. The Activity Logs page lists plain-English events and opens a finished quiz as a "Question Review" page with every answer.
- Hosted at ciscogni.dcism.org, deployed by pulling `main` on the server (`deploy.sh`) and restarting PM2.

## Capabilities and Constraints
- Next.js 16 (App Router), React 19, TypeScript; Sequelize on MariaDB/MySQL; JWT in an HTTP-only cookie.
- The database schema is not auto-migrated (`sync({ alter: false })`), so avoid column changes unless necessary and tell the user to run any needed `ALTER TABLE` themselves.
- Student privacy: collect and show the minimum. Activity logs deliberately do not record IP addresses, browser user agents, free-form details or individual answer events.
- Quiz answers are stored per attempt but not linked to a quiz run; the admin result view matches them by user and time.

## Brand Commitments
Name: Ciscogni. Existing light/dark theme toggle and typefaces (DM Sans, Inter) are in use.

## Evidence on Hand
Question banks for Programming 1 and 2 (midterms and finals) seeded from `src/lib/seed.ts` and the `*_seed.sql` files. No testimonials, usage metrics or case studies are on hand; do not invent them.

## Product Principles
1. Short sessions beat long ones: students review between classes, so every flow must be quick to start and finish.
2. Gamification serves exam readiness, not the other way around.
3. Show admins what they need and no more: readable plain-English information, minimal personal data.
4. Mobile first for students; admins are on desktop.
5. Accuracy of content is the product: wrong or ambiguous questions cost trust.

## Accessibility & Inclusion
Readable contrast and keyboard-operable controls are expected. No formal standard has been required.
