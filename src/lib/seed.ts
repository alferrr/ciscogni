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
