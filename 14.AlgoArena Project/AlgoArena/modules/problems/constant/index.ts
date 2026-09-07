export const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
export const ITEMS_PER_PAGE = 10;

export const DEFAULT_FILTERS = {
  search: "",
  difficulty: "ALL",
  tag: "ALL",
};

export const DIFFICULTY_COLORS = {
  EASY: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  MEDIUM:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  HARD: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

export const getDifficultyColor = (
  difficulty: keyof typeof DIFFICULTY_COLORS,
) => {
  return (
    DIFFICULTY_COLORS[difficulty] ||
    "bg-slate-500/10 text-slate-400 border-slate-500/20"
  );
};

export const LANGUAGE_OPTIONS = [
  { value: "JAVASCRIPT", label: "JavaScript" },
  { value: "PYTHON", label: "Python" },
  { value: "CPP", label: "C++" },
];

export const getEditorLanguage = (language: string) => {
  return (language || "javascript").toLowerCase();
};

export const EDITOR_OPTIONS = {
  fontSize: 14,
  minimap: { enabled: false },
  wordWrap: "on" as const,
  lineNumbers: "on" as const,
  roundedSelection: false,
  automaticLayout: true,
  scrollBeyondLastLine: false,
  renderLineHighlight: "all" as const,
  tabSize: 2,
  formatOnType: true,
  formatOnPaste: true,
};
