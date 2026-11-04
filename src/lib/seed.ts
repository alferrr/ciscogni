import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

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
  // DSA Exam 1
  "dsa_adt_list_ops",
  "dsa_array_list_impl",
  "dsa_linked_list",
  "dsa_cursor_list",
  "dsa_adt_stack",
  "dsa_adt_queue",
  // DSA Exam 2
  "dsa_uid_bit_vector",
  "dsa_uid_computer_word",
  "dsa_dict_open_hashing",
  "dsa_dict_closed_hashing",
  "dsa_priority_queue",
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
  // DSA Exam 1
  {
    type: "concept",
    topic: "dsa_adt_list_ops",
    mode: "practice",
    difficulty: "easy",
    questionText:
      "Which ADT List operation resets the list to an empty state?",
    codeSnippet: null,
    choices: ["Makenull", "Initialize", "Delete", "Member"],
    correctAnswer: "Makenull",
    explanation:
      "Makenull() clears the list so it contains no elements, leaving it empty and ready for use.",
  },
  {
    type: "concept",
    topic: "dsa_adt_list_ops",
    mode: "practice",
    difficulty: "easy",
    questionText:
      "Which ADT List operation checks whether a given value exists in the list?",
    codeSnippet: null,
    choices: ["Member", "Insert", "Initialize", "Delete"],
    correctAnswer: "Member",
    explanation:
      "Member(x, L) searches the list L and reports whether x is present.",
  },
  {
    type: "concept",
    topic: "dsa_adt_list_ops",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "What is the difference between Initialize and Makenull for an ADT List?",
    codeSnippet: null,
    choices: [
      "Initialize sets up a new list structure for first use; Makenull empties an existing list",
      "They are exactly the same operation",
      "Initialize deletes elements; Makenull adds elements",
      "Makenull is only used for arrays, Initialize only for linked lists",
    ],
    correctAnswer:
      "Initialize sets up a new list structure for first use; Makenull empties an existing list",
    explanation:
      "Initialize prepares a brand-new list (allocating any needed structure), while Makenull resets an already-existing list back to empty.",
  },
  {
    type: "concept",
    topic: "dsa_array_list_impl",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "In the array implementation of ADT List, what is the key limitation of the static array versions (Versions 1 and 2)?",
    codeSnippet: null,
    choices: [
      "The array has a fixed maximum size decided at compile time",
      "They cannot store integers",
      "They require a linked list internally",
      "They cannot support the Insert operation",
    ],
    correctAnswer: "The array has a fixed maximum size decided at compile time",
    explanation:
      "Static array implementations allocate a fixed-size array, so the list can never grow beyond that predetermined capacity.",
  },
  {
    type: "concept",
    topic: "dsa_array_list_impl",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "What advantage do the dynamic array versions (Versions 3 and 4) have over the static array versions?",
    codeSnippet: null,
    choices: [
      "They can grow or shrink at runtime by reallocating memory",
      "They have O(1) insert at any position",
      "They don't need an index to access elements",
      "They use less memory than a linked list in all cases",
    ],
    correctAnswer: "They can grow or shrink at runtime by reallocating memory",
    explanation:
      "Dynamic array implementations resize the underlying array as needed, avoiding the fixed-capacity limitation of static arrays.",
  },
  {
    type: "concept",
    topic: "dsa_array_list_impl",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "What is the time complexity of inserting an element at the beginning of an array-based list of n elements?",
    codeSnippet: null,
    choices: ["O(n)", "O(1)", "O(log n)", "O(n^2)"],
    correctAnswer: "O(n)",
    explanation:
      "Inserting at the front requires shifting all n existing elements one position to the right, which takes O(n) time.",
  },
  {
    type: "concept",
    topic: "dsa_linked_list",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "What is the key difference between the 'pointer to a node' (PN) and 'pointer to a pointer to a node' (PPN) traversal styles?",
    codeSnippet: null,
    choices: [
      "PPN tracks the address of the pointer that references the current node, allowing easier deletion; PN only tracks the node itself",
      "PN is used only for doubly linked lists",
      "PPN is slower because it dereferences twice as often in every case",
      "There is no real difference between them",
    ],
    correctAnswer:
      "PPN tracks the address of the pointer that references the current node, allowing easier deletion; PN only tracks the node itself",
    explanation:
      "PPN traversal keeps a pointer-to-pointer so the predecessor link can be updated directly, simplifying deletion compared to plain PN traversal.",
  },
  {
    type: "concept",
    topic: "dsa_linked_list",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "What is the time complexity of inserting a new node at the head of a singly linked list?",
    codeSnippet: null,
    choices: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    correctAnswer: "O(1)",
    explanation:
      "Inserting at the head only requires updating a constant number of pointers, regardless of list length.",
  },
  {
    type: "output_prediction",
    topic: "dsa_linked_list",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "head points to node A, where A -> B -> C -> NULL. What does 'p = head->next->next' assign to p?",
    codeSnippet: `Node *p = head->next->next; // head -> A -> B -> C -> NULL`,
    choices: [
      "p now points to node C",
      "p now points to node B",
      "p now points to node A",
      "p becomes NULL",
    ],
    correctAnswer: "p now points to node C",
    explanation:
      "head points to A. head->next is B, and (head->next)->next is C, so p ends up pointing to node C.",
  },
  {
    type: "concept",
    topic: "dsa_cursor_list",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "In a cursor-based implementation, what does allocSpace() correspond to in standard C?",
    codeSnippet: null,
    choices: ["malloc()", "free()", "calloc() only", "printf()"],
    correctAnswer: "malloc()",
    explanation:
      "allocSpace() simulates dynamic allocation within the virtual heap array, playing the same role malloc() plays for real dynamic memory.",
  },
  {
    type: "concept",
    topic: "dsa_cursor_list",
    mode: "practice",
    difficulty: "medium",
    questionText: "What does deallocSpace() correspond to in standard C?",
    codeSnippet: null,
    choices: ["free()", "malloc()", "realloc()", "new"],
    correctAnswer: "free()",
    explanation:
      "deallocSpace() returns a cell back to the virtual heap's free list, mirroring what free() does for heap-allocated memory.",
  },
  {
    type: "concept",
    topic: "dsa_cursor_list",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Why would a cursor-based implementation of ADT List be used instead of a true linked list implementation?",
    codeSnippet: null,
    choices: [
      "For languages or environments without pointers/dynamic memory allocation",
      "It is always faster than a real linked list",
      "It uses less memory in every case",
      "It removes the need for a virtual heap",
    ],
    correctAnswer:
      "For languages or environments without pointers/dynamic memory allocation",
    explanation:
      "Cursor implementation simulates pointers using array indices, making linked structures possible in languages that lack real pointers or dynamic allocation.",
  },
  {
    type: "concept",
    topic: "dsa_adt_stack",
    mode: "practice",
    difficulty: "easy",
    questionText: "Which operation removes and returns the top element of a stack?",
    codeSnippet: null,
    choices: ["Pop", "Push", "Top", "Enqueue"],
    correctAnswer: "Pop",
    explanation:
      "Pop removes the element currently at the top of the stack and returns its value.",
  },
  {
    type: "concept",
    topic: "dsa_adt_stack",
    mode: "practice",
    difficulty: "easy",
    questionText: "Which operation returns the top element of a stack without removing it?",
    codeSnippet: null,
    choices: ["Top (Peek)", "Pop", "Push", "Dequeue"],
    correctAnswer: "Top (Peek)",
    explanation:
      "Top (also called Peek) inspects the value at the top of the stack but leaves the stack unchanged.",
  },
  {
    type: "concept",
    topic: "dsa_adt_stack",
    mode: "practice",
    difficulty: "medium",
    questionText: "Which of these is a classic application of the stack ADT in computer science?",
    codeSnippet: null,
    choices: [
      "Function call management (the call stack) and expression evaluation",
      "CPU job scheduling in round-robin order",
      "Breadth-first traversal of a graph",
      "Managing print job order in a printer spooler",
    ],
    correctAnswer:
      "Function call management (the call stack) and expression evaluation",
    explanation:
      "Stacks are used for the call stack (tracking function calls/returns) and for evaluating expressions such as balancing parentheses or postfix evaluation.",
  },
  {
    type: "concept",
    topic: "dsa_adt_queue",
    mode: "practice",
    difficulty: "easy",
    questionText: "Which operation adds an element to the back of a queue?",
    codeSnippet: null,
    choices: ["Enqueue", "Dequeue", "Push", "Pop"],
    correctAnswer: "Enqueue",
    explanation:
      "Enqueue inserts a new element at the rear (back) of the queue.",
  },
  {
    type: "concept",
    topic: "dsa_adt_queue",
    mode: "practice",
    difficulty: "easy",
    questionText: "Which operation removes and returns the element at the front of a queue?",
    codeSnippet: null,
    choices: ["Dequeue", "Enqueue", "Top", "Push"],
    correctAnswer: "Dequeue",
    explanation:
      "Dequeue removes the element currently at the front of the queue, following the queue's FIFO order.",
  },
  {
    type: "concept",
    topic: "dsa_adt_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "Why are queues commonly used in operating systems?",
    codeSnippet: null,
    choices: [
      "To manage tasks in FIFO order, such as process scheduling and print job spooling",
      "To manage recursive function calls",
      "To sort data in ascending order",
      "To implement undo/redo functionality",
    ],
    correctAnswer:
      "To manage tasks in FIFO order, such as process scheduling and print job spooling",
    explanation:
      "Operating systems use queues to handle tasks in the order they arrive (FIFO), such as CPU scheduling queues and print spoolers.",
  },
  // DSA Exam 1 - extra bank
  {
    type: "concept",
    topic: "dsa_adt_list_ops",
    mode: "practice",
    difficulty: "easy",
    questionText: "Which ADT List operation adds a new element into the list?",
    codeSnippet: null,
    choices: ["Insert", "Member", "Makenull", "Delete"],
    correctAnswer: "Insert",
    explanation:
      "Insert(x, p, L) places a new element x into list L at (or after) position p.",
  },
  {
    type: "concept",
    topic: "dsa_adt_list_ops",
    mode: "practice",
    difficulty: "easy",
    questionText: "Which ADT List operation removes an element from the list?",
    codeSnippet: null,
    choices: ["Delete", "Insert", "Member", "Makenull"],
    correctAnswer: "Delete",
    explanation:
      "Delete(x, L) removes element x from list L, if it exists.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_adt_list_ops",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Starting from an empty list, after Insert(5), Insert(10), Insert(15), Delete(10), how many elements remain in the list?",
    codeSnippet: `Makenull(L);\nInsert(5, L);\nInsert(10, L);\nInsert(15, L);\nDelete(10, L);`,
    choices: ["2", "3", "1", "0"],
    correctAnswer: "2",
    explanation:
      "Three elements are inserted (5, 10, 15), then one (10) is deleted, leaving 2 elements: 5 and 15.",
  },
  {
    type: "bug_detection",
    topic: "dsa_adt_list_ops",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "A program calls Delete(x, L) on a value x that is not in list L. What is the correct expected behavior?",
    codeSnippet: null,
    choices: [
      "The list is left unchanged since x was never found",
      "The program must crash",
      "The first element of the list is removed instead",
      "The list becomes empty",
    ],
    correctAnswer: "The list is left unchanged since x was never found",
    explanation:
      "A well-formed Delete implementation should leave the list unchanged when the target value isn't present, not remove an unrelated element.",
  },
  {
    type: "concept",
    topic: "dsa_adt_list_ops",
    mode: "practice",
    difficulty: "easy",
    questionText:
      "Before performing any other ADT List operations on a new list variable, which operation must typically be called first?",
    codeSnippet: null,
    choices: ["Initialize / Makenull", "Delete", "Member", "Insert"],
    correctAnswer: "Initialize / Makenull",
    explanation:
      "A list must be initialized (set to empty) before Insert, Delete, or Member can be used safely on it.",
  },
  {
    type: "concept",
    topic: "dsa_adt_list_ops",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "What does Member(x, L) return?",
    codeSnippet: null,
    choices: [
      "A boolean (or position) indicating whether x is present in L",
      "The number of elements in L",
      "A new copy of L",
      "The last element of L",
    ],
    correctAnswer: "A boolean (or position) indicating whether x is present in L",
    explanation:
      "Member checks list L for the presence of x and reports whether (or sometimes where) it exists, without modifying the list.",
  },
  {
    type: "concept",
    topic: "dsa_array_list_impl",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "In the array implementation of ADT List, what typically distinguishes Version 1 from Version 2?",
    codeSnippet: null,
    choices: [
      "Whether the list elements are kept sorted or left unsorted in the array",
      "Whether the array is stored on the heap or the stack",
      "Whether Insert is supported at all",
      "The programming language used",
    ],
    correctAnswer:
      "Whether the list elements are kept sorted or left unsorted in the array",
    explanation:
      "A common way to distinguish array-based list versions is whether elements are maintained in sorted order (affecting Insert/Delete cost) or simply appended unsorted.",
  },
  {
    type: "concept",
    topic: "dsa_array_list_impl",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Which C function is typically used to grow a dynamic array implementation of ADT List when it becomes full?",
    codeSnippet: null,
    choices: ["realloc()", "free()", "strcpy()", "sizeof()"],
    correctAnswer: "realloc()",
    explanation:
      "realloc() resizes a previously allocated block of memory, which is how dynamic array versions grow their capacity at runtime.",
  },
  {
    type: "output_prediction",
    topic: "dsa_array_list_impl",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "An array-based list holds [10, 20, 30, 40]. After deleting the element at index 1 and shifting later elements left, what does the array contain?",
    codeSnippet: `int arr[] = {10, 20, 30, 40};\n// delete index 1, shift left`,
    choices: ["[10, 30, 40]", "[10, 20, 40]", "[20, 30, 40]", "[10, 30, 40, 40]"],
    correctAnswer: "[10, 30, 40]",
    explanation:
      "Removing index 1 (20) and shifting all later elements one position left produces [10, 30, 40].",
  },
  {
    type: "concept",
    topic: "dsa_array_list_impl",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "What is the time complexity of deleting the last element of an array-based list (no shifting needed)?",
    codeSnippet: null,
    choices: ["O(1)", "O(n)", "O(n log n)", "O(n^2)"],
    correctAnswer: "O(1)",
    explanation:
      "Removing the last element only requires decrementing the size counter; no other elements need to move.",
  },
  {
    type: "bug_detection",
    topic: "dsa_array_list_impl",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "This delete function removes the element at index i but forgets to shift the remaining elements. What is the bug?",
    codeSnippet: `void deleteAt(int arr[], int *size, int i) {\n  (*size)--;\n}`,
    choices: [
      "It never shifts elements after index i left, so the array still contains a stale/duplicate value",
      "It shifts elements too far",
      "It decreases size twice",
      "There is no bug",
    ],
    correctAnswer:
      "It never shifts elements after index i left, so the array still contains a stale/duplicate value",
    explanation:
      "Simply decrementing size without shifting leaves the 'deleted' value logically inside the array's used range whenever i isn't the last index.",
  },
  {
    type: "concept",
    topic: "dsa_array_list_impl",
    mode: "practice",
    difficulty: "easy",
    questionText:
      "What is the time complexity of accessing an element by index in an array-based list?",
    codeSnippet: null,
    choices: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    correctAnswer: "O(1)",
    explanation:
      "Arrays support direct indexing, so accessing arr[i] takes constant time regardless of list size.",
  },
  {
    type: "concept",
    topic: "dsa_linked_list",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "What is the time complexity of accessing the k-th element of a singly linked list?",
    codeSnippet: null,
    choices: ["O(n)", "O(1)", "O(log n)", "O(k^2)"],
    correctAnswer: "O(n)",
    explanation:
      "There is no direct indexing in a linked list, so reaching the k-th node requires traversing from the head, which is O(n) in the worst case.",
  },
  {
    type: "concept",
    topic: "dsa_linked_list",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Why does PPN (pointer-to-pointer-to-node) traversal make deletion simpler than PN traversal?",
    codeSnippet: null,
    choices: [
      "It directly holds the address of the predecessor's next pointer, so the link can be rewritten without a separate lookup",
      "It automatically frees deleted nodes",
      "It stores the whole list in an array",
      "It only works on doubly linked lists",
    ],
    correctAnswer:
      "It directly holds the address of the predecessor's next pointer, so the link can be rewritten without a separate lookup",
    explanation:
      "Because PPN tracks a pointer to the pointer referencing the current node, deletion just rewrites *pp = node->next without needing to track a separate predecessor variable.",
  },
  {
    type: "output_prediction",
    topic: "dsa_linked_list",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Given head -> 1 -> 2 -> 3 -> NULL, what is printed by this traversal loop?",
    codeSnippet: `Node *p = head;\nwhile (p != NULL) {\n  printf("%d ", p->data);\n  p = p->next;\n}`,
    choices: ["1 2 3", "3 2 1", "1 2", "Infinite loop"],
    correctAnswer: "1 2 3",
    explanation:
      "The loop starts at head and follows next pointers until NULL, printing each node's data in order: 1 2 3.",
  },
  {
    type: "bug_detection",
    topic: "dsa_linked_list",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "This deletion code frees the node before updating the previous node's next pointer. What problem does this cause?",
    codeSnippet: `free(curr);\nprev->next = curr->next; // curr already freed`,
    choices: [
      "curr->next is accessed after curr was freed, reading freed (invalid) memory",
      "prev is never updated",
      "It creates a memory leak",
      "There is no bug",
    ],
    correctAnswer:
      "curr->next is accessed after curr was freed, reading freed (invalid) memory",
    explanation:
      "Once curr is freed, dereferencing curr->next is undefined behavior (use-after-free). The next pointer must be saved before freeing the node.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_linked_list",
    mode: "practice",
    difficulty: "medium",
    questionText: "How many nodes does this loop count for head -> A -> B -> C -> NULL?",
    codeSnippet: `int count = 0;\nNode *p = head;\nwhile (p != NULL) {\n  count++;\n  p = p->next;\n}`,
    choices: ["3", "2", "4", "0"],
    correctAnswer: "3",
    explanation:
      "The loop visits each of the 3 nodes (A, B, C) exactly once before p becomes NULL, so count ends at 3.",
  },
  {
    type: "concept",
    topic: "dsa_linked_list",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "What is the time complexity of inserting a new node at the tail of a singly linked list when there is no tail pointer?",
    codeSnippet: null,
    choices: ["O(n)", "O(1)", "O(log n)", "O(n^2)"],
    correctAnswer: "O(n)",
    explanation:
      "Without a tail pointer, the list must be traversed from head to the last node before the new node can be linked, costing O(n).",
  },
  {
    type: "concept",
    topic: "dsa_cursor_list",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the purpose of initVirtualHeap()?",
    codeSnippet: null,
    choices: [
      "It sets up the cursor space array and links all cells into a free list before any allocation happens",
      "It deletes all elements from the ADT List",
      "It converts the cursor implementation into a real linked list",
      "It sorts the virtual heap array",
    ],
    correctAnswer:
      "It sets up the cursor space array and links all cells into a free list before any allocation happens",
    explanation:
      "initVirtualHeap() prepares the simulated heap array, chaining every cell into a free list so allocSpace() has cells to hand out.",
  },
  {
    type: "concept",
    topic: "dsa_cursor_list",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "In a cursor-based implementation, what data structure keeps track of which cells are available for allocSpace() to use?",
    codeSnippet: null,
    choices: [
      "A free list threaded through the unused cells of the cursor array",
      "A separate dynamically allocated linked list",
      "A hash table of free indices",
      "A stack implemented with recursion",
    ],
    correctAnswer:
      "A free list threaded through the unused cells of the cursor array",
    explanation:
      "Unused cells are linked together (via their 'next' field) into a free list, so allocSpace() can pop the head and deallocSpace() can push a cell back.",
  },
  {
    type: "output_prediction",
    topic: "dsa_cursor_list",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "In a cursor implementation, allocSpace() returns the index of a free cell and removes it from the free list. If the free list is 4 -> 5 -> 6 and allocSpace() is called once, what is the new free list?",
    codeSnippet: `// free list: 4 -> 5 -> 6\nint cell = allocSpace(); // returns 4`,
    choices: ["5 -> 6", "4 -> 5 -> 6", "6", "empty"],
    correctAnswer: "5 -> 6",
    explanation:
      "allocSpace() removes the head of the free list (cell 4) and returns it, leaving 5 -> 6 as the remaining free list.",
  },
  {
    type: "bug_detection",
    topic: "dsa_cursor_list",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "A program allocates cells with allocSpace() in a loop but never calls deallocSpace() when done with them. What happens?",
    codeSnippet: null,
    choices: [
      "The virtual heap's free list shrinks over time and can eventually run out of cells, even though real memory isn't leaked",
      "The array automatically grows to compensate",
      "The program crashes immediately",
      "Nothing; deallocSpace() is optional and has no effect",
    ],
    correctAnswer:
      "The virtual heap's free list shrinks over time and can eventually run out of cells, even though real memory isn't leaked",
    explanation:
      "Since the cursor array has a fixed size, failing to deallocSpace() keeps cells marked as used, eventually exhausting the free list, similar to a memory leak.",
  },
  {
    type: "concept",
    topic: "dsa_cursor_list",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "What is the time complexity of inserting at the head of a cursor-based list, assuming a free cell is available?",
    codeSnippet: null,
    choices: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    correctAnswer: "O(1)",
    explanation:
      "Just like a real linked list, inserting at the head only requires updating a constant number of cursor 'pointers' (indices), so it's O(1).",
  },
  {
    type: "concept",
    topic: "dsa_cursor_list",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "What is a key limitation of a cursor-based list compared to a true (pointer-based) linked list?",
    codeSnippet: null,
    choices: [
      "Its maximum size is bounded by the fixed size of the underlying cursor array",
      "It cannot support the Insert operation",
      "It always runs slower for every operation",
      "It cannot be traversed",
    ],
    correctAnswer:
      "Its maximum size is bounded by the fixed size of the underlying cursor array",
    explanation:
      "Because the cursor space is a fixed-size array simulating the heap, the total number of nodes across all cursor-based lists is capped by that array's size.",
  },
  {
    type: "concept",
    topic: "dsa_adt_stack",
    mode: "practice",
    difficulty: "easy",
    questionText: "Which operation adds a new element to the top of a stack?",
    codeSnippet: null,
    choices: ["Push", "Pop", "Top", "Enqueue"],
    correctAnswer: "Push",
    explanation:
      "Push(x, S) places element x onto the top of stack S.",
  },
  {
    type: "concept",
    topic: "dsa_adt_stack",
    mode: "practice",
    difficulty: "easy",
    questionText: "A stack follows which ordering principle?",
    codeSnippet: null,
    choices: [
      "LIFO (Last In, First Out)",
      "FIFO (First In, First Out)",
      "Random order",
      "Sorted order",
    ],
    correctAnswer: "LIFO (Last In, First Out)",
    explanation:
      "A stack always removes the most recently pushed element first, which is the definition of Last In, First Out.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_adt_stack",
    mode: "practice",
    difficulty: "medium",
    questionText: "What does Top(S) return after this sequence of operations?",
    codeSnippet: `Push(1, S);\nPush(2, S);\nPush(3, S);\nPop(S);\nTop(S);`,
    choices: ["2", "3", "1", "empty"],
    correctAnswer: "2",
    explanation:
      "After pushing 1, 2, 3, the stack top is 3. Pop removes 3, leaving 2 on top, which Top(S) then returns.",
  },
  {
    type: "bug_detection",
    topic: "dsa_adt_stack",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "This code calls Pop() on a stack without first checking if it's empty. What problem can occur?",
    codeSnippet: `int x = Pop(S); // S might be empty`,
    choices: [
      "Stack underflow: popping from an empty stack is undefined/invalid",
      "The stack automatically grows a new element",
      "It silently returns 0 every time, which is always safe",
      "There is no bug",
    ],
    correctAnswer:
      "Stack underflow: popping from an empty stack is undefined/invalid",
    explanation:
      "Popping an empty stack is a classic error called stack underflow; the caller should check IsEmpty(S) before popping.",
  },
  {
    type: "concept",
    topic: "dsa_adt_stack",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "What is a key risk of implementing a stack with a static (fixed-size) array?",
    codeSnippet: null,
    choices: [
      "Stack overflow: pushing more elements than the array's capacity",
      "It cannot support Pop()",
      "It requires a virtual heap",
      "It always uses more memory than a linked list",
    ],
    correctAnswer:
      "Stack overflow: pushing more elements than the array's capacity",
    explanation:
      "A static array has a fixed maximum size, so pushing beyond that capacity causes a stack overflow unless the implementation resizes or rejects the push.",
  },
  {
    type: "concept",
    topic: "dsa_adt_stack",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "What is the time complexity of Push in a linked-list implementation of a stack (inserting at the head)?",
    codeSnippet: null,
    choices: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    correctAnswer: "O(1)",
    explanation:
      "Pushing onto a linked-list stack means inserting a new node at the head, which only touches a constant number of pointers.",
  },
  {
    type: "concept",
    topic: "dsa_adt_queue",
    mode: "practice",
    difficulty: "easy",
    questionText: "A queue follows which ordering principle?",
    codeSnippet: null,
    choices: [
      "FIFO (First In, First Out)",
      "LIFO (Last In, First Out)",
      "Random order",
      "Sorted order",
    ],
    correctAnswer: "FIFO (First In, First Out)",
    explanation:
      "A queue always removes the element that has been waiting the longest, which is the definition of First In, First Out.",
  },
  {
    type: "concept",
    topic: "dsa_adt_queue",
    mode: "practice",
    difficulty: "easy",
    questionText: "Which operation returns the element at the front of a queue without removing it?",
    codeSnippet: null,
    choices: ["Front", "Dequeue", "Enqueue", "Pop"],
    correctAnswer: "Front",
    explanation:
      "Front(Q) inspects the element currently at the front of the queue but leaves the queue unchanged.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_adt_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "What does Front(Q) return after this sequence of operations?",
    codeSnippet: `Enqueue(1, Q);\nEnqueue(2, Q);\nEnqueue(3, Q);\nDequeue(Q);\nFront(Q);`,
    choices: ["2", "1", "3", "empty"],
    correctAnswer: "2",
    explanation:
      "Enqueue adds 1, 2, 3 in that order (1 at the front). Dequeue removes 1, leaving 2 at the front, which Front(Q) returns.",
  },
  {
    type: "bug_detection",
    topic: "dsa_adt_queue",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "This code calls Dequeue() on a queue without first checking if it's empty. What problem can occur?",
    codeSnippet: `int x = Dequeue(Q); // Q might be empty`,
    choices: [
      "Queue underflow: dequeuing from an empty queue is undefined/invalid",
      "The queue automatically adds a default element",
      "It always returns the last dequeued value safely",
      "There is no bug",
    ],
    correctAnswer:
      "Queue underflow: dequeuing from an empty queue is undefined/invalid",
    explanation:
      "Dequeuing an empty queue is a classic error (queue underflow); the caller should check IsEmpty(Q) first.",
  },
  {
    type: "concept",
    topic: "dsa_adt_queue",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Why is a circular array often preferred over a plain linear array when implementing a queue?",
    codeSnippet: null,
    choices: [
      "It reuses freed space at the front of the array instead of wasting it as the queue shifts",
      "It makes Enqueue and Dequeue both O(n)",
      "It removes the need for a front index",
      "It allows unlimited queue size",
    ],
    correctAnswer:
      "It reuses freed space at the front of the array instead of wasting it as the queue shifts",
    explanation:
      "A plain array wastes the slots freed by Dequeue at the front; a circular array wraps the rear index around to reuse that space, avoiding unnecessary resizing.",
  },
  {
    type: "concept",
    topic: "dsa_adt_queue",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Why does a linked-list implementation of a queue typically keep both a head and a tail pointer?",
    codeSnippet: null,
    choices: [
      "So Enqueue (add at tail) and Dequeue (remove at head) can both run in O(1) time",
      "So the list can be sorted automatically",
      "Because a single pointer cannot represent a linked list",
      "To allow the queue to be traversed backwards only",
    ],
    correctAnswer:
      "So Enqueue (add at tail) and Dequeue (remove at head) can both run in O(1) time",
    explanation:
      "With only a head pointer, adding to the tail would require an O(n) traversal; keeping a tail pointer lets Enqueue append in O(1) as well.",
  },
  // DSA Exam 2 — UID Sets: Bit Vector Array Implementation
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "easy",
    questionText:
      "In the bit vector implementation of a UID Set, what does index i of the array represent?",
    codeSnippet: null,
    choices: [
      "Whether element i of the universe is currently in the set",
      "The i-th element currently stored in the set",
      "A pointer to the i-th node of the set",
      "The hash code of element i",
    ],
    correctAnswer: "Whether element i of the universe is currently in the set",
    explanation:
      "A bit vector allocates one slot per possible universe element; A[i] is 1 (true) if i belongs to the set and 0 (false) otherwise.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "easy",
    questionText:
      "To represent UID sets over a universe {0, 1, ..., n-1}, how large must the bit vector array be?",
    codeSnippet: null,
    choices: ["n", "n-1", "The number of elements currently in the set", "log2(n)"],
    correctAnswer: "n",
    explanation:
      "The array must have one slot for every possible element of the universe, regardless of how many elements are actually in the set.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "easy",
    questionText: "What does MakeNull(A) do to a bit vector set A?",
    codeSnippet: null,
    choices: [
      "Sets every entry of A to 0",
      "Sets every entry of A to 1",
      "Deallocates the array",
      "Sets A to the complement of itself",
    ],
    correctAnswer: "Sets every entry of A to 0",
    explanation:
      "MakeNull resets the set to empty, meaning no universe element is a member, so every bit is cleared to 0.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "easy",
    questionText: "What is the time complexity of Member(x, A) on a bit vector set?",
    codeSnippet: null,
    choices: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    correctAnswer: "O(1)",
    explanation:
      "Checking membership is a single array access, A[x], so it runs in constant time regardless of universe size.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "easy",
    questionText: "What is the time complexity of Insert(x, A) on a bit vector set?",
    codeSnippet: null,
    choices: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswer: "O(1)",
    explanation:
      "Insert simply sets A[x] = 1, a single array write, so it is constant time.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Why does Union(A, B, C) on bit vector sets take O(n) time even if A and B each contain very few elements?",
    codeSnippet: null,
    choices: [
      "Every one of the n slots must be visited and OR'd, regardless of how many are actually set",
      "Union must sort both sets first",
      "The array must be resized before the union can be computed",
      "Union requires recomputing the hash of every element",
    ],
    correctAnswer:
      "Every one of the n slots must be visited and OR'd, regardless of how many are actually set",
    explanation:
      "A bit vector has no way to skip over 0 entries; the algorithm must loop i = 0 to n-1 and set C[i] = A[i] OR B[i] for every slot.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText: "Which operation computes Intersection(A, B, C) for bit vector sets?",
    codeSnippet: null,
    choices: [
      "C[i] = A[i] AND B[i] for all i",
      "C[i] = A[i] OR B[i] for all i",
      "C[i] = NOT A[i] for all i",
      "C[i] = A[i] XOR B[i] for all i",
    ],
    correctAnswer: "C[i] = A[i] AND B[i] for all i",
    explanation:
      "An element is in the intersection only if it is a member of both A and B, which is exactly the logical AND of their bits.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText: "How is Complement(A, C) computed for a bit vector set?",
    codeSnippet: null,
    choices: [
      "C[i] = NOT A[i] for all i",
      "C[i] = A[i] for all i",
      "C[i] = A[n-1-i] for all i",
      "C[i] = 0 for all i",
    ],
    correctAnswer: "C[i] = NOT A[i] for all i",
    explanation:
      "The complement of A relative to the universe contains exactly the elements not in A, so every bit is flipped.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "What is the main drawback of the bit vector implementation when the universe is huge but the set is sparse (few members)?",
    codeSnippet: null,
    choices: [
      "It wastes a large amount of space holding mostly 0 bits",
      "Member() becomes O(n)",
      "It cannot represent the empty set",
      "Insert() and Delete() become O(n)",
    ],
    correctAnswer: "It wastes a large amount of space holding mostly 0 bits",
    explanation:
      "Space is always O(n), proportional to the universe size, not the number of actual members — for a huge universe with few members, most of that space is wasted.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText: "How do you compute the cardinality (size) of a bit vector set A?",
    codeSnippet: null,
    choices: [
      "Scan all n entries and count how many are 1",
      "Return the length of the array",
      "Scan the array until the first 0 is found",
      "Divide n by 2",
    ],
    correctAnswer: "Scan all n entries and count how many are 1",
    explanation:
      "There is no running counter by default, so Size() must traverse the whole vector and tally the 1 bits, making it O(n).",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Which statement correctly compares Equal(A, B) and Subset(A, B) for bit vector sets?",
    codeSnippet: null,
    choices: [
      "Equal checks A[i] == B[i] for all i; Subset checks that A[i] = 1 implies B[i] = 1 for all i",
      "Equal and Subset are computed identically",
      "Subset is O(1) while Equal is O(n)",
      "Equal only compares cardinalities, not individual bits",
    ],
    correctAnswer:
      "Equal checks A[i] == B[i] for all i; Subset checks that A[i] = 1 implies B[i] = 1 for all i",
    explanation:
      "Equal requires the two sets to match bit-for-bit, while Subset only requires every member of A to also be a member of B — B may still have extra 1 bits.",
  },
  {
    type: "output_prediction",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "easy",
    questionText:
      "Given this bit vector representation (index 0 to 7), what elements does set A contain?",
    codeSnippet: `int A[8] = {0, 1, 0, 1, 1, 0, 0, 1};`,
    choices: ["{1, 3, 4, 7}", "{0, 2, 5, 6}", "{0, 1, 2, 3}", "{1, 3, 4, 7, 8}"],
    correctAnswer: "{1, 3, 4, 7}",
    explanation:
      "The set contains every index whose value is 1: positions 1, 3, 4, and 7.",
  },
  {
    type: "output_prediction",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText: "What does array C contain after this union is computed?",
    codeSnippet: `int A[6] = {1, 0, 1, 0, 0, 1};\nint B[6] = {0, 0, 1, 1, 0, 0};\nint C[6];\nfor (int i = 0; i < 6; i++)\n    C[i] = A[i] | B[i];`,
    choices: [
      "{1, 0, 1, 1, 0, 1}",
      "{0, 0, 1, 0, 0, 0}",
      "{1, 0, 1, 1, 1, 1}",
      "{1, 1, 1, 1, 0, 1}",
    ],
    correctAnswer: "{1, 0, 1, 1, 0, 1}",
    explanation:
      "OR-ing each pair: 1|0=1, 0|0=0, 1|1=1, 0|1=1, 0|0=0, 1|0=1, giving {1,0,1,1,0,1}.",
  },
  {
    type: "output_prediction",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText: "What does array C contain after this intersection is computed?",
    codeSnippet: `int A[6] = {1, 0, 1, 0, 1, 1};\nint B[6] = {1, 1, 0, 0, 1, 0};\nint C[6];\nfor (int i = 0; i < 6; i++)\n    C[i] = A[i] & B[i];`,
    choices: [
      "{1, 0, 0, 0, 1, 0}",
      "{1, 1, 1, 0, 1, 1}",
      "{0, 1, 1, 0, 0, 1}",
      "{1, 0, 1, 0, 1, 0}",
    ],
    correctAnswer: "{1, 0, 0, 0, 1, 0}",
    explanation:
      "AND-ing each pair: 1&1=1, 0&1=0, 1&0=0, 0&0=0, 1&1=1, 1&0=0, giving {1,0,0,0,1,0}.",
  },
  {
    type: "output_prediction",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "easy",
    questionText: "What is the cardinality (size) of set A after this code runs?",
    codeSnippet: `int A[7] = {1, 0, 0, 1, 1, 0, 1};\nint size = 0;\nfor (int i = 0; i < 7; i++)\n    if (A[i] == 1) size++;`,
    choices: ["4", "3", "7", "5"],
    correctAnswer: "4",
    explanation: "Indices 0, 3, 4, and 6 hold 1, so there are 4 members.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "A program calls Insert(3, A) then Delete(1, A) on A = {0,1,1,0,0}. What is A afterward?",
    codeSnippet: null,
    choices: ["{0, 0, 1, 1, 0}", "{0, 1, 1, 1, 0}", "{1, 0, 1, 0, 0}", "{0, 0, 1, 0, 0}"],
    correctAnswer: "{0, 0, 1, 1, 0}",
    explanation:
      "Insert(3, A) sets A[3] = 1, giving {0,1,1,1,0}. Delete(1, A) then sets A[1] = 0, giving {0,0,1,1,0}.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Set A = {1,1,0,0,1} and set B = {0,1,0,1,1} represent subsets of {0,...,4}. What is Subset(A, B)?",
    codeSnippet: null,
    choices: [
      "False, because A[0] = 1 but B[0] = 0",
      "True, because both sets have the same cardinality",
      "True, because A and B share element 1 and 4",
      "False, because A and B are not equal",
    ],
    correctAnswer: "False, because A[0] = 1 but B[0] = 0",
    explanation:
      "For A to be a subset of B, every index where A is 1 must also be 1 in B. Index 0 is 1 in A but 0 in B, so A is not a subset of B.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "A = {1,0,1,1,0}, B = {0,1,1,0,1}. What is Complement(Union(A, B))?",
    codeSnippet: null,
    choices: ["{0, 0, 0, 0, 0}", "{1, 1, 1, 1, 1}", "{0, 0, 0, 1, 0}", "{1, 0, 0, 1, 0}"],
    correctAnswer: "{0, 0, 0, 0, 0}",
    explanation:
      "Union(A,B) = {1,1,1,1,1} (OR-ing each pair, every slot has at least one 1). Complement flips every bit, giving {0,0,0,0,0}.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Given universe size n = 5, how many distinct UID sets can a bit vector of this size represent?",
    codeSnippet: null,
    choices: ["32 (2^5)", "25 (5^2)", "10 (5 choose 2)", "5"],
    correctAnswer: "32 (2^5)",
    explanation:
      "Each of the 5 bits can independently be 0 or 1, giving 2^5 = 32 possible combinations, i.e. 32 distinct subsets of a 5-element universe.",
  },
  {
    type: "bug_detection",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText: "This Insert function is supposed to add x to the bit vector set A. What is wrong with it?",
    codeSnippet: `void Insert(int x, int A[]) {\n    A[x] == 1;\n}`,
    choices: [
      "It uses the comparison operator == instead of the assignment operator =",
      "It should use A[x] = 0 instead",
      "It is missing a return statement",
      "x should be passed by reference",
    ],
    correctAnswer: "It uses the comparison operator == instead of the assignment operator =",
    explanation:
      "A[x] == 1 only evaluates a boolean expression and discards it; it never actually assigns 1 to A[x]. It should be A[x] = 1;",
  },
  {
    type: "bug_detection",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText: "This function is supposed to compute Union(A, B, C) over n elements. What is wrong?",
    codeSnippet: `void Union(int A[], int B[], int C[], int n) {\n    for (int i = 1; i <= n; i++)\n        C[i] = A[i] | B[i];\n}`,
    choices: [
      "The loop runs from 1 to n instead of 0 to n-1, causing an out-of-bounds access and skipping index 0",
      "It should use & instead of |",
      "C should be initialized to all zeros first",
      "The loop should count down from n to 1",
    ],
    correctAnswer:
      "The loop runs from 1 to n instead of 0 to n-1, causing an out-of-bounds access and skipping index 0",
    explanation:
      "Valid indices for an n-element array are 0 to n-1. This loop skips index 0 entirely and reads/writes A[n], B[n], C[n], which are out of bounds.",
  },
  {
    type: "bug_detection",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText: "This Member function always returns 0. What is the bug?",
    codeSnippet: `int Member(int x, int A[], int n) {\n    int found = 0;\n    if (A[x] = 1)\n        found = 1;\n    return found;\n}`,
    choices: [
      "A[x] = 1 is an assignment, not a comparison, so it always overwrites A[x] and the condition is always true for 1 but misleading",
      "found should start at 1",
      "x should be checked against n first",
      "The return type should be void",
    ],
    correctAnswer:
      "A[x] = 1 is an assignment, not a comparison, so it always overwrites A[x] and the condition is always true for 1 but misleading",
    explanation:
      "The intended comparison A[x] == 1 was mistyped as A[x] = 1. This assigns 1 to A[x] (mutating the set as a side effect!) and the if-condition always evaluates true, so Member incorrectly reports every x as present after corrupting A.",
  },
  {
    type: "bug_detection",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "hard",
    questionText: "This MakeNull function does not actually empty the set. What is wrong?",
    codeSnippet: `void MakeNull(int A[], int n) {\n    int B[100];\n    for (int i = 0; i < n; i++)\n        B[i] = 0;\n}`,
    choices: [
      "It clears a separate local array B instead of the parameter array A",
      "The loop bound should be n - 1",
      "B should be declared as a global array",
      "It needs to return B",
    ],
    correctAnswer: "It clears a separate local array B instead of the parameter array A",
    explanation:
      "The function zeroes out a throwaway local array B and never touches A at all, so the caller's set A is left completely unchanged.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "easy",
    questionText: "What does Fill(A) (sometimes called Universe(A)) do to a bit vector set?",
    codeSnippet: null,
    choices: [
      "Sets every entry of A to 1, making it equal to the entire universe",
      "Sets every entry of A to 0",
      "Doubles the size of A",
      "Copies A into a backup array",
    ],
    correctAnswer: "Sets every entry of A to 1, making it equal to the entire universe",
    explanation:
      "Fill/Universe is the opposite of MakeNull: it makes every universe element a member of the set by setting every bit to 1.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Which of these operations on bit vector sets is NOT O(1)?",
    codeSnippet: null,
    choices: ["Union(A, B, C)", "Member(x, A)", "Insert(x, A)", "Delete(x, A)"],
    correctAnswer: "Union(A, B, C)",
    explanation:
      "Single-element operations touch one slot, so they're O(1). Union must visit all n slots to combine both sets, so it's O(n).",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Why is the bit vector representation considered a good fit when the universe is small, even if it's always O(n) for whole-set operations?",
    codeSnippet: null,
    choices: [
      "When n is small, O(n) is already fast in absolute terms, and the O(1) single-element operations and simplicity outweigh the fixed O(n) cost",
      "It becomes O(1) for all operations when n is small",
      "Small universes eliminate the need for Union and Intersection",
      "Bit vectors only work correctly for small n",
    ],
    correctAnswer:
      "When n is small, O(n) is already fast in absolute terms, and the O(1) single-element operations and simplicity outweigh the fixed O(n) cost",
    explanation:
      "Asymptotic complexity doesn't change with universe size, but when n is small the constant-time single-element ops dominate in practice and the implementation stays simple and fast.",
  },
  {
    type: "output_prediction",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the output of this code?",
    codeSnippet: `int A[5] = {1, 1, 0, 0, 1};\nint B[5] = {1, 0, 0, 1, 1};\nint equal = 1;\nfor (int i = 0; i < 5; i++)\n    if (A[i] != B[i]) equal = 0;\nprintf("%d", equal);`,
    choices: ["0", "1", "5", "2"],
    correctAnswer: "0",
    explanation:
      "A and B differ at index 1 (1 vs 0) and index 3 (0 vs 1), so equal is set to 0 and that's what gets printed.",
  },
  {
    type: "output_prediction",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "hard",
    questionText: "What does array C contain after this difference (A - B) is computed?",
    codeSnippet: `int A[6] = {1, 1, 0, 1, 1, 0};\nint B[6] = {1, 0, 0, 1, 0, 0};\nint C[6];\nfor (int i = 0; i < 6; i++)\n    C[i] = A[i] & !B[i];`,
    choices: [
      "{0, 1, 0, 0, 1, 0}",
      "{1, 1, 0, 1, 1, 0}",
      "{0, 0, 0, 0, 0, 0}",
      "{1, 0, 0, 0, 1, 0}",
    ],
    correctAnswer: "{0, 1, 0, 0, 1, 0}",
    explanation:
      "Difference keeps elements in A but not in B: A[i] & !B[i]. Index 0: 1&!1=0, index 1: 1&!0=1, index 2: 0&!0=0, index 3: 1&!1=0, index 4: 1&!0=1, index 5: 0&!0=0.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "A bit vector set is typically stored using which data type for each slot, in a simple implementation?",
    codeSnippet: null,
    choices: [
      "A boolean or small integer (0/1) per element, one per universe slot",
      "A linked list node per element",
      "A hash code per element",
      "A floating point number per element",
    ],
    correctAnswer: "A boolean or small integer (0/1) per element, one per universe slot",
    explanation:
      "The simple (unpacked) bit vector implementation uses one boolean/int cell per universe element — it is the Computer Word implementation that packs multiple bits into each storage word.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Which pair of UID set operations are logical inverses of each other in the bit vector representation?",
    codeSnippet: null,
    choices: ["Insert(x, A) and Delete(x, A)", "Union and Intersection", "Member and Size", "MakeNull and Member"],
    correctAnswer: "Insert(x, A) and Delete(x, A)",
    explanation:
      "Insert sets A[x] to 1 and Delete sets A[x] to 0 — they perform exactly opposite single-bit writes.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Starting from A = {0,0,0,0,0} (universe size 5), the sequence Insert(2,A), Insert(4,A), Insert(2,A), Delete(0,A) is run. What is A afterward?",
    codeSnippet: null,
    choices: ["{0, 0, 1, 0, 1}", "{1, 0, 1, 0, 1}", "{0, 0, 1, 1, 1}", "{0, 0, 0, 0, 1}"],
    correctAnswer: "{0, 0, 1, 0, 1}",
    explanation:
      "Insert(2,A) -> {0,0,1,0,0}. Insert(4,A) -> {0,0,1,0,1}. Insert(2,A) again has no effect (already 1). Delete(0,A) has no effect since A[0] was already 0. Final: {0,0,1,0,1}.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "easy",
    questionText:
      "If A[7] = 1 in a bit vector set over universe {0,...,9}, what does that mean?",
    codeSnippet: null,
    choices: [
      "The element 7 is a member of the set",
      "The set has exactly 7 members",
      "The set is full",
      "Element 7 has been deleted",
    ],
    correctAnswer: "The element 7 is a member of the set",
    explanation: "A[i] = 1 means universe element i belongs to the set; here that's element 7.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Which of the following best explains why the bit vector approach cannot represent a universe of unbounded or unknown size efficiently?",
    codeSnippet: null,
    choices: [
      "The array size must be fixed to n at creation time, so the full universe must be known in advance",
      "Bit vectors cannot store the value 0",
      "Insert becomes undefined for large x",
      "Bit vectors require the universe to be sorted",
    ],
    correctAnswer: "The array size must be fixed to n at creation time, so the full universe must be known in advance",
    explanation:
      "Because every universe element needs a reserved slot, the array must be allocated with the full universe size n up front, which is impossible if that size is unbounded or unknown.",
  },
  {
    type: "bug_detection",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "hard",
    questionText: "This Intersection function sometimes gives wrong results for large n. What is the bug?",
    codeSnippet: `void Intersection(int A[], int B[], int C[], int n) {\n    for (int i = 0; i <= n; i++)\n        C[i] = A[i] & B[i];\n}`,
    choices: [
      "The loop condition i <= n causes an out-of-bounds access at index n",
      "It should use | instead of &",
      "C needs to be passed by value",
      "The loop should start at i = 1",
    ],
    correctAnswer: "The loop condition i <= n causes an out-of-bounds access at index n",
    explanation:
      "For arrays of size n, valid indices run 0 to n-1. The condition i <= n lets i reach n, reading/writing one slot past the end of each array — undefined behavior that can corrupt memory or produce garbage results.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Of Union, Intersection, Complement, and Member, which ones require visiting every slot of the bit vector(s)?",
    codeSnippet: null,
    choices: ["Union, Intersection, and Complement", "Only Member", "Only Union", "None of them"],
    correctAnswer: "Union, Intersection, and Complement",
    explanation:
      "Union, Intersection, and Complement all operate on the whole vector element-by-element (O(n)); Member only checks a single index (O(1)).",
  },
  {
    type: "logic_tracing",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "A = {1,1,1,0,0}, B = {0,0,1,1,1}. Is Equal(A, B) true, and what is Size(A) + Size(B)?",
    codeSnippet: null,
    choices: [
      "Equal is false; Size(A) + Size(B) = 6",
      "Equal is true; Size(A) + Size(B) = 6",
      "Equal is false; Size(A) + Size(B) = 5",
      "Equal is true; Size(A) + Size(B) = 3",
    ],
    correctAnswer: "Equal is false; Size(A) + Size(B) = 6",
    explanation:
      "A and B differ at indices 0,1,3,4, so Equal is false. Size(A) = 3 (indices 0,1,2), Size(B) = 3 (indices 2,3,4); 3+3 = 6.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "easy",
    questionText: "Which boolean operator corresponds to the UID Set Union operation at the bit level?",
    codeSnippet: null,
    choices: ["OR", "AND", "NOT", "XOR"],
    correctAnswer: "OR",
    explanation: "An element is in the union if it is in A or B (or both), which is exactly bitwise OR.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "easy",
    questionText: "Which boolean operator corresponds to the UID Set Intersection operation at the bit level?",
    codeSnippet: null,
    choices: ["AND", "OR", "NOT", "XOR"],
    correctAnswer: "AND",
    explanation: "An element is in the intersection only if it is in both A and B, which is exactly bitwise AND.",
  },
  {
    type: "concept",
    topic: "dsa_uid_bit_vector",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Compared to a linked-list-based set representation, what is the main advantage of a bit vector for Union and Intersection?",
    codeSnippet: null,
    choices: [
      "It avoids searching: both sets are already aligned by index, so corresponding elements can be combined directly without any lookups",
      "It uses less memory in every case",
      "It supports elements that are not integers",
      "It allows O(1) Union regardless of universe size",
    ],
    correctAnswer:
      "It avoids searching: both sets are already aligned by index, so corresponding elements can be combined directly without any lookups",
    explanation:
      "Because every universe element has a fixed, known slot in both vectors, Union/Intersection just walks both arrays in lockstep — no searching or pointer chasing needed, unlike a linked structure.",
  },
  // DSA Exam 2 — UID Sets: Computer Word Implementation
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "easy",
    questionText:
      "What is the key idea behind the Computer Word implementation of a UID Set?",
    codeSnippet: null,
    choices: [
      "Pack multiple bits into each machine word so bitwise operations process many elements per instruction",
      "Store each element as a full 32-bit integer for faster comparisons",
      "Replace the array with a linked list of words",
      "Use a hash table instead of an array",
    ],
    correctAnswer:
      "Pack multiple bits into each machine word so bitwise operations process many elements per instruction",
    explanation:
      "Instead of one array slot per element, bits are packed WORDSIZE at a time into machine words, letting a single bitwise instruction act on many universe elements simultaneously.",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "easy",
    questionText:
      "If WORDSIZE = 32 and the universe has n = 100 elements, how many words are needed to store the set?",
    codeSnippet: null,
    choices: ["4 (ceil(100/32))", "100", "32", "3"],
    correctAnswer: "4 (ceil(100/32))",
    explanation:
      "ceil(100 / 32) = ceil(3.125) = 4 words are needed; the last word only uses 4 of its 32 bits.",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "To locate element x in a computer-word bit vector, which pair of values must be computed?",
    codeSnippet: null,
    choices: [
      "The word index (which word holds x) and the bit index (which bit within that word)",
      "The hash of x and the bucket index",
      "The parent index and the child index",
      "The row and column of a 2D array",
    ],
    correctAnswer:
      "The word index (which word holds x) and the bit index (which bit within that word)",
    explanation:
      "Every element maps to exactly one word and one bit position within that word; both must be computed to read or write it.",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Given WORDSIZE = 32, what are the standard formulas for the word index and bit index of element x?",
    codeSnippet: null,
    choices: [
      "wordIndex = x / 32, bitIndex = x % 32",
      "wordIndex = x % 32, bitIndex = x / 32",
      "wordIndex = x * 32, bitIndex = x / 32",
      "wordIndex = 32 / x, bitIndex = 32 % x",
    ],
    correctAnswer: "wordIndex = x / 32, bitIndex = x % 32",
    explanation:
      "Integer division by WORDSIZE gives which word holds x, and the remainder gives the bit's position within that word.",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "medium",
    questionText: "Which expression tests whether element x is a member, given its word and bit index?",
    codeSnippet: null,
    choices: [
      "(A[wordIndex] >> bitIndex) & 1",
      "A[wordIndex] + bitIndex",
      "A[bitIndex] >> wordIndex",
      "A[wordIndex] == bitIndex",
    ],
    correctAnswer: "(A[wordIndex] >> bitIndex) & 1",
    explanation:
      "Shifting the word right by bitIndex moves the target bit into position 0, and ANDing with 1 isolates it, giving 0 or 1.",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "medium",
    questionText: "Which expression correctly inserts (sets to 1) element x into a computer-word set?",
    codeSnippet: null,
    choices: [
      "A[wordIndex] |= (1 << bitIndex)",
      "A[wordIndex] &= (1 << bitIndex)",
      "A[wordIndex] = bitIndex",
      "A[wordIndex] ^= bitIndex",
    ],
    correctAnswer: "A[wordIndex] |= (1 << bitIndex)",
    explanation:
      "Shifting a 1 into bitIndex creates a mask with only that bit set; OR-ing it into the word sets that bit to 1 without disturbing the others.",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "medium",
    questionText: "Which expression correctly deletes (clears to 0) element x from a computer-word set?",
    codeSnippet: null,
    choices: [
      "A[wordIndex] &= ~(1 << bitIndex)",
      "A[wordIndex] |= (1 << bitIndex)",
      "A[wordIndex] = ~bitIndex",
      "A[wordIndex] &= (1 << bitIndex)",
    ],
    correctAnswer: "A[wordIndex] &= ~(1 << bitIndex)",
    explanation:
      "The mask (1 << bitIndex) has only the target bit set; negating it flips every bit except that one to 1. ANDing with this mask clears only the target bit.",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Both the plain bit vector and the computer word implementation are O(n) for Union/Intersection. Why is the computer word version still much faster in practice?",
    codeSnippet: null,
    choices: [
      "It processes WORDSIZE elements per machine instruction, shrinking the constant factor even though the asymptotic complexity is unchanged",
      "It changes the asymptotic complexity to O(log n)",
      "It avoids visiting every element entirely",
      "It uses a smaller universe size",
    ],
    correctAnswer:
      "It processes WORDSIZE elements per machine instruction, shrinking the constant factor even though the asymptotic complexity is unchanged",
    explanation:
      "The loop only runs n/WORDSIZE times instead of n times, since each OR/AND instruction combines a whole word (e.g. 32 or 64 bits) at once — same Big-O, much smaller constant.",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "medium",
    questionText: "How is Union(A, B, C) computed in the computer word representation?",
    codeSnippet: null,
    choices: [
      "C[i] = A[i] | B[i] for each word i (0 to numWords-1)",
      "C[i] = A[i] | B[i] for each bit i (0 to n-1), one at a time",
      "C = A concatenated with B",
      "C[i] = A[i] + B[i] for each word i",
    ],
    correctAnswer: "C[i] = A[i] | B[i] for each word i (0 to numWords-1)",
    explanation:
      "Union is still computed with OR, but now it's applied word-by-word across the much shorter array of packed words, not bit-by-bit.",
  },
  {
    type: "output_prediction",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "medium",
    questionText: "With WORDSIZE = 8, what is the word index and bit index of element x = 19?",
    codeSnippet: `int wordIndex = x / 8;\nint bitIndex = x % 8;`,
    choices: ["wordIndex = 2, bitIndex = 3", "wordIndex = 3, bitIndex = 2", "wordIndex = 19, bitIndex = 8", "wordIndex = 2, bitIndex = 4"],
    correctAnswer: "wordIndex = 2, bitIndex = 3",
    explanation: "19 / 8 = 2 (integer division) and 19 % 8 = 3.",
  },
  {
    type: "output_prediction",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "With WORDSIZE = 8, A[0] = 00010000 in binary (bit 4 set). What does Member(4, A) return?",
    codeSnippet: `int wordIndex = 4 / 8;\nint bitIndex = 4 % 8;\nint result = (A[wordIndex] >> bitIndex) & 1;`,
    choices: ["1", "0", "4", "16"],
    correctAnswer: "1",
    explanation:
      "wordIndex = 0, bitIndex = 4. A[0] has bit 4 set (00010000), so shifting right by 4 and masking with 1 yields 1.",
  },
  {
    type: "output_prediction",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "With WORDSIZE = 8 and A[0] initially 00000000, what is A[0] in binary after Insert(3, A)?",
    codeSnippet: `int bitIndex = 3 % 8;\nA[0] |= (1 << bitIndex);`,
    choices: ["00001000", "00000011", "00010000", "11111000"],
    correctAnswer: "00001000",
    explanation: "1 << 3 = 00001000; OR-ing that into 00000000 sets only bit 3, giving 00001000 (decimal 8).",
  },
  {
    type: "output_prediction",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "With WORDSIZE = 8 and A[0] = 00001010 (bits 1 and 3 set), what is A[0] after Delete(3, A)?",
    codeSnippet: `int bitIndex = 3 % 8;\nA[0] &= ~(1 << bitIndex);`,
    choices: ["00000010", "00001000", "11110101", "00000000"],
    correctAnswer: "00000010",
    explanation:
      "~(1 << 3) = 11110111, which clears only bit 3. ANDing with 00001010 gives 00000010 (only bit 1 remains set).",
  },
  {
    type: "logic_tracing",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "With WORDSIZE = 32, how many words are needed for a universe of n = 65? How many bits in the last word are unused?",
    codeSnippet: null,
    choices: [
      "3 words; the last word uses only 1 bit, so 31 are unused",
      "2 words; 0 bits unused",
      "3 words; 32 bits unused",
      "2 words; 31 bits unused",
    ],
    correctAnswer: "3 words; the last word uses only 1 bit, so 31 are unused",
    explanation:
      "ceil(65/32) = 3 words. The first two hold 64 bits (elements 0-63); the third holds only element 64, using 1 of its 32 bits, leaving 31 unused.",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the space cost (in bits) of the computer word representation for a universe of n elements?",
    codeSnippet: null,
    choices: [
      "Approximately n bits, rounded up to the next multiple of WORDSIZE",
      "Exactly n * WORDSIZE bits",
      "n bytes, regardless of WORDSIZE",
      "WORDSIZE bits total, regardless of n",
    ],
    correctAnswer: "Approximately n bits, rounded up to the next multiple of WORDSIZE",
    explanation:
      "The total storage is still essentially n bits, just packed into whole words — at most WORDSIZE - 1 bits are wasted in the final partially-filled word.",
  },
  {
    type: "bug_detection",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "hard",
    questionText: "This Member function gives wrong answers for elements beyond the first word. What is the bug?",
    codeSnippet: `int Member(int x, int A[]) {\n    int bitIndex = x % 32;\n    return (A[0] >> bitIndex) & 1;\n}`,
    choices: [
      "It always reads word 0 instead of computing and using wordIndex = x / 32",
      "It should shift left instead of right",
      "bitIndex should be x / 32",
      "The mask should be 0 instead of 1",
    ],
    correctAnswer: "It always reads word 0 instead of computing and using wordIndex = x / 32",
    explanation:
      "The function never computes x / 32 to find which word holds x; it hardcodes A[0], so any element at index 32 or above is checked against the wrong word.",
  },
  {
    type: "bug_detection",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "hard",
    questionText: "This Insert function corrupts other bits in the same word. What is the bug?",
    codeSnippet: `void Insert(int x, int A[]) {\n    int wordIndex = x / 32;\n    int bitIndex = x % 32;\n    A[wordIndex] = (1 << bitIndex);\n}`,
    choices: [
      "It uses = instead of |=, overwriting the whole word instead of only setting one bit",
      "wordIndex and bitIndex are swapped",
      "It should use & instead of 1 <<",
      "bitIndex should use / instead of %",
    ],
    correctAnswer: "It uses = instead of |=, overwriting the whole word instead of only setting one bit",
    explanation:
      "Plain assignment replaces the entire word with just the new bit set, wiping out every other bit that was already 1 in that word. It should be A[wordIndex] |= (1 << bitIndex);",
  },
  {
    type: "bug_detection",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "hard",
    questionText: "This Delete function fails to clear the bit — Member still returns 1 afterward. What is wrong?",
    codeSnippet: `void Delete(int x, int A[]) {\n    int wordIndex = x / 32;\n    int bitIndex = x % 32;\n    A[wordIndex] &= (1 << bitIndex);\n}`,
    choices: [
      "It is missing the bitwise NOT (~) on the mask, so it ANDs with a mask that clears every bit except the target one",
      "It should use |= instead of &=",
      "x should be divided by 8, not 32",
      "bitIndex should be negative",
    ],
    correctAnswer:
      "It is missing the bitwise NOT (~) on the mask, so it ANDs with a mask that clears every bit except the target one",
    explanation:
      "Without the ~, ANDing with (1 << bitIndex) keeps only the target bit (if it was set) and clears everything else — the opposite of deleting just that one bit. It should be A[wordIndex] &= ~(1 << bitIndex);",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "easy",
    questionText: "In the computer word implementation, what does WORDSIZE typically refer to?",
    codeSnippet: null,
    choices: [
      "The number of bits in one machine word (e.g. 32 or 64)",
      "The number of elements in the universe",
      "The number of words in the dictionary",
      "The size of the hash table",
    ],
    correctAnswer: "The number of bits in one machine word (e.g. 32 or 64)",
    explanation:
      "WORDSIZE is a constant describing the machine's native word width, commonly 32 or 64 bits, which determines how many set-bits each array slot can pack.",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "medium",
    questionText: "How many machine words does Union(A, B, C) touch for a universe of n elements and word size w?",
    codeSnippet: null,
    choices: ["ceil(n / w) words", "n words", "w words", "n * w words"],
    correctAnswer: "ceil(n / w) words",
    explanation:
      "Each word packs w bits, so the whole universe needs ceil(n/w) words, and Union must OR together each corresponding pair of words.",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Why does the computer word implementation still need the same MakeNull, Insert, Delete, Union, Intersection, and Complement operations as the plain bit vector?",
    codeSnippet: null,
    choices: [
      "It implements the exact same UID Set ADT; only the underlying storage layout and bit-indexing arithmetic change",
      "Because it is a completely different ADT with a different interface",
      "Because computer word sets cannot support Union or Intersection",
      "Because the universe must be re-defined for each operation",
    ],
    correctAnswer:
      "It implements the exact same UID Set ADT; only the underlying storage layout and bit-indexing arithmetic change",
    explanation:
      "The computer word scheme is an optimization of the same abstract UID Set operations — what changes is how bits are addressed and processed, not what the operations mean.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "With WORDSIZE = 16, which word holds element x = 31, and which holds x = 32?",
    codeSnippet: null,
    choices: [
      "x = 31 is in word 1 (bit 15); x = 32 is in word 2 (bit 0)",
      "Both are in word 2",
      "x = 31 is in word 2; x = 32 is in word 1",
      "Both are in word 1",
    ],
    correctAnswer: "x = 31 is in word 1 (bit 15); x = 32 is in word 2 (bit 0)",
    explanation: "31/16 = 1 remainder 15, so word 1 bit 15. 32/16 = 2 remainder 0, so word 2 bit 0.",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Which built-in CPU feature makes the computer word approach fast for Union/Intersection across a whole word?",
    codeSnippet: null,
    choices: [
      "Native bitwise AND/OR/NOT instructions that operate on an entire machine word in a single CPU cycle",
      "Hardware sorting instructions",
      "Dedicated hashing instructions",
      "Automatic garbage collection",
    ],
    correctAnswer:
      "Native bitwise AND/OR/NOT instructions that operate on an entire machine word in a single CPU cycle",
    explanation:
      "CPUs provide bitwise instructions that act on all WORDSIZE bits of a register at once, which is exactly what lets word-packed Union/Intersection beat the naive bit-by-bit version.",
  },
  {
    type: "output_prediction",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the output of this code (WORDSIZE = 8)?",
    codeSnippet: `int A[1] = {0};\nint bitIndex = 5 % 8;\nA[0] |= (1 << bitIndex);\nbitIndex = 2 % 8;\nA[0] |= (1 << bitIndex);\nprintf("%d", A[0]);`,
    choices: ["36", "32", "4", "40"],
    correctAnswer: "36",
    explanation:
      "1 << 5 = 32 (binary 00100000), then 1 << 2 = 4 (binary 00000100). OR-ing both into A[0] gives 32 + 4 = 36 (binary 00100100).",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "What is the main trade-off introduced by the computer word implementation compared to the plain bit vector?",
    codeSnippet: null,
    choices: [
      "More complex indexing arithmetic (word/bit index math) in exchange for a much smaller constant factor and less wasted space",
      "Worse asymptotic time complexity in exchange for simpler code",
      "It requires a completely different ADT interface",
      "It can only represent sets of even size",
    ],
    correctAnswer:
      "More complex indexing arithmetic (word/bit index math) in exchange for a much smaller constant factor and less wasted space",
    explanation:
      "Every access now needs a division and modulo (or shift/mask) to find the right word and bit, but in return the implementation packs bits tightly and processes many at once.",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "medium",
    questionText: "Why is WORDSIZE usually chosen as a power of 2 (e.g. 8, 16, 32, 64)?",
    codeSnippet: null,
    choices: [
      "So the division and modulo for word/bit index can be replaced by fast bit shifts and masks",
      "Because arrays can only have power-of-2 lengths",
      "Because the universe must always have a power-of-2 size",
      "It is not related to performance, only convention",
    ],
    correctAnswer:
      "So the division and modulo for word/bit index can be replaced by fast bit shifts and masks",
    explanation:
      "When WORDSIZE is a power of 2, x / WORDSIZE becomes a right shift and x % WORDSIZE becomes a bitmask AND, both of which are faster than general division.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "With WORDSIZE = 8, A[0] = 11000000 and B[0] = 00000011. What is Union(A, B)[0] in binary and decimal?",
    codeSnippet: null,
    choices: ["11000011, which is 195", "11000000, which is 192", "00000011, which is 3", "11000001, which is 193"],
    correctAnswer: "11000011, which is 195",
    explanation: "OR-ing 11000000 with 00000011 combines both sets of bits with no overlap, giving 11000011 = 128+64+2+1 = 195.",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "easy",
    questionText:
      "When WORDSIZE = 64 and the universe has n = 1,000,000 elements, roughly how many words are allocated?",
    codeSnippet: null,
    choices: ["About 15,625 (1,000,000 / 64)", "1,000,000", "64", "About 1,000,000 * 64"],
    correctAnswer: "About 15,625 (1,000,000 / 64)",
    explanation:
      "1,000,000 / 64 ≈ 15,625 words — a huge saving in both memory layout and the number of words Union/Intersection must process, compared to 1,000,000 individual slots.",
  },
  {
    type: "concept",
    topic: "dsa_uid_computer_word",
    mode: "practice",
    difficulty: "medium",
    questionText: "Which of these is the correct order of steps to test Member(x, A) in the computer word scheme?",
    codeSnippet: null,
    choices: [
      "Compute wordIndex and bitIndex, then shift A[wordIndex] right by bitIndex, then AND with 1",
      "AND A[x] with 1, then compute wordIndex",
      "Shift x right by WORDSIZE, then look up the result directly",
      "Compute bitIndex only, ignoring wordIndex",
    ],
    correctAnswer:
      "Compute wordIndex and bitIndex, then shift A[wordIndex] right by bitIndex, then AND with 1",
    explanation:
      "You must first locate the right word and bit position before you can isolate and read that specific bit.",
  },
  // DSA Exam 2 — Dictionary: Open Hashing (Linked Lists)
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "easy",
    questionText: "In open hashing (separate chaining), what does each slot of the hash table hold?",
    codeSnippet: null,
    choices: [
      "The head pointer of a linked list of all entries that hashed to that slot",
      "Exactly one key-value pair",
      "A sorted array of entries",
      "A pointer to the next non-empty slot",
    ],
    correctAnswer: "The head pointer of a linked list of all entries that hashed to that slot",
    explanation:
      "Open hashing resolves collisions by chaining: every slot is the head of its own linked list, and all keys that hash to that slot are appended to it.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "easy",
    questionText: "What is a collision in the context of a hash table?",
    codeSnippet: null,
    choices: [
      "When two different keys hash to the same slot",
      "When the table becomes completely full",
      "When a key is deleted twice",
      "When the hash function returns a negative number",
    ],
    correctAnswer: "When two different keys hash to the same slot",
    explanation:
      "A collision occurs whenever h(key1) == h(key2) for two distinct keys; the dictionary must have a strategy to store both.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "easy",
    questionText: "How does open hashing (separate chaining) resolve a collision?",
    codeSnippet: null,
    choices: [
      "It appends the new entry to the linked list already at that slot",
      "It probes the next slot in the array",
      "It rejects the insert and returns an error",
      "It rehashes the key with a second hash function immediately",
    ],
    correctAnswer: "It appends the new entry to the linked list already at that slot",
    explanation:
      "Since each slot is a linked list, a colliding key is simply added as another node in that same slot's chain rather than displacing anything.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the load factor (α) of a hash table with n entries and M slots?",
    codeSnippet: null,
    choices: ["α = n / M", "α = M / n", "α = n * M", "α = n - M"],
    correctAnswer: "α = n / M",
    explanation:
      "Load factor is the ratio of entries to slots; it estimates the average chain length in open hashing.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "Under uniform hashing, what is the expected time to search for a key in open hashing, in terms of load factor α?",
    codeSnippet: null,
    choices: ["O(1 + α)", "O(α^2)", "O(log α)", "O(n) always, regardless of α"],
    correctAnswer: "O(1 + α)",
    explanation:
      "Computing the hash is O(1), and on average the matching chain has about α entries to scan through, giving expected time O(1 + α).",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "Why can open hashing never become 'full' the way an array-based structure can?",
    codeSnippet: null,
    choices: [
      "Each slot's linked list can keep growing to hold any number of colliding entries",
      "It automatically resizes the array whenever a collision happens",
      "Only one entry is allowed per slot, so it is always full",
      "It stores entries outside the table entirely",
    ],
    correctAnswer: "Each slot's linked list can keep growing to hold any number of colliding entries",
    explanation:
      "Because collisions just grow a chain rather than needing another table slot, there's no fixed limit on how many entries a table of M slots can actually hold.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "What are the three core operations every Dictionary ADT (including open hashing) must support?",
    codeSnippet: null,
    choices: ["Insert, Delete, Search (Member)", "Push, Pop, Peek", "Enqueue, Dequeue, Front", "Union, Intersection, Complement"],
    correctAnswer: "Insert, Delete, Search (Member)",
    explanation:
      "A Dictionary maps keys to values (or just tracks key membership) and must support adding, removing, and looking up entries by key.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the worst-case time for Search in open hashing, and when does it occur?",
    codeSnippet: null,
    choices: [
      "O(n), when every key happens to hash to the same slot, forming one long chain",
      "O(1), always, regardless of the hash function",
      "O(log n), when the table is half full",
      "O(M), the number of slots",
    ],
    correctAnswer: "O(n), when every key happens to hash to the same slot, forming one long chain",
    explanation:
      "If the hash function (or malicious input) sends all n keys to the same bucket, that one chain degenerates into a plain linked list of length n, requiring a full O(n) scan.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "easy",
    questionText: "What does a good hash function try to achieve for open hashing performance?",
    codeSnippet: null,
    choices: [
      "Distribute keys as uniformly as possible across all M slots to keep chains short",
      "Always map every key to slot 0",
      "Sort the keys before hashing them",
      "Guarantee the hash table never needs resizing",
    ],
    correctAnswer: "Distribute keys as uniformly as possible across all M slots to keep chains short",
    explanation:
      "Uniform distribution keeps the average chain length close to the load factor α, which is what makes the O(1 + α) average-case bound hold.",
  },
  {
    type: "output_prediction",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Using h(key) = key % 5 on a table of 5 slots, which slot does key 17 hash to?",
    codeSnippet: `int slot = 17 % 5;`,
    choices: ["2", "3", "17", "0"],
    correctAnswer: "2",
    explanation: "17 % 5 = 2 (17 = 3*5 + 2), so key 17 belongs in slot 2.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Using h(key) = key % 4, the keys 9, 13, 2, and 11 are inserted in that order into an initially empty table of 4 slots. Which slot ends up with a chain of 2 entries?",
    codeSnippet: null,
    choices: ["Slot 1 (holds 9 and 13)", "Slot 2 (holds 2 and 11)", "Slot 0", "Slot 3"],
    correctAnswer: "Slot 1 (holds 9 and 13)",
    explanation:
      "9 % 4 = 1, 13 % 4 = 1 (collides with 9, chained into slot 1), 2 % 4 = 2, 11 % 4 = 3. Only slot 1 ends up with two entries (9 and 13); slots 2 and 3 each hold just one.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Using h(key) = key % 3 on a table of 3 slots, after inserting 6, 9, 2, 7 in order, how many entries are chained in slot 0?",
    codeSnippet: null,
    choices: ["2 (keys 6 and 9)", "1", "3", "4"],
    correctAnswer: "2 (keys 6 and 9)",
    explanation:
      "6 % 3 = 0, 9 % 3 = 0 (collides with 6, chained), 2 % 3 = 2, 7 % 3 = 1. So slot 0 ends up holding exactly 6 and 9.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "A table has M = 10 slots and n = 25 entries, perfectly uniformly distributed. What is the load factor, and roughly how many comparisons does an average search make?",
    codeSnippet: null,
    choices: [
      "α = 2.5; about 2.5 comparisons on average",
      "α = 0.4; about 10 comparisons",
      "α = 25; about 1 comparison",
      "α = 10; about 25 comparisons",
    ],
    correctAnswer: "α = 2.5; about 2.5 comparisons on average",
    explanation:
      "α = n/M = 25/10 = 2.5. Since search time is O(1+α), each bucket averages about 2.5 entries to scan through.",
  },
  {
    type: "bug_detection",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "This Insert function for open hashing has a bug — new keys silently disappear. What's wrong?",
    codeSnippet: `void Insert(int key, Node* table[], int M) {\n    int slot = key % M;\n    Node* newNode = new Node(key);\n    newNode->next = NULL;\n    table[slot] = newNode;\n}`,
    choices: [
      "It overwrites table[slot] instead of linking newNode in front of the existing chain, losing any entries already there",
      "It should use key / M instead of key % M",
      "newNode->next should point to itself",
      "M should be replaced with key",
    ],
    correctAnswer:
      "It overwrites table[slot] instead of linking newNode in front of the existing chain, losing any entries already there",
    explanation:
      "Setting table[slot] = newNode discards whatever chain was already there. It should be newNode->next = table[slot]; table[slot] = newNode; to prepend onto the existing chain.",
  },
  {
    type: "bug_detection",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText: "This Search function for open hashing never finds keys that aren't in the first node of a chain. What's the bug?",
    codeSnippet: `bool Search(int key, Node* table[], int M) {\n    int slot = key % M;\n    Node* curr = table[slot];\n    if (curr != NULL && curr->key == key)\n        return true;\n    return false;\n}`,
    choices: [
      "It checks only the head node instead of looping through the whole chain with curr = curr->next",
      "It should compare curr->key with slot instead of key",
      "The slot calculation is wrong",
      "It should always return true",
    ],
    correctAnswer:
      "It checks only the head node instead of looping through the whole chain with curr = curr->next",
    explanation:
      "A correct Search must walk the entire chain (while curr != NULL) checking curr->key == key at each node and advancing curr = curr->next, not just inspect the head.",
  },
  {
    type: "bug_detection",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText: "This Delete function for open hashing crashes or fails when deleting a non-head node. What's missing?",
    codeSnippet: `void Delete(int key, Node* table[], int M) {\n    int slot = key % M;\n    Node* curr = table[slot];\n    while (curr != NULL) {\n        if (curr->key == key) {\n            table[slot] = curr->next;\n            delete curr;\n            return;\n        }\n        curr = curr->next;\n    }\n}`,
    choices: [
      "It always relinks table[slot] to curr->next, even when curr is not the head, corrupting the chain for any match beyond the first node",
      "It forgets to call delete on curr",
      "The while loop condition is wrong",
      "slot should be recomputed every iteration",
    ],
    correctAnswer:
      "It always relinks table[slot] to curr->next, even when curr is not the head, corrupting the chain for any match beyond the first node",
    explanation:
      "Unconditionally doing table[slot] = curr->next drops every node before curr from the chain. A correct version must track the previous node and relink prev->next = curr->next (or table[slot] = curr->next only when curr is the head).",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "Deleting a key from an open-hashing table that is not at the head of its chain requires what?",
    codeSnippet: null,
    choices: [
      "Keeping a 'previous' pointer while traversing so the previous node's next can be relinked around the deleted node",
      "Rehashing the entire table",
      "Rebuilding the chain from scratch",
      "Converting the chain into an array first",
    ],
    correctAnswer:
      "Keeping a 'previous' pointer while traversing so the previous node's next can be relinked around the deleted node",
    explanation:
      "Standard singly-linked-list deletion needs the predecessor node so it can be told to skip over (bypass) the removed node.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "If the load factor α of an open-hashing table grows very large (e.g. way more entries than slots), what happens to performance, and what is the usual remedy?",
    codeSnippet: null,
    choices: [
      "Search/Insert/Delete degrade toward O(α); the usual remedy is to rehash into a larger table to lower α",
      "Performance is unaffected since chains are linked lists",
      "The table automatically shrinks",
      "It becomes impossible to insert further keys",
    ],
    correctAnswer: "Search/Insert/Delete degrade toward O(α); the usual remedy is to rehash into a larger table to lower α",
    explanation:
      "As α grows, average chain length grows with it, slowing every operation; rehashing to a table with more slots (and reinserting all entries) brings α back down.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "easy",
    questionText: "What is the time complexity of Insert in open hashing, assuming duplicates aren't checked?",
    codeSnippet: null,
    choices: [
      "O(1) — compute the hash and prepend to the chain",
      "O(n) — always scan the whole table",
      "O(log n)",
      "O(M), the number of slots",
    ],
    correctAnswer: "O(1) — compute the hash and prepend to the chain",
    explanation:
      "If new entries are simply prepended to the head of the target chain without checking for duplicates, Insert only needs to hash the key and link in one node — O(1).",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "Which statement about open hashing table size M is correct?",
    codeSnippet: null,
    choices: [
      "M can be smaller than n, the number of entries, since chains absorb the overflow",
      "M must always be greater than n",
      "M must equal n exactly",
      "M has no effect on performance",
    ],
    correctAnswer: "M can be smaller than n, the number of entries, since chains absorb the overflow",
    explanation:
      "Because each slot can hold an unbounded chain, the number of slots M doesn't have to keep up with the number of entries n — it just affects how long the chains get (the load factor).",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "What data structure choice gives open hashing its name (as opposed to 'closed')?",
    codeSnippet: null,
    choices: [
      "Each slot opens onto its own separate chain, so entries are not confined to the array itself",
      "The hash table array itself is left open (unallocated) until first use",
      "Keys are stored in an open binary search tree",
      "It refers to open addressing probing",
    ],
    correctAnswer:
      "Each slot opens onto its own separate chain, so entries are not confined to the array itself",
    explanation:
      "'Open' hashing (separate chaining) lets storage grow outside the fixed array via linked lists, in contrast to 'closed' hashing, where every entry must live inside the fixed-size array itself.",
  },
  {
    type: "output_prediction",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the final chain (head to tail) in slot 2 after this sequence, using h(key) = key % 5?",
    codeSnippet: `Insert(2);  // 2 % 5 = 2\nInsert(7);  // 7 % 5 = 2\nInsert(12); // 12 % 5 = 2\n// each Insert prepends to the head of its slot's chain`,
    choices: ["12 -> 7 -> 2", "2 -> 7 -> 12", "2 -> 12 -> 7", "7 -> 2 -> 12"],
    correctAnswer: "12 -> 7 -> 2",
    explanation:
      "All three keys hash to slot 2. Since each Insert prepends to the head, the most recently inserted key (12) ends up first, followed by 7, then the original 2.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Why is prepending (inserting at the head of the chain) usually preferred over appending (inserting at the tail) in open hashing, for a singly linked list?",
    codeSnippet: null,
    choices: [
      "Prepending is O(1) since it only touches the head pointer; appending requires traversing to the tail, which is O(chain length)",
      "Prepending uses less memory per node",
      "Appending is not possible with linked lists",
      "Prepending keeps the chain sorted automatically",
    ],
    correctAnswer:
      "Prepending is O(1) since it only touches the head pointer; appending requires traversing to the tail, which is O(chain length)",
    explanation:
      "Without a tail pointer, appending to a singly linked chain means walking all the way to the end first; prepending avoids that entirely by just rewiring the head.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "What should Insert do if the key being inserted already exists in the dictionary?",
    codeSnippet: null,
    choices: [
      "Depends on the design: it may update the existing value, reject the duplicate, or (in a set-like dictionary) simply do nothing",
      "It must always crash the program",
      "It must always create a second entry with the same key",
      "It is undefined behavior in every implementation",
    ],
    correctAnswer:
      "Depends on the design: it may update the existing value, reject the duplicate, or (in a set-like dictionary) simply do nothing",
    explanation:
      "Dictionary ADTs commonly choose one consistent policy for duplicate keys — most implementations search the chain first and update in place rather than creating two entries for the same key.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "A table has M = 6 slots using h(key) = key % 6. Keys 10, 4, 16, 22 are inserted in order (prepend to chain). What is the chain in slot 4, head to tail?",
    codeSnippet: null,
    choices: ["22 -> 16 -> 10 -> 4", "4 -> 10 -> 16 -> 22", "10 -> 4 -> 16 -> 22", "4 -> 16 -> 10 -> 22"],
    correctAnswer: "22 -> 16 -> 10 -> 4",
    explanation:
      "10%6=4, 4%6=4, 16%6=4, 22%6=4 — all four keys collide into slot 4. Prepending each in insertion order 10,4,16,22 leaves the last-inserted (22) at the head: 22 -> 16 -> 10 -> 4.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "What role does a 'dummy' or sentinel head node sometimes play in a chained hash table slot?",
    codeSnippet: null,
    choices: [
      "It simplifies insert/delete logic by guaranteeing every chain already has a node, avoiding special-case NULL checks for an empty chain",
      "It stores the hash function itself",
      "It counts the number of slots in the table",
      "It replaces the need for a hash function entirely",
    ],
    correctAnswer:
      "It simplifies insert/delete logic by guaranteeing every chain already has a node, avoiding special-case NULL checks for an empty chain",
    explanation:
      "A sentinel/dummy node is a common linked-list trick: by always having at least one placeholder node, insert/delete code doesn't need separate cases for an empty vs. non-empty chain.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "easy",
    questionText: "What is the primary purpose of a hash function h(key) in a dictionary implementation?",
    codeSnippet: null,
    choices: [
      "To map a key to an index/slot in the table so it can be stored and retrieved quickly",
      "To encrypt the key for security",
      "To sort all the keys",
      "To compress the value associated with the key",
    ],
    correctAnswer:
      "To map a key to an index/slot in the table so it can be stored and retrieved quickly",
    explanation:
      "The hash function's job is purely to convert an arbitrary key into a bounded array index, enabling near-constant-time lookup.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Which scenario best illustrates the worst case for open hashing performance, assuming a fixed poor hash function?",
    codeSnippet: null,
    choices: [
      "All n keys happen to hash to the same slot, making Search behave like a linear scan of a single linked list",
      "Every key hashes to a distinct slot",
      "The table has more slots than keys",
      "Keys are inserted in sorted order",
    ],
    correctAnswer:
      "All n keys happen to hash to the same slot, making Search behave like a linear scan of a single linked list",
    explanation:
      "When the hash function clusters everything into one bucket, chaining degenerates to a single O(n) linked list, eliminating any benefit from having M slots.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Compared to a plain (unsorted) linked list holding all n entries, what advantage does open hashing with M slots offer?",
    codeSnippet: null,
    choices: [
      "It divides entries across M independent chains, so each chain is on average n/M times shorter than one giant list",
      "It guarantees O(1) worst-case search",
      "It removes the need for a hash function",
      "It eliminates the possibility of collisions",
    ],
    correctAnswer:
      "It divides entries across M independent chains, so each chain is on average n/M times shorter than one giant list",
    explanation:
      "Hashing spreads the n entries across M buckets, so (assuming reasonable distribution) each chain only needs to hold about n/M entries instead of all n.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "In open hashing, what must Search do once it reaches the correct slot?",
    codeSnippet: null,
    choices: [
      "Traverse the chain at that slot, comparing each node's key until a match is found or the chain ends",
      "Immediately return true, since hashing guarantees correctness",
      "Binary search the chain",
      "Recompute the hash a second time",
    ],
    correctAnswer:
      "Traverse the chain at that slot, comparing each node's key until a match is found or the chain ends",
    explanation:
      "Hashing only narrows the search down to one chain; multiple keys may share that slot, so a linear scan through the chain is still required to confirm a match.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "An open hashing table rehashes from M = 10 to M = 20 slots when α exceeds 1.5. What is the time complexity of this rehash operation in terms of the number of entries n?",
    codeSnippet: null,
    choices: [
      "O(n), since every one of the n entries must be removed and reinserted into the new table",
      "O(1), since only the table size changes",
      "O(log n)",
      "O(M), independent of n",
    ],
    correctAnswer: "O(n), since every one of the n entries must be removed and reinserted into the new table",
    explanation:
      "Rehashing means recomputing h(key) for every existing entry against the new table size and reinserting it, which touches all n entries exactly once — O(n).",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "What happens to the load factor α right after a rehash that doubles M, assuming n stays the same?",
    codeSnippet: null,
    choices: ["α is roughly halved", "α doubles", "α stays exactly the same", "α becomes 0"],
    correctAnswer: "α is roughly halved",
    explanation:
      "Since α = n/M, doubling M while n stays fixed cuts α approximately in half, which is exactly why rehashing to a bigger table restores good average performance.",
  },
  {
    type: "bug_detection",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "This hash function is a poor choice for open hashing on a table of M = 16 slots. What's the issue?",
    codeSnippet: `int hash(int key, int M) {\n    return 0;\n}`,
    choices: [
      "It always returns the same slot, forcing every key into one chain regardless of M",
      "It should return key instead of 0",
      "M is unused, which is fine",
      "It should take no parameters",
    ],
    correctAnswer: "It always returns the same slot, forcing every key into one chain regardless of M",
    explanation:
      "Returning a constant value means every single key collides into slot 0, turning the whole table into one long linked list and defeating the purpose of having M slots.",
  },
  {
    type: "concept",
    topic: "dsa_dict_open_hashing",
    mode: "practice",
    difficulty: "easy",
    questionText: "Which of these is an example hash function commonly used for integer keys in open hashing?",
    codeSnippet: null,
    choices: ["h(key) = key % M", "h(key) = key + M", "h(key) = M - key", "h(key) = key * key * key"],
    correctAnswer: "h(key) = key % M",
    explanation:
      "The modulo operation naturally maps any integer key into the valid slot range 0 to M-1, making it the standard simple hash function for integer keys.",
  },
  // DSA Exam 2 — Dictionary: Closed Hashing (Circular Array)
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "easy",
    questionText: "In closed hashing, where is every entry stored?",
    codeSnippet: null,
    choices: [
      "Directly inside the fixed-size array itself, with no external linked lists",
      "In a linked list attached to each slot",
      "In a separate overflow table only",
      "In a binary search tree rooted at each slot",
    ],
    correctAnswer: "Directly inside the fixed-size array itself, with no external linked lists",
    explanation:
      "Closed hashing (open addressing) keeps every entry inside the array's own slots; when a collision happens, it probes for another slot in the same array rather than chaining externally.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "easy",
    questionText: "What does it mean for the array to be treated as 'circular' during probing?",
    codeSnippet: null,
    choices: [
      "When probing runs past the last index, it wraps around to index 0 and continues",
      "The array is physically shaped like a ring in memory",
      "Keys must be inserted in a circular order",
      "Only even-numbered slots can be used",
    ],
    correctAnswer: "When probing runs past the last index, it wraps around to index 0 and continues",
    explanation:
      "Treating the array as circular means the next-slot formula uses modulo M, so probing seamlessly continues from the end of the array back to the beginning instead of stopping.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the linear probing formula for the i-th probe of key x in a table of size M?",
    codeSnippet: null,
    choices: ["(h(x) + i) % M", "h(x) * i % M", "h(x) - i", "h(x) % i"],
    correctAnswer: "(h(x) + i) % M",
    explanation:
      "Linear probing checks slot h(x), then h(x)+1, then h(x)+2, and so on, wrapping with modulo M to stay within bounds — giving probe i as (h(x) + i) % M.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "Why must the load factor α of a closed hashing table always stay below 1 (α < 1)?",
    codeSnippet: null,
    choices: [
      "Because every entry must fit inside the array itself, the table can never hold more entries than it has slots",
      "Because α above 1 causes negative hash values",
      "Because closed hashing uses chains that can't exceed M",
      "α can safely exceed 1 in closed hashing",
    ],
    correctAnswer:
      "Because every entry must fit inside the array itself, the table can never hold more entries than it has slots",
    explanation:
      "Unlike open hashing (where chains absorb overflow), closed hashing has a hard capacity ceiling of M slots — n can never exceed M, so α = n/M is always strictly less than 1.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is 'primary clustering' in linear probing?",
    codeSnippet: null,
    choices: [
      "Runs of consecutive occupied slots tend to grow longer, since any key hashing into the run must probe through the whole thing to find a free slot",
      "Keys with similar values are stored next to each other on purpose",
      "The hash function groups keys into clusters by key range",
      "A technique for speeding up Insert",
    ],
    correctAnswer:
      "Runs of consecutive occupied slots tend to grow longer, since any key hashing into the run must probe through the whole thing to find a free slot",
    explanation:
      "Once several slots in a row are filled, every new key that hashes anywhere into that run has to probe past the whole block, and if it lands at the end, it extends the cluster even further.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Why can't Delete in closed hashing simply mark the deleted slot as 'empty' the way it would in a normal array?",
    codeSnippet: null,
    choices: [
      "An 'empty' marker stops a probing search early, so any key that originally probed past the deleted slot would now be reported as not found",
      "Deleting a slot automatically deletes the whole table",
      "The array cannot have empty slots at all",
      "It would make Insert run in O(n)",
    ],
    correctAnswer:
      "An 'empty' marker stops a probing search early, so any key that originally probed past the deleted slot would now be reported as not found",
    explanation:
      "Search stops probing once it hits a truly empty slot (meaning the key isn't in the table). If a slot that other keys probed past gets marked empty, those other keys become unreachable by Search even though they're still physically in the table.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText: "What is the standard fix for the Delete problem in closed hashing with linear probing?",
    codeSnippet: null,
    choices: [
      "Mark the slot with a special 'deleted' (tombstone) marker, distinct from 'empty', so Search keeps probing past it while Insert may reuse it",
      "Physically shift every subsequent entry back one slot",
      "Rebuild the entire table from scratch after every delete",
      "Disallow Delete entirely once the table has had any collisions",
    ],
    correctAnswer:
      "Mark the slot with a special 'deleted' (tombstone) marker, distinct from 'empty', so Search keeps probing past it while Insert may reuse it",
    explanation:
      "A tombstone tells Search 'keep going, something used to be here' (preserving other keys' probe paths) while telling Insert 'this slot is available to reuse.'",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "What does Search do, step by step, when probing for key x in closed hashing?",
    codeSnippet: null,
    choices: [
      "Probe slot h(x), h(x)+1, h(x)+2, ... (wrapping around) comparing keys, until it finds x, hits a truly empty slot, or has probed all M slots",
      "Immediately return false if h(x) is occupied by a different key",
      "Binary search across the whole array",
      "Only check slot h(x) and nowhere else",
    ],
    correctAnswer:
      "Probe slot h(x), h(x)+1, h(x)+2, ... (wrapping around) comparing keys, until it finds x, hits a truly empty slot, or has probed all M slots",
    explanation:
      "Search must follow the exact same probe sequence Insert would have used, continuing past occupied non-matching slots (and tombstones) until it either finds the key or proves it isn't there.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "What happens to Insert/Search performance in closed hashing as α approaches 1?",
    codeSnippet: null,
    choices: [
      "Performance degrades sharply — clusters grow and probe sequences get much longer",
      "Performance stays constant regardless of α",
      "Performance improves because the table is nearly full",
      "The hash function stops working",
    ],
    correctAnswer: "Performance degrades sharply — clusters grow and probe sequences get much longer",
    explanation:
      "As the table fills up, free slots become scarce and clustering worsens, so both successful and unsuccessful searches require probing through increasingly long runs of occupied slots.",
  },
  {
    type: "output_prediction",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Table size M = 7, h(key) = key % 7. Keys 10 and 17 are inserted in order using linear probing. What slot does 17 land in?",
    codeSnippet: null,
    choices: [
      "Slot 4, because slot 3 (its natural hash) is already taken by 10",
      "Slot 3",
      "Slot 0",
      "Slot 6",
    ],
    correctAnswer: "Slot 4, because slot 3 (its natural hash) is already taken by 10",
    explanation:
      "10 % 7 = 3, so 10 occupies slot 3. 17 % 7 = 3 as well, but slot 3 is taken, so linear probing checks slot (3+1)%7 = 4, which is free.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Table size M = 5, h(key) = key % 5. Keys 2, 7, 12, 3 are inserted in that order using linear probing. What are the final contents of the table, slot 0 to 4?",
    codeSnippet: null,
    choices: [
      "[_, _, 2, 7, 12] with 3 landing in slot 0",
      "[2, 7, 12, 3, _]",
      "[3, _, 2, 7, 12]",
      "[_, 3, 2, 7, 12]",
    ],
    correctAnswer: "[_, _, 2, 7, 12] with 3 landing in slot 0",
    explanation:
      "2%5=2 (slot 2). 7%5=2, taken, probe to 3 (free). 12%5=2, taken, probe 3 (taken), probe 4 (free). 3%5=3, taken, probe 4 (taken), wrap to 0 (free). Final: slot0=3, slot2=2, slot3=7, slot4=12.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Continuing from a table where slots are [3, _, 2, 7, 12] (M=5, h(key)=key%5), key 7 is then deleted using a tombstone marker (T). What does Search(12) do?",
    codeSnippet: null,
    choices: [
      "It probes slot 2 (occupied by 2, no match), then slot 3 (now a tombstone T, keeps going), then slot 4 and finds 12",
      "It stops at slot 3 and incorrectly reports 12 as not found",
      "It immediately finds 12 at slot 2",
      "It skips straight to slot 0",
    ],
    correctAnswer:
      "It probes slot 2 (occupied by 2, no match), then slot 3 (now a tombstone T, keeps going), then slot 4 and finds 12",
    explanation:
      "12%5=2. Slot 2 has key 2 (no match, keep probing). Slot 3 is a tombstone — Search must treat that as 'keep probing,' not 'stop here.' Slot 4 holds 12 — found.",
  },
  {
    type: "bug_detection",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "This linear-probing Insert function doesn't wrap around correctly. What's the bug?",
    codeSnippet: `void Insert(int key, int table[], int M) {\n    int slot = key % M;\n    while (table[slot] != EMPTY) {\n        slot = slot + 1;\n    }\n    table[slot] = key;\n}`,
    choices: [
      "slot = slot + 1 can exceed the array bounds; it needs modulo M to wrap around: slot = (slot + 1) % M",
      "It should use slot - 1 instead of slot + 1",
      "key % M should be key / M",
      "EMPTY should be replaced with 0 always",
    ],
    correctAnswer:
      "slot = slot + 1 can exceed the array bounds; it needs modulo M to wrap around: slot = (slot + 1) % M",
    explanation:
      "Without the modulo, once slot reaches M-1 and is occupied, incrementing it produces an out-of-bounds index M instead of wrapping back to 0.",
  },
  {
    type: "bug_detection",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText: "This Search function for closed hashing can loop forever on a full table. What's the bug?",
    codeSnippet: `bool Search(int key, int table[], int M) {\n    int slot = key % M;\n    while (table[slot] != EMPTY) {\n        if (table[slot] == key) return true;\n        slot = (slot + 1) % M;\n    }\n    return false;\n}`,
    choices: [
      "If the table is completely full (no EMPTY slot anywhere) and the key is absent, the loop never terminates because it never sees an EMPTY slot to stop at",
      "It should check table[slot] == EMPTY before entering the loop",
      "slot should never be recomputed with modulo",
      "key should be compared to M, not to table[slot]",
    ],
    correctAnswer:
      "If the table is completely full (no EMPTY slot anywhere) and the key is absent, the loop never terminates because it never sees an EMPTY slot to stop at",
    explanation:
      "The loop's only exit conditions are finding the key or hitting EMPTY; a full table with no matching key has neither, so the probe sequence cycles forever. A correct version must also bound the loop by the number of slots probed (at most M).",
  },
  {
    type: "bug_detection",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText: "This Delete function for closed hashing breaks future searches. What's wrong?",
    codeSnippet: `void Delete(int key, int table[], int M) {\n    int slot = key % M;\n    while (table[slot] != EMPTY) {\n        if (table[slot] == key) {\n            table[slot] = EMPTY;\n            return;\n        }\n        slot = (slot + 1) % M;\n    }\n}`,
    choices: [
      "It marks the slot EMPTY instead of using a tombstone/DELETED marker, which can cut off the probe sequence for other keys that probed past this slot",
      "It should not use modulo when advancing slot",
      "It compares table[slot] to key incorrectly",
      "It should always return true",
    ],
    correctAnswer:
      "It marks the slot EMPTY instead of using a tombstone/DELETED marker, which can cut off the probe sequence for other keys that probed past this slot",
    explanation:
      "Setting the slot to EMPTY (rather than a distinct DELETED marker) makes Search stop probing there, which can hide any other key that originally had to probe past this slot to find its own spot.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "Besides linear probing, what is another common probing strategy for closed hashing?",
    codeSnippet: null,
    choices: [
      "Quadratic probing or double hashing, which space out probes to reduce clustering",
      "Binary search probing",
      "Random shuffling of the whole array on every insert",
      "Bubble sort probing",
    ],
    correctAnswer: "Quadratic probing or double hashing, which space out probes to reduce clustering",
    explanation:
      "Quadratic probing (jumps of i^2) and double hashing (step size from a second hash function) are classic alternatives designed to reduce the primary clustering that plain linear probing suffers from.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "When closed hashing's load factor α gets too high, what must be done since the table can't simply grow a chain?",
    codeSnippet: null,
    choices: [
      "Allocate a larger array and rehash (reinsert) every existing entry into it",
      "Convert the array into a linked list on the fly",
      "Ignore new inserts until some keys are deleted",
      "Double every key's value",
    ],
    correctAnswer: "Allocate a larger array and rehash (reinsert) every existing entry into it",
    explanation:
      "Since closed hashing has a hard capacity of M, the only way to make more room is to resize to a bigger array and recompute every entry's slot in the new table.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "easy",
    questionText: "What are the three possible states a slot can be in for closed hashing with tombstone deletion?",
    codeSnippet: null,
    choices: [
      "Occupied (has a key), Empty (never used), Deleted (tombstone)",
      "Occupied and Empty only",
      "Full, Half-full, and Empty",
      "Locked and Unlocked",
    ],
    correctAnswer: "Occupied (has a key), Empty (never used), Deleted (tombstone)",
    explanation:
      "Supporting correct Delete requires distinguishing 'never used' (stop probing, key not found) from 'used to hold something, now removed' (keep probing) from 'currently holds a key.'",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "Why is closed hashing often faster than open hashing in practice, despite its stricter capacity limits?",
    codeSnippet: null,
    choices: [
      "All data lives in one contiguous array with good cache locality, avoiding the pointer-chasing overhead of linked chains",
      "It never has collisions",
      "It uses a faster hash function by definition",
      "It allows α greater than 1",
    ],
    correctAnswer:
      "All data lives in one contiguous array with good cache locality, avoiding the pointer-chasing overhead of linked chains",
    explanation:
      "Probing within a contiguous array tends to have better memory locality (fewer cache misses) than following linked-list pointers scattered across the heap, even though both are O(1+α)-ish on average.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "A closed hashing table with tombstones has had many inserts and deletes. Why might Search still be slow even if few keys are currently stored (small n)?",
    codeSnippet: null,
    choices: [
      "Accumulated tombstones from past deletes still force Search to keep probing through them, lengthening probe sequences",
      "Tombstones automatically reset α to 0",
      "Search always skips tombstones in O(1)",
      "Small n always means fast search in closed hashing",
    ],
    correctAnswer:
      "Accumulated tombstones from past deletes still force Search to keep probing through them, lengthening probe sequences",
    explanation:
      "Tombstones occupy a slot for probing purposes even though they don't count toward n; heavy churn (lots of insert/delete) can leave a table riddled with tombstones that slow every subsequent Search, which is why some implementations periodically rehash to clean them out.",
  },
  {
    type: "output_prediction",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "Table size M = 6, h(key) = key % 6. What slot does key 13 end up in, given slots 1 and 2 are already occupied?",
    codeSnippet: `int slot = key % M;\nwhile (occupied(slot))\n    slot = (slot + 1) % M;`,
    choices: ["Slot 3", "Slot 1", "Slot 2", "Slot 0"],
    correctAnswer: "Slot 3",
    explanation: "13 % 6 = 1. Slot 1 is occupied, probe to slot 2 (also occupied), probe to slot 3 (free) — 13 lands there.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the fundamental structural difference between open hashing and closed hashing?",
    codeSnippet: null,
    choices: [
      "Open hashing resolves collisions with external linked chains; closed hashing resolves them by probing for another slot within the same fixed array",
      "Open hashing uses arrays; closed hashing uses linked lists",
      "They are two names for the exact same technique",
      "Closed hashing does not use a hash function",
    ],
    correctAnswer:
      "Open hashing resolves collisions with external linked chains; closed hashing resolves them by probing for another slot within the same fixed array",
    explanation:
      "The key distinction is where colliding entries end up: outside the array in a chain (open), or inside the array itself via probing (closed).",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Why does Insert in closed hashing need to check for a DELETED (tombstone) marker, in addition to EMPTY, when looking for a slot to use?",
    codeSnippet: null,
    choices: [
      "A tombstone slot is free to reuse for a new entry, so stopping there (instead of only at truly EMPTY slots) lets Insert reclaim space from past deletions",
      "Tombstones must never be reused, to keep probe sequences stable",
      "Insert should treat DELETED the same as occupied",
      "Tombstones automatically become EMPTY after one probe",
    ],
    correctAnswer:
      "A tombstone slot is free to reuse for a new entry, so stopping there (instead of only at truly EMPTY slots) lets Insert reclaim space from past deletions",
    explanation:
      "If Insert only stopped at EMPTY slots, tombstones would permanently waste space even though they're logically free; treating DELETED as insertable reclaims that space for new keys.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "In closed hashing, what does it mean if Insert probes through all M slots and finds no EMPTY or DELETED slot?",
    codeSnippet: null,
    choices: [
      "The table is completely full (α = 1) and cannot accept the new key without resizing",
      "The key is a duplicate and should be rejected",
      "The hash function is broken",
      "It means the key should be inserted at slot 0 regardless",
    ],
    correctAnswer: "The table is completely full (α = 1) and cannot accept the new key without resizing",
    explanation:
      "If every single slot is genuinely occupied, there is nowhere left to place a new entry — this is exactly the hard capacity ceiling that closed hashing has and open hashing doesn't.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Table size M = 4, h(key) = key % 4. Keys 0, 4, 8 are inserted in order with linear probing. What slot does 8 land in?",
    codeSnippet: null,
    choices: ["Slot 2", "Slot 0", "Slot 1", "Slot 3"],
    correctAnswer: "Slot 2",
    explanation:
      "0%4=0 (slot 0). 4%4=0, taken, probe to slot 1 (free). 8%4=0, taken, probe slot 1 (taken), probe slot 2 (free) — 8 lands in slot 2.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "Which of these best describes why closed hashing is sometimes implemented with a 'circular array' rather than a plain array that stops at the last index?",
    codeSnippet: null,
    choices: [
      "So a key whose natural hash lands near the end of the array can still probe forward into free slots at the beginning instead of running out of room early",
      "Circular arrays use less memory than linear arrays",
      "It lets the array resize automatically",
      "It is required for the hash function to work at all",
    ],
    correctAnswer:
      "So a key whose natural hash lands near the end of the array can still probe forward into free slots at the beginning instead of running out of room early",
    explanation:
      "Without wraparound, keys that hash near the high end of the array would have far fewer probe options than keys hashing near the start — wrapping treats every starting slot fairly.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the time complexity of Search, Insert, and Delete in closed hashing when α is small (the table is mostly empty)?",
    codeSnippet: null,
    choices: [
      "All roughly O(1) on average, since few or no probes beyond the first are usually needed",
      "All O(n), regardless of α",
      "All O(log n)",
      "Insert is O(1) but Search and Delete are always O(n)",
    ],
    correctAnswer: "All roughly O(1) on average, since few or no probes beyond the first are usually needed",
    explanation:
      "When the table has lots of free space, the very first probe usually succeeds or finds an empty slot, so all three operations are close to constant time on average.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "A closed hashing table at α = 0.9 will typically perform much worse than the same table at α = 0.5. What is the main reason?",
    codeSnippet: null,
    choices: [
      "With fewer free slots available, probe sequences (and clusters) get dramatically longer as the table nears full capacity",
      "The hash function itself changes based on α",
      "At α = 0.9 the table automatically switches to open hashing",
      "Performance is identical regardless of α as long as α < 1",
    ],
    correctAnswer:
      "With fewer free slots available, probe sequences (and clusters) get dramatically longer as the table nears full capacity",
    explanation:
      "As free slots become scarce, both clustering and the number of probes needed to find an open slot (or confirm absence) grow sharply — performance degradation is non-linear as α approaches 1.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "easy",
    questionText: "If table[slot] is EMPTY during a Search, what should the algorithm conclude?",
    codeSnippet: null,
    choices: [
      "The key is definitely not in the table, since Insert would have placed it at or before the first EMPTY slot it probed",
      "The key is definitely in the table at a different slot",
      "The table must be rehashed immediately",
      "Nothing can be concluded from an EMPTY slot",
    ],
    correctAnswer:
      "The key is definitely not in the table, since Insert would have placed it at or before the first EMPTY slot it probed",
    explanation:
      "Insert always stops at the first EMPTY slot along its probe path, so if that key had ever been inserted, it would occupy a slot no later than this one — hitting EMPTY proves the key isn't present.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "hard",
    questionText: "Why can't Search safely stop at the first DELETED (tombstone) slot it encounters, the way it stops at EMPTY?",
    codeSnippet: null,
    choices: [
      "A key currently in the table may have probed past that tombstone to find its own slot, so stopping there would wrongly report it as absent",
      "DELETED slots always contain the key being searched for",
      "Tombstones are indistinguishable from EMPTY in every implementation",
      "Stopping at a tombstone is always safe and correct",
    ],
    correctAnswer:
      "A key currently in the table may have probed past that tombstone to find its own slot, so stopping there would wrongly report it as absent",
    explanation:
      "Unlike EMPTY (which guarantees nothing was ever placed further along that probe path at insert time), DELETED only means something used to be there — other keys may still be stored further along, so Search must keep going.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is a reasonable threshold at which many implementations trigger a rehash/resize for closed hashing?",
    codeSnippet: null,
    choices: [
      "When α exceeds some fixed fraction well below 1 (e.g. 0.7), to keep probe sequences short before clustering gets severe",
      "Only when α reaches exactly 1.0",
      "Never — closed hashing tables are never resized",
      "As soon as the table has a single entry",
    ],
    correctAnswer:
      "When α exceeds some fixed fraction well below 1 (e.g. 0.7), to keep probe sequences short before clustering gets severe",
    explanation:
      "Because performance degrades rapidly as α nears 1, practical implementations resize proactively at a comfortable threshold rather than waiting until the table is actually full.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "Which probing strategy is being described: probe i checks slot (h(x) + i) % M for i = 0, 1, 2, 3, ...?",
    codeSnippet: null,
    choices: ["Linear probing", "Quadratic probing", "Double hashing", "Random probing"],
    correctAnswer: "Linear probing",
    explanation:
      "Advancing by a constant step of 1 slot at a time (wrapping with modulo M) is the defining pattern of linear probing.",
  },
  {
    type: "concept",
    topic: "dsa_dict_closed_hashing",
    mode: "practice",
    difficulty: "medium",
    questionText: "Which statement about space usage correctly contrasts open hashing and closed hashing?",
    codeSnippet: null,
    choices: [
      "Closed hashing uses only the fixed array (no extra pointer overhead per entry); open hashing needs extra memory for linked-list pointers",
      "Open hashing never uses any extra memory beyond the array",
      "Closed hashing requires more memory than open hashing in every case",
      "Both use exactly the same amount of memory always",
    ],
    correctAnswer:
      "Closed hashing uses only the fixed array (no extra pointer overhead per entry); open hashing needs extra memory for linked-list pointers",
    explanation:
      "Each chained node in open hashing carries a 'next' pointer in addition to its data, while closed hashing's entries live directly in array slots with no per-entry pointer overhead — at the cost of a hard capacity limit.",
  },
  // DSA Exam 2 — Priority Queue (POT implementation)
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "easy",
    questionText: "What does a Priority Queue ADT's DeleteMin operation do?",
    codeSnippet: null,
    choices: [
      "Removes and returns the element with the smallest priority value currently in the queue",
      "Removes the element that was inserted first (FIFO)",
      "Removes the element that was inserted last (LIFO)",
      "Removes a random element",
    ],
    correctAnswer: "Removes and returns the element with the smallest priority value currently in the queue",
    explanation:
      "Unlike a plain queue or stack, a priority queue always serves (and removes) whichever element currently has the highest priority — for a min-priority queue, that's the smallest key.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "easy",
    questionText: "What does POT stand for in the context of priority queue implementation?",
    codeSnippet: null,
    choices: ["Partially Ordered Tree", "Point of Termination", "Position Offset Table", "Priority Order Tracker"],
    correctAnswer: "Partially Ordered Tree",
    explanation:
      "A POT (Partially Ordered Tree) — commonly called a binary heap — only enforces order between each parent and its children, not a full ordering among all nodes like a BST.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the defining heap-order property of a min-POT?",
    codeSnippet: null,
    choices: [
      "Every parent node's key is less than or equal to both of its children's keys",
      "The tree must be a full binary search tree",
      "Every left child is smaller than every right child across the whole tree",
      "All leaves must have the same key",
    ],
    correctAnswer: "Every parent node's key is less than or equal to both of its children's keys",
    explanation:
      "The heap-order property only constrains parent-child relationships; siblings and cousins have no required ordering between them — hence 'partially' ordered.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "Why must a POT also be a complete binary tree?",
    codeSnippet: null,
    choices: [
      "So it can be stored compactly in an array with no gaps, and so its height stays O(log n)",
      "So every node has exactly one child",
      "Completeness is not actually required for a POT",
      "So the tree can be traversed in sorted order directly",
    ],
    correctAnswer:
      "So it can be stored compactly in an array with no gaps, and so its height stays O(log n)",
    explanation:
      "Completeness (every level full except possibly the last, filled left-to-right) is what lets the tree be stored gap-free in a plain array and keeps the tree's height logarithmic in n.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "In a 0-indexed array representation of a POT, what are the formulas for a node at index i's children?",
    codeSnippet: null,
    choices: [
      "Left child = 2i + 1, right child = 2i + 2",
      "Left child = 2i, right child = 2i + 1",
      "Left child = i / 2, right child = i / 2 + 1",
      "Left child = i - 1, right child = i + 1",
    ],
    correctAnswer: "Left child = 2i + 1, right child = 2i + 2",
    explanation:
      "With 0-based indexing, each level doubles the index and shifts by 1 or 2 to reach the two children, which is the standard formula for an array-backed complete binary tree.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "In a 0-indexed array representation of a POT, what is the formula for the parent of node i (i > 0)?",
    codeSnippet: null,
    choices: ["(i - 1) / 2", "i / 2", "2i - 1", "i - 2"],
    correctAnswer: "(i - 1) / 2",
    explanation:
      "Reversing the child formulas (2i+1 and 2i+2) for 0-based indexing gives parent(i) = (i-1)/2 using integer division.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "easy",
    questionText: "Where is the minimum element always located in a min-POT?",
    codeSnippet: null,
    choices: ["At the root (index 0)", "At the last leaf", "At the middle of the array", "It can be anywhere"],
    correctAnswer: "At the root (index 0)",
    explanation:
      "The heap-order property guarantees every parent is <= its children, which by transitivity makes the root the smallest element in the whole tree.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the time complexity of FindMin (peeking at the smallest element) in a min-POT?",
    codeSnippet: null,
    choices: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: "O(1)",
    explanation:
      "Since the minimum is always at the root (index 0), finding it is just a single array access.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the general approach for Insert into a POT?",
    codeSnippet: null,
    choices: [
      "Place the new element at the next free slot (end of the array), then percolate it up, swapping with its parent while heap order is violated",
      "Place the new element at the root and push everything else down one level",
      "Search for the correct sorted position and shift all elements after it",
      "Always insert as the right child of the root",
    ],
    correctAnswer:
      "Place the new element at the next free slot (end of the array), then percolate it up, swapping with its parent while heap order is violated",
    explanation:
      "Appending at the end preserves completeness immediately; percolating up (SiftUp) then restores the heap-order property by bubbling the new value toward the root as needed.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "Why is Insert's time complexity O(log n) for a POT?",
    codeSnippet: null,
    choices: [
      "Percolating up can traverse at most the height of the tree, which is O(log n) for a complete binary tree of n nodes",
      "Because the array must be resorted after every insert",
      "Because it always swaps exactly log n times",
      "Because finding the next free slot takes O(log n)",
    ],
    correctAnswer:
      "Percolating up can traverse at most the height of the tree, which is O(log n) for a complete binary tree of n nodes",
    explanation:
      "In the worst case the new element bubbles all the way from a leaf to the root, a path whose length equals the tree's height — O(log n) for n nodes.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the general approach for DeleteMin on a POT?",
    codeSnippet: null,
    choices: [
      "Save the root's value to return, move the last element into the root, shrink the array by one, then percolate that element down, swapping with its smaller child while heap order is violated",
      "Simply remove the root and leave a gap",
      "Shift every element one position to the left",
      "Delete the last leaf instead of the root",
    ],
    correctAnswer:
      "Save the root's value to return, move the last element into the root, shrink the array by one, then percolate that element down, swapping with its smaller child while heap order is violated",
    explanation:
      "Moving the last element to the root keeps the tree complete; percolating down (SiftDown) then restores heap order by sinking that element toward its correct place.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "During percolate-down (SiftDown), which child should the out-of-place element be swapped with, in a min-POT?",
    codeSnippet: null,
    choices: [
      "The smaller of its two children (if that child is smaller than the element itself)",
      "Always the left child",
      "Always the right child",
      "Whichever child has a larger subtree",
    ],
    correctAnswer: "The smaller of its two children (if that child is smaller than the element itself)",
    explanation:
      "Swapping with the smaller child guarantees that after the swap, the new parent at that position really is <= both its children, correctly restoring heap order at that level.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "hard",
    questionText: "What is the time complexity of building a POT from scratch by inserting n elements one at a time?",
    codeSnippet: null,
    choices: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"],
    correctAnswer: "O(n log n)",
    explanation:
      "Each of the n inserts costs up to O(log n) in the worst case, giving a total of O(n log n) for n sequential inserts.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "What is the time complexity of the more efficient 'bottom-up heapify' approach to build a POT from an existing unordered array of n elements?",
    codeSnippet: null,
    choices: ["O(n)", "O(n log n)", "O(log n)", "O(n^2)"],
    correctAnswer: "O(n)",
    explanation:
      "Although each percolate-down is O(log n), most nodes are near the bottom of the tree and have very little distance left to sift, so the total work across all nodes sums to O(n), not O(n log n).",
  },
  {
    type: "output_prediction",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "Which array below correctly represents a valid min-POT (heap-ordered, 0-indexed)?",
    codeSnippet: null,
    choices: ["[2, 5, 4, 8, 9, 7]", "[2, 5, 4, 1, 9, 7]", "[9, 5, 4, 8, 2, 7]", "[5, 2, 4, 8, 9, 7]"],
    correctAnswer: "[2, 5, 4, 8, 9, 7]",
    explanation:
      "Checking parent-child pairs: index0=2 <= index1=5 and index2=4 (ok); index1=5 <= index3=8 and index4=9 (ok); index2=4 <= index5=7 (ok). Every parent is <= its children, so it's a valid min-heap.",
  },
  {
    type: "output_prediction",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "A min-POT is [1, 3, 2, 7, 4, 6, 5]. After Insert(0), the new element percolates up. What is the array afterward?",
    codeSnippet: null,
    choices: [
      "[0, 3, 1, 7, 4, 6, 5, 2]",
      "[1, 3, 2, 7, 4, 6, 5, 0]",
      "[0, 1, 2, 7, 4, 6, 5, 3]",
      "[0, 3, 2, 7, 4, 6, 5, 1]",
    ],
    correctAnswer: "[0, 3, 1, 7, 4, 6, 5, 2]",
    explanation:
      "0 is appended at index 7 (child of index 2, value 2). Since 0 < 2, swap: array becomes [...,2 at index7, 0 at index2]. Now 0 is at index2, whose parent is index0 (value 1). Since 0 < 1, swap again: 0 moves to index0, 1 moves to index2. Final: [0,3,1,7,4,6,5,2].",
  },
  {
    type: "output_prediction",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "A min-POT is [1, 4, 2, 9, 5, 7, 8]. DeleteMin is called. What is the array immediately after moving the last element to the root (before percolating down)?",
    codeSnippet: null,
    choices: ["[8, 4, 2, 9, 5, 7]", "[2, 4, 8, 9, 5, 7]", "[8, 1, 2, 9, 5, 7]", "[4, 8, 2, 9, 5, 7]"],
    correctAnswer: "[8, 4, 2, 9, 5, 7]",
    explanation:
      "DeleteMin removes the root (1) and replaces it with the last element (8), then shrinks the array to 6 elements: [8, 4, 2, 9, 5, 7] — before any percolate-down swaps happen.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Continuing from array [8, 4, 2, 9, 5, 7] after a DeleteMin's swap-to-root step, what does the array look like after percolate-down finishes restoring heap order?",
    codeSnippet: null,
    choices: [
      "[2, 4, 7, 9, 5, 8]",
      "[8, 4, 2, 9, 5, 7]",
      "[2, 4, 8, 9, 5, 7]",
      "[4, 2, 8, 9, 5, 7]",
    ],
    correctAnswer: "[2, 4, 7, 9, 5, 8]",
    explanation:
      "Root (8) has children 4 (index1) and 2 (index2); smaller is 2, and 8 > 2, so swap: [2,4,8,9,5,7]. Now 8 is at index2, whose children are index5 (7) only; 7 < 8, so swap: [2,4,7,9,5,8]. 8 is now a leaf — done.",
  },
  {
    type: "bug_detection",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "This Insert function for a min-POT never actually fixes heap order. What's the bug?",
    codeSnippet: `void Insert(int heap[], int* size, int value) {\n    heap[*size] = value;\n    (*size)++;\n}`,
    choices: [
      "It appends the value but never calls percolate-up to restore heap order",
      "It should insert at index 0 instead of *size",
      "(*size)++ should come before heap[*size] = value",
      "It should not modify *size at all",
    ],
    correctAnswer: "It appends the value but never calls percolate-up to restore heap order",
    explanation:
      "Appending alone keeps the tree complete but does nothing to maintain the heap-order property; a percolate-up step is required after the append to bubble the value to its correct place.",
  },
  {
    type: "bug_detection",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "hard",
    questionText: "This percolate-down function for a min-POT sometimes swaps with the larger child. What's the bug?",
    codeSnippet: `void PercolateDown(int heap[], int size, int i) {\n    int left = 2*i + 1, right = 2*i + 2;\n    int smallest = i;\n    if (left < size && heap[left] < heap[smallest]) smallest = left;\n    if (right < size || heap[right] < heap[smallest]) smallest = right;\n    if (smallest != i) {\n        swap(heap[i], heap[smallest]);\n        PercolateDown(heap, size, smallest);\n    }\n}`,
    choices: [
      "The second if uses || instead of &&, so it can pick 'right' as smallest even when right is out of bounds or not actually smaller",
      "The recursive call should pass i instead of smallest",
      "left and right formulas are swapped",
      "swap() should not be called at all",
    ],
    correctAnswer:
      "The second if uses || instead of &&, so it can pick 'right' as smallest even when right is out of bounds or not actually smaller",
    explanation:
      "Using || means the condition can be true just because right < size is false (short-circuit logic breaks down) or purely because heap[right] < heap[smallest] regardless of bounds, both of which can incorrectly select an out-of-bounds or larger value. It must be && like the first check.",
  },
  {
    type: "bug_detection",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "hard",
    questionText: "This DeleteMin function corrupts the heap. What's missing?",
    codeSnippet: `int DeleteMin(int heap[], int* size) {\n    int min = heap[0];\n    (*size)--;\n    PercolateDown(heap, *size, 0);\n    return min;\n}`,
    choices: [
      "It never copies the last element into the root (heap[0] = heap[*size]) before percolating down",
      "It decrements *size after percolating instead of before",
      "It should percolate up instead of down",
      "min should be heap[*size], not heap[0]",
    ],
    correctAnswer:
      "It never copies the last element into the root (heap[0] = heap[*size]) before percolating down",
    explanation:
      "Without moving the last element into the vacated root slot first, PercolateDown just sifts the old root's leftover value around instead of restoring a valid heap built from the remaining elements.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "What is the height of a POT containing n elements?",
    codeSnippet: null,
    choices: ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
    correctAnswer: "O(log n)",
    explanation:
      "Because a POT is a complete binary tree, each level roughly doubles the number of nodes, so the height needed to hold n nodes is logarithmic in n.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "hard",
    questionText: "How does Heapsort use a POT to sort an array of n elements?",
    codeSnippet: null,
    choices: [
      "Build a heap from the array, then repeatedly call DeleteMin (or DeleteMax) n times, placing each extracted element into the output in order",
      "Insert each element into a BST and read it back in order",
      "Randomly shuffle the heap until it happens to be sorted",
      "Heapsort does not use a POT at all",
    ],
    correctAnswer:
      "Build a heap from the array, then repeatedly call DeleteMin (or DeleteMax) n times, placing each extracted element into the output in order",
    explanation:
      "Each DeleteMin/DeleteMax always removes the current smallest/largest remaining element, so calling it n times in a row naturally produces the elements in sorted order.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "hard",
    questionText: "What is the overall time complexity of Heapsort on n elements?",
    codeSnippet: null,
    choices: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"],
    correctAnswer: "O(n log n)",
    explanation:
      "Building the heap takes O(n) (with bottom-up heapify), and then n calls to DeleteMin/DeleteMax each cost O(log n), for a total of O(n) + O(n log n) = O(n log n).",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "Why is a POT (array-backed binary heap) usually preferred over a sorted array for implementing a priority queue?",
    codeSnippet: null,
    choices: [
      "Insert and DeleteMin are both O(log n) in a heap, versus O(n) for Insert into a sorted array (to keep it sorted)",
      "A sorted array cannot support DeleteMin at all",
      "A POT uses less memory than any other structure",
      "A POT allows O(1) search for an arbitrary element",
    ],
    correctAnswer:
      "Insert and DeleteMin are both O(log n) in a heap, versus O(n) for Insert into a sorted array (to keep it sorted)",
    explanation:
      "A sorted array gives O(1) DeleteMin (just take the front) but O(n) Insert (must shift elements to keep it sorted); a heap balances both operations at O(log n) each, which is better overall for frequent inserts and deletes.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "In a max-POT, what does the heap-order property require?",
    codeSnippet: null,
    choices: [
      "Every parent's key is greater than or equal to both of its children's keys",
      "Every parent's key is less than or equal to both of its children's keys",
      "Every node's key equals its parent's key",
      "The tree must be perfectly balanced",
    ],
    correctAnswer: "Every parent's key is greater than or equal to both of its children's keys",
    explanation:
      "A max-heap is the mirror image of a min-heap: the largest element sits at the root, and every parent dominates its children instead of being dominated by them.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Why can't a POT support an efficient (better than O(n)) search for an arbitrary value, unlike a BST?",
    codeSnippet: null,
    choices: [
      "The heap-order property only constrains parent-child pairs, so a value could legally be in either subtree, giving no way to prune the search",
      "POTs do not store values, only priorities",
      "POTs are always sorted, so search should be O(log n) but isn't implemented",
      "Search is actually O(log n) in a POT",
    ],
    correctAnswer:
      "The heap-order property only constrains parent-child pairs, so a value could legally be in either subtree, giving no way to prune the search",
    explanation:
      "Unlike a BST (where comparing to a node tells you which single subtree to search), a heap gives no such guarantee between sibling subtrees, so an arbitrary search must potentially check every node — O(n).",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "What happens to the array's size after a successful Insert into a POT?",
    codeSnippet: null,
    choices: ["It grows by exactly one element", "It doubles", "It stays the same", "It shrinks by one"],
    correctAnswer: "It grows by exactly one element",
    explanation:
      "Insert always appends a single new element at the next free slot, so the logical size of the heap increases by exactly one.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "What happens to the array's size after a successful DeleteMin on a POT?",
    codeSnippet: null,
    choices: ["It shrinks by exactly one element", "It doubles", "It stays the same", "It grows by one"],
    correctAnswer: "It shrinks by exactly one element",
    explanation:
      "DeleteMin removes exactly one element (the former root) from the logical heap, so the size decreases by one.",
  },
  {
    type: "logic_tracing",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "A min-POT array is [3, 5, 4]. After Insert(1), the new element is placed at index 3 (child of index 1). What single swap restores heap order?",
    codeSnippet: null,
    choices: [
      "Swap index 3 (1) with index 1 (5), since 1 < 5 and 1 is also less than the root (3), requiring a further swap",
      "No swap is needed",
      "Swap index 3 with index 0 directly",
      "Swap index 3 with index 2",
    ],
    correctAnswer:
      "Swap index 3 (1) with index 1 (5), since 1 < 5 and 1 is also less than the root (3), requiring a further swap",
    explanation:
      "1 is compared to its parent at index1 (5); since 1 < 5, they swap, giving [3,1,4,5]. Now 1 is at index1, whose parent is index0 (3); since 1 < 3, they swap again, giving [1,3,4,5] — percolate-up required two swaps total.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "easy",
    questionText: "What is the only operation that is allowed to change which element sits at the root of a POT?",
    codeSnippet: null,
    choices: [
      "DeleteMin (or DeleteMax), and an Insert that percolates a smaller/larger value all the way up",
      "FindMin/Peek",
      "Traversal",
      "Nothing can ever change the root",
    ],
    correctAnswer:
      "DeleteMin (or DeleteMax), and an Insert that percolates a smaller/larger value all the way up",
    explanation:
      "FindMin/Peek is read-only. DeleteMin always replaces the root. An Insert can also change the root if the newly inserted value is extreme enough to percolate all the way to the top.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Which real-world scenario is a POT-based priority queue best suited for?",
    codeSnippet: null,
    choices: [
      "A task scheduler that must always run the highest-priority pending job next, as jobs are added and removed continuously",
      "A phone book that needs fast lookup by name",
      "A stack of undo operations",
      "A fixed, never-changing list of records",
    ],
    correctAnswer:
      "A task scheduler that must always run the highest-priority pending job next, as jobs are added and removed continuously",
    explanation:
      "Priority queues are the natural fit whenever you repeatedly need 'give me the most urgent item right now' while new items keep arriving — exactly what Insert + DeleteMin/DeleteMax provide efficiently.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "Why is percolate-down sometimes called 'sift-down' or 'heapify-down'?",
    codeSnippet: null,
    choices: [
      "Because the out-of-place element sinks downward through the tree, swapping with children until it settles in a valid heap-ordered position",
      "Because it processes the array from the last index down to the first",
      "Because it only works on the bottom half of the tree",
      "Because it deletes every node below the current one",
    ],
    correctAnswer:
      "Because the out-of-place element sinks downward through the tree, swapping with children until it settles in a valid heap-ordered position",
    explanation:
      "The names describe the motion: the value is repeatedly compared against its children and sinks ('sifts'/'percolates') toward the leaves until it reaches a spot where heap order holds.",
  },
  {
    type: "output_prediction",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText: "Given array index i = 5 (0-indexed) in a POT, what are its parent and children indices?",
    codeSnippet: `int parent = (i - 1) / 2;\nint left = 2*i + 1;\nint right = 2*i + 2;`,
    choices: [
      "parent = 2, left = 11, right = 12",
      "parent = 2, left = 10, right = 11",
      "parent = 3, left = 11, right = 12",
      "parent = 2, left = 12, right = 13",
    ],
    correctAnswer: "parent = 2, left = 11, right = 12",
    explanation: "(5-1)/2 = 2 for the parent; 2*5+1 = 11 and 2*5+2 = 12 for the children.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "hard",
    questionText:
      "Suppose a POT is implemented using 1-based array indexing instead of 0-based. What changes about the parent/child formulas?",
    codeSnippet: null,
    choices: [
      "parent(i) = i / 2, left(i) = 2i, right(i) = 2i + 1 — simpler formulas than the 0-based version",
      "The formulas are identical regardless of indexing base",
      "1-based indexing cannot be used for heaps",
      "Only the parent formula changes; children stay 2i+1 and 2i+2",
    ],
    correctAnswer:
      "parent(i) = i / 2, left(i) = 2i, right(i) = 2i + 1 — simpler formulas than the 0-based version",
    explanation:
      "Starting the array at index 1 (leaving index 0 unused) removes the -1/+1 offsets needed in the 0-based formulas, which is why some textbooks and implementations prefer 1-based heap arrays.",
  },
  {
    type: "concept",
    topic: "dsa_priority_queue",
    mode: "practice",
    difficulty: "medium",
    questionText:
      "A POT currently has n = 10 elements. After one Insert, what is the new size, and at which index does the new element initially get placed (0-indexed)?",
    codeSnippet: null,
    choices: ["Size becomes 11; new element starts at index 10", "Size becomes 11; new element starts at index 0", "Size stays 10; new element replaces the root", "Size becomes 9; the smallest leaf is removed"],
    correctAnswer: "Size becomes 11; new element starts at index 10",
    explanation:
      "With n=10 elements at indices 0-9, the next free slot (preserving completeness) is index 10, and the new size is n+1 = 11 before percolate-up even begins.",
  },
];

const seed = async () => {
  await sequelize.sync({ alter: true });
  // Re-runnable: clear prior seed rows per topic before inserting fresh ones.
  // Topics with real Attempt history attached (FK constraint) are left alone
  // instead of failing the whole run.
  const clearedTopics: string[] = [];
  const skippedTopics: string[] = [];
  for (const topicId of SEED_TOPIC_IDS) {
    try {
      await Question.destroy({
        where: { mode: "practice", topic: topicId },
      });
      clearedTopics.push(topicId);
    } catch (err) {
      skippedTopics.push(topicId);
      console.warn(
        `Skipped clearing topic "${topicId}" (likely referenced by existing Attempt rows):`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  const questionsToInsert = questions.filter(
    (q) => !skippedTopics.includes(q.topic),
  );
  await Question.bulkCreate(
    questionsToInsert as unknown as Record<string, unknown>[],
  );
  console.log(
    `Seeded ${questionsToInsert.length} questions across ${clearedTopics.length} topics.`,
  );
  if (skippedTopics.length > 0) {
    console.log(`Skipped topics (existing data preserved): ${skippedTopics.join(", ")}`);
  }
  process.exit(0);
};

export { questions, SEED_TOPIC_IDS };

if (require.main === module) {
  seed().catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
}
