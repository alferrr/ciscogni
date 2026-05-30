import sequelize from "./db";
import Question from "../models/Question";
import "../models/Attempt";
import "../models/User";

const questions = [
  {
    type: "output_prediction",
    topic: "loops",
    difficulty: "easy",
    questionText: "What is the output of this code?",
    codeSnippet: `for (int i = 0; i < 3; i++) {\n  printf("%d\\n", i);\n}`,
    choices: ["0 1 2", "1 2 3", "0 1 2 3", "1 2"],
    correctAnswer: "0 1 2",
    explanation:
      "The loop starts at 0 and runs while i < 3, printing 0, 1, and 2.",
  },
  {
    type: "bug_detection",
    topic: "loops",
    difficulty: "easy",
    questionText: "What is the bug in this code?",
    codeSnippet: `for (int i = 0; i <= 5; i--) {\n  printf("%d\\n", i);\n}`,
    choices: [
      "i-- should be i++",
      "i <= 5 should be i < 5",
      "printf is wrong",
      "No bug",
    ],
    correctAnswer: "i-- should be i++",
    explanation:
      "i-- decrements i forever, causing an infinite loop. It should be i++.",
  },
  {
    type: "output_prediction",
    topic: "conditionals",
    difficulty: "easy",
    questionText: "What does this print?",
    codeSnippet: `int x = 10;\nif (x > 5) {\n  printf("A");\n} else {\n  printf("B");\n}`,
    choices: ["A", "B", "AB", "Nothing"],
    correctAnswer: "A",
    explanation:
      "x is 10 which is greater than 5, so the if block runs and prints A.",
  },
  {
    type: "logic_tracing",
    topic: "arrays",
    difficulty: "medium",
    questionText: "What is the value of sum after this loop?",
    codeSnippet: `int arr[] = {1, 2, 3, 4, 5};\nint sum = 0;\nfor (int i = 0; i < 5; i++) {\n  sum += arr[i];\n}`,
    choices: ["10", "15", "14", "5"],
    correctAnswer: "15",
    explanation: "The loop adds all elements: 1+2+3+4+5 = 15.",
  },
  {
    type: "concept",
    topic: "functions",
    difficulty: "easy",
    questionText: "What is the purpose of a return statement in a function?",
    codeSnippet: null,
    choices: [
      "To stop the program",
      "To send a value back to the caller",
      "To declare a variable",
      "To call another function",
    ],
    correctAnswer: "To send a value back to the caller",
    explanation:
      "A return statement ends the function and optionally sends a value back to wherever the function was called.",
  },
  {
    type: "output_prediction",
    topic: "functions",
    difficulty: "medium",
    questionText: "What is printed?",
    codeSnippet: `int add(int a, int b) {\n  return a + b;\n}\nprintf("%d", add(3, 4));`,
    choices: ["7", "34", "3", "4"],
    correctAnswer: "7",
    explanation: "add(3, 4) returns 3 + 4 = 7, which is then printed.",
  },
  {
    type: "bug_detection",
    topic: "conditionals",
    difficulty: "medium",
    questionText: "What is wrong with this code?",
    codeSnippet: `int x = 5;\nif (x = 10) {\n  printf("Equal");\n}`,
    choices: [
      "= should be ==",
      "printf is missing a semicolon",
      "x should be a float",
      "Nothing is wrong",
    ],
    correctAnswer: "= should be ==",
    explanation:
      "= is assignment, not comparison. == should be used to compare values.",
  },
  {
    type: "logic_tracing",
    topic: "loops",
    difficulty: "medium",
    questionText: "How many times does this loop run?",
    codeSnippet: `int count = 0;\nfor (int i = 1; i <= 10; i += 2) {\n  count++;\n}`,
    choices: ["5", "10", "4", "6"],
    correctAnswer: "5",
    explanation: "i goes 1, 3, 5, 7, 9 — that's 5 iterations.",
  },
];

const seed = async () => {
  await sequelize.sync({ alter: true });
  await Question.bulkCreate(questions as any);
  console.log("Seeded questions successfully.");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
