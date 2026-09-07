import Prism from "prismjs";
import { useMemo } from "react";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-bash";
import "./code-theme.css";

export const CodeView = ({ code, lang = "javascript" }) => {
  const source = typeof code === "string" ? code : String(code ?? "");

  // Highlight the exact string rather than calling Prism.highlightAll(), which
  // walks the whole document and fights React over the DOM it just rendered.
  const html = useMemo(() => {
    const grammar = Prism.languages[lang] ?? Prism.languages.javascript;

    try {
      return Prism.highlight(source, grammar, lang);
    } catch {
      // Fall back to escaped plain text rather than dropping the file.
      return source.replace(
        /[&<>]/g,
        (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c],
      );
    }
  }, [source, lang]);

  const lineCount = useMemo(() => source.split("\n").length, [source]);

  return (
    <div className="flex min-h-full w-full min-w-0 font-mono text-xs leading-[1.6]">
      {/* Gutter is aria-hidden so line numbers are not read out or copied. */}
      <div
        aria-hidden="true"
        className="text-muted-foreground/50 bg-muted/20 shrink-0 border-r px-3 py-3 text-right select-none"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      {/* min-w-0 lets this shrink below its content width so the horizontal
          scrollbar appears here instead of stretching the whole panel. */}
      <pre className="m-0 min-w-0 flex-1 overflow-x-auto border-none bg-transparent px-4 py-3">
        <code
          className={`language-${lang}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  );
};
