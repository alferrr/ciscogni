import fs from "fs";
import path from "path";
import { questions } from "../src/lib/seed";

const escape = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

const sqlValue = (value: unknown): string => {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "string") return `'${escape(value)}'`;
  return `'${escape(JSON.stringify(value))}'`;
};

const dsaQuestions = questions.filter((q) => q.topic.startsWith("dsa_"));

const columns = [
  "type",
  "topic",
  "mode",
  "difficulty",
  "questionText",
  "codeSnippet",
  "choices",
  "correctAnswer",
  "explanation",
  "createdAt",
  "updatedAt",
];

const lines: string[] = [];
lines.push("-- DSA Exam 1 question seed");
lines.push("-- Generated from src/lib/seed.ts — do not edit by hand, regenerate instead.");
lines.push("");
lines.push(
  "DELETE FROM `questions` WHERE `mode` = 'practice' AND `topic` LIKE 'dsa\\_%';",
);
lines.push("");

for (const q of dsaQuestions) {
  const values = [
    sqlValue(q.type),
    sqlValue(q.topic),
    sqlValue(q.mode),
    sqlValue(q.difficulty),
    sqlValue(q.questionText),
    sqlValue(q.codeSnippet),
    sqlValue(q.choices),
    sqlValue(q.correctAnswer),
    sqlValue(q.explanation),
    "NOW()",
    "NOW()",
  ];
  lines.push(
    `INSERT INTO \`questions\` (\`${columns.join("`, `")}\`) VALUES (${values.join(", ")});`,
  );
}

const outPath = path.join(__dirname, "..", "dsa_exam1_seed.sql");
fs.writeFileSync(outPath, lines.join("\n") + "\n");
console.log(`Wrote ${dsaQuestions.length} questions to ${outPath}`);
