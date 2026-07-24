import { Op } from "sequelize";
import sequelize from "./db";
import Question from "../models/Question";
import "../models/Attempt";
import "../models/User";

const SEED_TOPIC_IDS = [
  // Programming 1
  "intro_programming",
  "c_structure",
  "functions",
  "builtin_functions",
  "control_structure_1",
  "control_structure_2",
  "testing_debugging",
  "arrays_pointers",
  // Programming 2 (sample)
  "pointers_arrays",
  "dynamic_memory",
  "sorting_searching",
];

const questions = [
  {
    type: "concept",
    topic: "intro_programming",
    mode: "practice",
    difficulty: "easy",
    questionText: "Which of these is required for every C program to run?",
    codeSnippet: null,
    choices: ["a main() function", "a loop", "a printf statement", "an array"],
    correctAnswer: "a main() function",
    explanation:
      "Execution of a C program always begins at the main() function; it's the required entry point.",
  },
  {
    type: "output_prediction",
    topic: "c_structure",
    mode: "practice",
    difficulty: "easy",
    questionText: "What is the output of this code?",
    codeSnippet: `int a = 7;\nint b = 2;\nprintf("%d", a / b);`,
    choices: ["3", "3.5", "1", "0"],
    correctAnswer: "3",
    explanation:
      "Both operands are integers, so integer division truncates the result: 7 / 2 = 3.",
  },
  {
    type: "concept",
    topic: "functions",
    mode: "practice",
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
    mode: "practice",
    difficulty: "medium",
    questionText: "What is printed?",
    codeSnippet: `int add(int a, int b) {\n  return a + b;\n}\nprintf("%d", add(3, 4));`,
    choices: ["7", "34", "3", "4"],
    correctAnswer: "7",
    explanation: "add(3, 4) returns 3 + 4 = 7, which is then printed.",
  },
  {
    type: "concept",
    topic: "builtin_functions",
    mode: "practice",
    difficulty: "easy",
    questionText: "Which header must be included to use printf() and scanf()?",
    codeSnippet: null,
    choices: ["<stdio.h>", "<stdlib.h>", "<string.h>", "<math.h>"],
    correctAnswer: "<stdio.h>",
    explanation:
      "printf() and scanf() are standard input/output functions declared in <stdio.h>.",
  },
  {
    type: "bug_detection",
    topic: "control_structure_1",
    mode: "practice",
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
    type: "output_prediction",
    topic: "control_structure_1",
    mode: "practice",
    difficulty: "easy",
    questionText: "What does this print?",
    codeSnippet: `int x = 10;\nif (x > 5) {\n  printf("A");\n} else {\n  printf("B");\n}`,
    choices: ["A", "B", "AB", "Nothing"],
    correctAnswer: "A",
    explanation:
      "x is 10 which is greater than 5, so the if block runs and prints A.",
  },
  {
    type: "output_prediction",
    topic: "control_structure_2",
    mode: "practice",
    difficulty: "easy",
    questionText: "What is the output of this code?",
    codeSnippet: `for (int i = 0; i < 3; i++) {\n  printf("%d\\n", i);\n}`,
    choices: ["0 1 2", "1 2 3", "0 1 2 3", "1 2"],
    correctAnswer: "0 1 2",
    explanation:
      "The loop starts at 0 and runs while i < 3, printing 0, 1, and 2.",
  },
  {
    type: "logic_tracing",
    topic: "control_structure_2",
    mode: "practice",
    difficulty: "medium",
    questionText: "How many times does this loop run?",
    codeSnippet: `int count = 0;\nfor (int i = 1; i <= 10; i += 2) {\n  count++;\n}`,
    choices: ["5", "10", "4", "6"],
    correctAnswer: "5",
    explanation: "i goes 1, 3, 5, 7, 9 — that's 5 iterations.",
  },
  {
    type: "bug_detection",
    topic: "testing_debugging",
    mode: "practice",
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
    type: "logic_tracing",
    topic: "arrays_pointers",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the value of sum after this loop?",
    codeSnippet: `int arr[] = {1, 2, 3, 4, 5};\nint sum = 0;\nfor (int i = 0; i < 5; i++) {\n  sum += arr[i];\n}`,
    choices: ["10", "15", "14", "5"],
    correctAnswer: "15",
    explanation: "The loop adds all elements: 1+2+3+4+5 = 15.",
  },
  // Programming 2 samples
  {
    type: "output_prediction",
    topic: "pointers_arrays",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the output of this code?",
    codeSnippet: `int x = 5;\nint *p = &x;\n*p = 10;\nprintf("%d", x);`,
    choices: ["5", "10", "0", "Address of x"],
    correctAnswer: "10",
    explanation:
      "p points to x, and *p = 10 writes through the pointer, changing x to 10.",
  },
  {
    type: "concept",
    topic: "dynamic_memory",
    mode: "practice",
    difficulty: "easy",
    questionText: "Which function is used to free dynamically allocated memory in C?",
    codeSnippet: null,
    choices: ["free()", "delete()", "release()", "malloc()"],
    correctAnswer: "free()",
    explanation:
      "free() releases memory previously allocated with malloc(), calloc(), or realloc().",
  },
  {
    type: "concept",
    topic: "sorting_searching",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the worst-case time complexity of bubble sort?",
    codeSnippet: null,
    choices: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
    correctAnswer: "O(n^2)",
    explanation:
      "Bubble sort compares each pair repeatedly across n passes, giving O(n^2) in the worst case.",
  },
];

const seed = async () => {
  await sequelize.sync({ alter: true });
  // Re-runnable: clear prior seed rows for these topics before inserting fresh ones.
  await Question.destroy({
    where: { mode: "practice", topic: { [Op.in]: SEED_TOPIC_IDS } },
  });
  await Question.bulkCreate(questions as unknown as Record<string, unknown>[]);
  console.log("Seeded questions successfully.");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
