import { z } from "zod";

export const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  // Fixed typo: Changed "EAST" to "EASY" to match database context options
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  // useFieldArray requires object fields, not raw primitives.
  // Tags are stored as [{value: string}] in the form and mapped to string[] on submit.
  tags: z
    .array(z.object({ value: z.string().min(1, "Tag cannot be empty") }))
    .min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),

  testCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      }),
    )
    .min(1, "At least one test case is required"),

  examples: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    CPP: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
  }),

  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    CPP: z.string().min(1, "C++ code snippet is required"),
  }),

  // Fixed Name Mismatch: Changed from referenceSolution to referenceSolutions
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript reference solution is required"),
    PYTHON: z.string().min(1, "Python reference solution is required"),
    CPP: z.string().min(1, "C++ reference solution is required"),
  }),

  // Admin toggle: skip Wandbox validation (useful when validation service is unreachable)
  skipValidation: z.boolean().optional().default(false),
});

export type ProblemFormData = z.infer<typeof problemSchema>;

export const defaultFormValuses = {
  title: "",
  description: "",
  difficulty: undefined,
  constraints: "",
  hints: "",
  editorial: "",
  testCases: [
    {
      input: "",
      output: "",
    },
  ],
  tags: [{ value: "" }],
  examples: {
    JAVASCRIPT: { input: "", output: "", explanation: "" },
    PYTHON: { input: "", output: "", explanation: "" },
    CPP: { input: "", output: "", explanation: "" },
  },
  codeSnippets: {
    JAVASCRIPT: "// Read input from stdin\nconst n = parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());\n\nfunction solve(n) {\n    // Write your solution here\n}\n\n// Print result\nconsole.log(solve(n));",
    PYTHON: "import sys\nn = int(sys.stdin.read().strip())\n\ndef solve(n: int) -> int:\n    # Write your solution here\n    pass\n\nprint(solve(n))\n",
    CPP: "#include <iostream>\nusing namespace std;\n\nint solve(int n) {\n    // Write your solution here\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << solve(n) << endl;\n    return 0;\n}",
  },
  // Sync name key update to plural structure safely
  referenceSolutions: {
    JAVASCRIPT: "",
    PYTHON: "",
    CPP: "",
  },
  skipValidation: false,
};

export const LANGUAGES = ["JAVASCRIPT", "PYTHON", "CPP"];

export const DIFFICULTY_OPTIONS = [
  { value: "EASY", label: "Easy", className: "bg-green-500 text-white" },
  { value: "MEDIUM", label: "Medium", className: "bg-yellow-500 text-white" },
  { value: "HARD", label: "Hard", className: "bg-red-500 text-white" },
];
