import { NextResponse } from "next/server";
import { syncDB } from "@/lib/sync";
import Question from "@/models/Question";

const questions = [
  // ─── ADT LIST ───────────────────────────────────────────────────────
  {
    type: "concept",
    topic: "adt_list",
    mode: "finals",
    difficulty: "easy",
    questionText:
      "What is the time complexity of traversing all elements in an array-based ADT List?",
    codeSnippet: null,
    choices: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
    correctAnswer: "O(n)",
    explanation: "Traversal visits every element once — O(n).",
  },
  {
    type: "logic_tracing",
    topic: "adt_list",
    mode: "finals",
    difficulty: "easy",
    questionText:
      "What is the element count after deleting from a list of 5 elements?",
    codeSnippet: `// List: [10, 20, 30, 40, 50], count=5\n// Delete element at index 3`,
    choices: ["4", "5", "3", "0"],
    correctAnswer: "4",
    explanation: "One deletion reduces the count by 1. 5 - 1 = 4.",
  },
  {
    type: "output_prediction",
    topic: "adt_list",
    mode: "finals",
    difficulty: "medium",
    questionText: "What is the list after inserting 77 at index 2?",
    codeSnippet: `// List: [10, 20, 30, 40], count=4, capacity=10`,
    choices: [
      "{10, 20, 77, 30, 40}",
      "{10, 77, 20, 30, 40}",
      "{77, 10, 20, 30, 40}",
      "{10, 20, 30, 77, 40}",
    ],
    correctAnswer: "{10, 20, 77, 30, 40}",
    explanation:
      "Elements from index 2 are shifted right. 77 is placed at index 2.",
  },
  {
    type: "logic_tracing",
    topic: "adt_list",
    mode: "finals",
    difficulty: "medium",
    questionText:
      "How many shifts are needed to insert at index 0 in a list of 5 elements?",
    codeSnippet: null,
    choices: ["5", "4", "1", "0"],
    correctAnswer: "5",
    explanation: "All 5 elements must shift right to make room at index 0.",
  },
  {
    type: "logic_tracing",
    topic: "adt_list",
    mode: "finals",
    difficulty: "medium",
    questionText:
      "What is the list after deleting the element at the last position?",
    codeSnippet: `// List: [5, 10, 15, 20], count=4`,
    choices: [
      "{5, 10, 15}, count=3",
      "{5, 10, 15, 20}, count=4",
      "{5, 15, 20}, count=3",
      "{10, 15, 20}, count=3",
    ],
    correctAnswer: "{5, 10, 15}, count=3",
    explanation:
      "Deleting the last element just decrements count — no shifting needed.",
  },
  {
    type: "concept",
    topic: "adt_list",
    mode: "finals",
    difficulty: "medium",
    questionText:
      "What is the time complexity of deleting the last element of an array-based ADT List?",
    codeSnippet: null,
    choices: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: "O(1)",
    explanation:
      "Deleting the last element just decrements count — no shifting required.",
  },
  {
    type: "logic_tracing",
    topic: "adt_list",
    mode: "finals",
    difficulty: "hard",
    questionText:
      "After deleting all occurrences of 3, what is the list and count?",
    codeSnippet: `// List: [3, 1, 3, 2, 3, 4], count=6`,
    choices: [
      "{1, 2, 4}, count=3",
      "{1, 3, 2, 4}, count=4",
      "{3, 1, 2, 4}, count=4",
      "{1, 2, 3, 4}, count=4",
    ],
    correctAnswer: "{1, 2, 4}, count=3",
    explanation: "All three 3s are removed. Remaining: {1, 2, 4}, count=3.",
  },
  {
    type: "concept",
    topic: "adt_list",
    mode: "finals",
    difficulty: "hard",
    questionText:
      "What is the worst case time complexity of deleting all occurrences of a value in an array list?",
    codeSnippet: null,
    choices: ["O(n²)", "O(n)", "O(1)", "O(n log n)"],
    correctAnswer: "O(n²)",
    explanation:
      "Each deletion may require O(n) shifting, and there could be O(n) occurrences — worst case O(n²).",
  },

  // ─── LINKED LIST ────────────────────────────────────────────────────
  {
    type: "output_prediction",
    topic: "linked_list",
    mode: "finals",
    difficulty: "easy",
    questionText:
      "What is the value of head->data after inserting 5 at the front?",
    codeSnippet: `// List: 10 -> 20 -> NULL\n// Insert 5 at front`,
    choices: ["5", "10", "20", "NULL"],
    correctAnswer: "5",
    explanation: "The new node 5 becomes the new head.",
  },
  {
    type: "concept",
    topic: "linked_list",
    mode: "finals",
    difficulty: "easy",
    questionText: "What value does the last node's next pointer hold?",
    codeSnippet: null,
    choices: ["NULL", "0", "Address of first node", "Address of itself"],
    correctAnswer: "NULL",
    explanation:
      "The last node's next pointer is NULL, indicating the end of the list.",
  },
  {
    type: "output_prediction",
    topic: "linked_list",
    mode: "finals",
    difficulty: "medium",
    questionText: "What is printed?",
    codeSnippet: `typedef struct Node { int data; struct Node *next; } Node;\nNode d = {40, NULL};\nNode c = {30, &d};\nNode b = {20, &c};\nNode a = {10, &b};\nNode *curr = &a;\nwhile (curr->next != NULL) curr = curr->next;\nprintf("%d", curr->data);`,
    choices: ["40", "10", "30", "20"],
    correctAnswer: "40",
    explanation:
      "The loop traverses to the last node. The last node has data = 40.",
  },
  {
    type: "output_prediction",
    topic: "linked_list",
    mode: "finals",
    difficulty: "medium",
    questionText: "What is printed?",
    codeSnippet: `typedef struct Node { int data; struct Node *next; } Node;\nNode c = {30, NULL};\nNode b = {20, &c};\nNode a = {10, &b};\nNode *curr = &a;\nint sum = 0;\nwhile (curr) { sum += curr->data; curr = curr->next; }\nprintf("%d", sum);`,
    choices: ["60", "30", "10", "20"],
    correctAnswer: "60",
    explanation: "10 + 20 + 30 = 60.",
  },
  {
    type: "logic_tracing",
    topic: "linked_list",
    mode: "finals",
    difficulty: "medium",
    questionText: "What is the list after deleting the last node?",
    codeSnippet: `// List: 10 -> 20 -> 30 -> NULL`,
    choices: [
      "10 -> 20 -> NULL",
      "20 -> 30 -> NULL",
      "10 -> 30 -> NULL",
      "10 -> NULL",
    ],
    correctAnswer: "10 -> 20 -> NULL",
    explanation:
      "The last node (30) is removed. The second-to-last node (20) now points to NULL.",
  },
  {
    type: "concept",
    topic: "linked_list",
    mode: "finals",
    difficulty: "medium",
    questionText: "What does the member() operation on a linked list do?",
    codeSnippet: null,
    choices: [
      "Checks if a value exists in the list",
      "Counts the number of nodes",
      "Returns the head node",
      "Removes a node",
    ],
    correctAnswer: "Checks if a value exists in the list",
    explanation:
      "member() traverses the list and returns true if the given value is found.",
  },
  {
    type: "output_prediction",
    topic: "linked_list",
    mode: "finals",
    difficulty: "medium",
    questionText:
      "What is printed after inserting 25 after node with value 20?",
    codeSnippet: `// List: 10 -> 20 -> 30 -> NULL\n// Insert 25 after 20\n// Traversal output after insertion`,
    choices: ["10 20 25 30", "10 25 20 30", "25 10 20 30", "10 20 30 25"],
    correctAnswer: "10 20 25 30",
    explanation:
      "25 is inserted between 20 and 30: 20->next = new node (25), new node->next = 30.",
  },
  {
    type: "bug_detection",
    topic: "linked_list",
    mode: "finals",
    difficulty: "medium",
    questionText: "What is wrong with this insertion?",
    codeSnippet: `Node *newNode = malloc(sizeof(Node));\nnewNode->data = 5;\nnewNode->next = head;\nhead = newNode;`,
    choices: [
      "Nothing — this correctly inserts at the front",
      "newNode->next should be NULL",
      "head is not updated",
      "malloc is wrong",
    ],
    correctAnswer: "Nothing — this correctly inserts at the front",
    explanation:
      "This is the standard front insertion pattern: new node points to old head, head updates to new node.",
  },
  {
    type: "logic_tracing",
    topic: "linked_list",
    mode: "finals",
    difficulty: "hard",
    questionText: "What is the list after sorting values in ascending order?",
    codeSnippet: `// List: 50 -> 10 -> 40 -> 20 -> 30 -> NULL\n// Sort values only`,
    choices: [
      "10 -> 20 -> 30 -> 40 -> 50",
      "50 -> 40 -> 30 -> 20 -> 10",
      "10 -> 40 -> 20 -> 30 -> 50",
      "20 -> 10 -> 30 -> 40 -> 50",
    ],
    correctAnswer: "10 -> 20 -> 30 -> 40 -> 50",
    explanation:
      "Sorting values only rearranges data inside nodes. Ascending: 10, 20, 30, 40, 50.",
  },
  {
    type: "output_prediction",
    topic: "linked_list",
    mode: "finals",
    difficulty: "hard",
    questionText: "What is printed?",
    codeSnippet: `typedef struct Node { int data; struct Node *next; } Node;\nNode **pp;\nNode c = {3, NULL};\nNode b = {2, &c};\nNode a = {1, &b};\npp = &(&a);\nprintf("%d", (*pp)->data);`,
    choices: ["1", "2", "3", "Error"],
    correctAnswer: "1",
    explanation:
      "pp points to the pointer to a. *pp = &a. (*pp)->data = a.data = 1.",
  },
  {
    type: "concept",
    topic: "linked_list",
    mode: "finals",
    difficulty: "hard",
    questionText:
      "What is the advantage of pointer-to-pointer traversal over regular pointer traversal?",
    codeSnippet: null,
    choices: [
      "It allows modifying the previous pointer directly, eliminating special cases for head deletion",
      "It is faster",
      "It uses less memory",
      "It supports doubly linked lists",
    ],
    correctAnswer:
      "It allows modifying the previous pointer directly, eliminating special cases for head deletion",
    explanation:
      "With Node **curr, you can uniformly handle deletion at any position including head without extra if-checks.",
  },

  // ─── FILE OPERATIONS ────────────────────────────────────────────────
  {
    type: "output_prediction",
    topic: "file_operations",
    mode: "finals",
    difficulty: "easy",
    questionText:
      "What mode appends data to an existing file without erasing it?",
    codeSnippet: null,
    choices: ['"a"', '"w"', '"r"', '"r+"'],
    correctAnswer: '"a"',
    explanation:
      '"a" mode opens for appending. Existing content is preserved and new data is added at the end.',
  },
  {
    type: "concept",
    topic: "file_operations",
    mode: "finals",
    difficulty: "easy",
    questionText: "What does fclose() do?",
    codeSnippet: null,
    choices: [
      "Flushes and closes the file, freeing associated resources",
      "Deletes the file",
      "Rewinds to the beginning",
      "Opens the file for reading",
    ],
    correctAnswer: "Flushes and closes the file, freeing associated resources",
    explanation:
      "fclose() flushes any buffered data, closes the file, and frees the FILE structure.",
  },
  {
    type: "output_prediction",
    topic: "file_operations",
    mode: "finals",
    difficulty: "medium",
    questionText: "What is printed after reading back the written integer?",
    codeSnippet: `int x = 42;\nFILE *fp = fopen("test.bin", "wb");\nfwrite(&x, sizeof(int), 1, fp);\nfclose(fp);\nint y;\nfp = fopen("test.bin", "rb");\nfread(&y, sizeof(int), 1, fp);\nfclose(fp);\nprintf("%d", y);`,
    choices: ["42", "0", "Garbage", "Error"],
    correctAnswer: "42",
    explanation:
      "fwrite writes 42 to the file. fread reads it back into y. printf prints 42.",
  },
  {
    type: "output_prediction",
    topic: "file_operations",
    mode: "finals",
    difficulty: "medium",
    questionText:
      "What does fseek(fp, 2 * sizeof(int), SEEK_SET) do in a file of integers?",
    codeSnippet: null,
    choices: [
      "Moves to the third integer record",
      "Moves to the second integer record",
      "Moves to the end",
      "Moves back by 2 integers",
    ],
    correctAnswer: "Moves to the third integer record",
    explanation:
      "Skipping 2 * sizeof(int) bytes from start positions at the third integer (index 2).",
  },
  {
    type: "bug_detection",
    topic: "file_operations",
    mode: "finals",
    difficulty: "medium",
    questionText: "What is wrong?",
    codeSnippet: `FILE *fp = fopen("data.txt", "r");\nif (fp == NULL) return;\nfwrite("Hello", 5, 1, fp);\nfclose(fp);`,
    choices: [
      "File is opened in read mode but fwrite is used — should be write mode",
      "fwrite syntax is wrong",
      "Missing NULL check",
      "Nothing is wrong",
    ],
    correctAnswer:
      "File is opened in read mode but fwrite is used — should be write mode",
    explanation:
      '"r" opens for reading only. Writing to a read-only file pointer is undefined behavior.',
  },
  {
    type: "logic_tracing",
    topic: "file_operations",
    mode: "finals",
    difficulty: "hard",
    questionText:
      "How many Student records does this file contain after writing?",
    codeSnippet: `typedef struct { int id; float gpa; } Student;\nStudent students[] = {{1,3.9},{2,3.5},{3,2.8},{4,3.1}};\nFILE *fp = fopen("students.bin","wb");\nfwrite(students, sizeof(Student), 4, fp);\nfclose(fp);`,
    choices: ["4", "1", "8", "16"],
    correctAnswer: "4",
    explanation:
      "fwrite with count=4 writes all 4 Student structs to the file.",
  },
  {
    type: "output_prediction",
    topic: "file_operations",
    mode: "finals",
    difficulty: "hard",
    questionText: "What is printed?",
    codeSnippet: `typedef struct { int id; int score; } Record;\nRecord r = {3, 95};\nFILE *fp = fopen("rec.bin","wb");\nfwrite(&r, sizeof(Record), 1, fp);\nfclose(fp);\nRecord out;\nfp = fopen("rec.bin","rb");\nfread(&out, sizeof(Record), 1, fp);\nfclose(fp);\nprintf("%d %d", out.id, out.score);`,
    choices: ["3 95", "0 0", "95 3", "Error"],
    correctAnswer: "3 95",
    explanation:
      "The struct is written then read back. out.id=3 and out.score=95.",
  },
  {
    type: "concept",
    topic: "file_operations",
    mode: "finals",
    difficulty: "hard",
    questionText: "What is the purpose of fseek with SEEK_CUR?",
    codeSnippet: null,
    choices: [
      "Moves the file position relative to the current position",
      "Moves to the beginning",
      "Moves to the end",
      "Reads the current position",
    ],
    correctAnswer: "Moves the file position relative to the current position",
    explanation:
      "SEEK_CUR offsets from where the file pointer currently is. Positive moves forward, negative moves back.",
  },

  // ─── MIXED REVIEW ───────────────────────────────────────────────────
  {
    type: "concept",
    topic: "linked_list",
    mode: "finals",
    difficulty: "easy",
    questionText: "How do you dynamically allocate a new linked list node?",
    codeSnippet: null,
    choices: [
      "Node *n = malloc(sizeof(Node));",
      "Node n = new Node();",
      "Node *n = calloc(Node);",
      "Node n = malloc(Node);",
    ],
    correctAnswer: "Node *n = malloc(sizeof(Node));",
    explanation:
      "malloc(sizeof(Node)) allocates enough memory for one Node struct.",
  },
  {
    type: "output_prediction",
    topic: "linked_list",
    mode: "finals",
    difficulty: "medium",
    questionText: "What is printed?",
    codeSnippet: `typedef struct Node { int data; struct Node *next; } Node;\nNode *head = NULL;\nfor (int i = 1; i <= 3; i++) {\n  Node *n = malloc(sizeof(Node));\n  n->data = i * 10;\n  n->next = head;\n  head = n;\n}\nNode *curr = head;\nwhile (curr) { printf("%d ", curr->data); curr = curr->next; }`,
    choices: ["30 20 10", "10 20 30", "10 30 20", "Error"],
    correctAnswer: "30 20 10",
    explanation:
      "Each new node is inserted at the front. After inserting 10, 20, 30 — the list is 30->20->10.",
  },
  {
    type: "logic_tracing",
    topic: "adt_list",
    mode: "finals",
    difficulty: "medium",
    questionText:
      "What is the list after updating index 1 to 99 and deleting index 3?",
    codeSnippet: `// List: [10, 20, 30, 40, 50], count=5`,
    choices: [
      "{10, 99, 30, 50}, count=4",
      "{10, 99, 30, 40}, count=4",
      "{10, 20, 30, 50}, count=4",
      "{99, 20, 30, 50}, count=4",
    ],
    correctAnswer: "{10, 99, 30, 50}, count=4",
    explanation:
      "Update index 1: {10,99,30,40,50}. Delete index 3 (40): shift left → {10,99,30,50}, count=4.",
  },
  {
    type: "concept",
    topic: "file_operations",
    mode: "finals",
    difficulty: "medium",
    questionText:
      "What is the correct way to read all Student records from a binary file?",
    codeSnippet: null,
    choices: [
      "Use fread in a loop until it returns 0",
      "Use fscanf in a loop",
      "Use gets() in a loop",
      "Use fseek only",
    ],
    correctAnswer: "Use fread in a loop until it returns 0",
    explanation:
      "fread returns the number of items read. When it returns 0, end of file is reached.",
  },
  {
    type: "output_prediction",
    topic: "linked_list",
    mode: "finals",
    difficulty: "hard",
    questionText: "What is the list after deleting all nodes with even values?",
    codeSnippet: `// List: 1 -> 2 -> 3 -> 4 -> 5 -> NULL`,
    choices: [
      "1 -> 3 -> 5 -> NULL",
      "2 -> 4 -> NULL",
      "1 -> 2 -> 3 -> NULL",
      "3 -> 5 -> NULL",
    ],
    correctAnswer: "1 -> 3 -> 5 -> NULL",
    explanation:
      "Nodes with values 2 and 4 are deleted. Remaining: 1 -> 3 -> 5.",
  },
  {
    type: "logic_tracing",
    topic: "file_operations",
    mode: "finals",
    difficulty: "hard",
    questionText:
      "What is printed after seeking to the 3rd record and reading it?",
    codeSnippet: `typedef struct { int val; } Rec;\n// File contains: {10}, {20}, {30}, {40}\nFILE *fp = fopen("data.bin","rb");\nfseek(fp, 2 * sizeof(Rec), SEEK_SET);\nRec r;\nfread(&r, sizeof(Rec), 1, fp);\nfclose(fp);\nprintf("%d", r.val);`,
    choices: ["30", "20", "40", "10"],
    correctAnswer: "30",
    explanation:
      "fseek skips 2 records (10, 20) and positions at the 3rd record (30). fread reads it.",
  },
];

export async function GET() {
  await syncDB();
  await Question.bulkCreate(questions as any);
  return NextResponse.json({
    message: `Seeded ${questions.length} more Prog 2 finals questions.`,
  });
}
