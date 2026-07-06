import {
  FaCode,
  FaBrain,
  FaBook,
  FaBolt,
  FaBug,
  FaListCheck,
} from "react-icons/fa6";

export const CLASSES = [
  {
    id: "prog1",
    label: "Programming 1",
    available: true,
    topics: [
      {
        id: "intro_programming",
        label: "Intro to Programming",
        color: "#1752f0",
        icon: "FaCode",
      },
      {
        id: "c_structure",
        label: "C Structure & Expressions",
        color: "#7c3aed",
        icon: "FaBrain",
      },
      { id: "functions", label: "Functions", color: "#059669", icon: "FaBolt" },
      {
        id: "builtin_functions",
        label: "Built-in Functions",
        color: "#0891b2",
        icon: "FaBook",
      },
      {
        id: "control_structure_1",
        label: "Control Structure I",
        color: "#dc2626",
        icon: "FaListCheck",
      },
      {
        id: "control_structure_2",
        label: "Control Structure II",
        color: "#d97706",
        icon: "FaListCheck",
      },
      {
        id: "testing_debugging",
        label: "Testing & Debugging",
        color: "#db2777",
        icon: "FaBug",
      },
      {
        id: "arrays_pointers",
        label: "Arrays & Pointers",
        color: "#0891b2",
        icon: "FaCode",
      },
    ],
    modes: [
      {
        id: "midterms",
        label: "Midterms",
        description:
          "Intro to Programming, Expressions, Functions, Built-ins, Control Structure I",
        color: "#1752f0",
        topics: [
          "intro_programming",
          "c_structure",
          "functions",
          "builtin_functions",
          "control_structure_1",
        ],
      },
      {
        id: "finals",
        label: "Finals",
        description:
          "Everything in Midterms + Loops, Debugging, Arrays & Pointers",
        color: "#7c3aed",
        topics: [
          "intro_programming",
          "c_structure",
          "functions",
          "builtin_functions",
          "control_structure_1",
          "control_structure_2",
          "testing_debugging",
          "arrays_pointers",
        ],
      },
    ],
  },
  {
    id: "prog2",
    label: "Programming 2",
    available: true,
    topics: [
      {
        id: "pointers_arrays",
        label: "Pointers & Arrays",
        color: "#1752f0",
        icon: "FaCode",
      },
      {
        id: "dynamic_memory",
        label: "Dynamic Memory",
        color: "#7c3aed",
        icon: "FaBrain",
      },
      {
        id: "array_operations",
        label: "Array Operations",
        color: "#059669",
        icon: "FaBolt",
      },
      {
        id: "sorting_searching",
        label: "Sorting & Searching",
        color: "#0891b2",
        icon: "FaListCheck",
      },
      {
        id: "libraries",
        label: "Program Structure & Libraries",
        color: "#dc2626",
        icon: "FaBook",
      },
      {
        id: "structures",
        label: "Structures & Unions",
        color: "#d97706",
        icon: "FaCode",
      },
      {
        id: "adt_list",
        label: "ADT List",
        color: "#db2777",
        icon: "FaListCheck",
      },
      {
        id: "linked_list",
        label: "Linked List",
        color: "#0891b2",
        icon: "FaBolt",
      },
      {
        id: "file_operations",
        label: "File Operations",
        color: "#059669",
        icon: "FaBook",
      },
    ],
    modes: [
      {
        id: "midterms",
        label: "Midterms",
        description:
          "Pointers, Dynamic Memory, Arrays, Sorting, Libraries, Structures",
        color: "#1752f0",
        topics: [
          "pointers_arrays",
          "dynamic_memory",
          "array_operations",
          "sorting_searching",
          "libraries",
          "structures",
        ],
      },
      {
        id: "finals",
        label: "Finals",
        description:
          "Everything in Midterms + ADT List, Linked List, File Operations",
        color: "#7c3aed",
        topics: [
          "pointers_arrays",
          "dynamic_memory",
          "array_operations",
          "sorting_searching",
          "libraries",
          "structures",
          "adt_list",
          "linked_list",
          "file_operations",
        ],
      },
    ],
  },
  {
    id: "dsa",
    label: "Data Structures & Algorithms",
    available: false,
    topics: [],
    modes: [],
  },
];

export const iconMap: Record<string, any> = {
  FaCode,
  FaBrain,
  FaBook,
  FaBolt,
  FaBug,
  FaListCheck,
};
