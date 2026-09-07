/**
 * Output comparison for judging solutions.
 *
 * Tries, in order:
 *   1. Exact string match
 *   2. Whitespace-insensitive match ("[1, 2]" == "[1,2]")
 *   3. JSON-structural match (spacing/formatting differences)
 *   4. Boolean case-insensitive ("True" == "true")
 *   5. Order-insensitive match for a list-of-lists (e.g. 3Sum triplets),
 *      where the order of rows — and values within each row — is irrelevant.
 *
 * Step 5 is intentionally limited to 2D arrays (arrays whose every element is
 * itself an array). This is the classic "set of tuples" answer shape where
 * order carries no meaning. Flat 1D arrays stay order-sensitive so that
 * problems like "sort this array" are still judged strictly.
 */

function canonicalize(v: unknown): unknown {
  if (Array.isArray(v)) {
    const items = v.map(canonicalize);
    items.sort((a, b) => {
      const sa = JSON.stringify(a);
      const sb = JSON.stringify(b);
      return sa < sb ? -1 : sa > sb ? 1 : 0;
    });
    return items;
  }
  return v;
}

function is2DArray(v: unknown): boolean {
  return Array.isArray(v) && v.length > 0 && v.every((x) => Array.isArray(x));
}

function unorderedMatch(a: string, b: string): boolean {
  try {
    const pa = JSON.parse(a);
    const pb = JSON.parse(b);
    if (!is2DArray(pa) || !is2DArray(pb)) return false;
    return JSON.stringify(canonicalize(pa)) === JSON.stringify(canonicalize(pb));
  } catch {
    return false;
  }
}

export function outputsMatch(actual: string, expected: string): boolean {
  const a = (actual ?? "").trim();
  const e = (expected ?? "").trim();

  if (a === e) return true;

  // Whitespace-insensitive
  if (a.replace(/\s+/g, "") === e.replace(/\s+/g, "")) return true;

  // JSON-structural (order-sensitive)
  try {
    if (JSON.stringify(JSON.parse(a)) === JSON.stringify(JSON.parse(e))) return true;
  } catch {
    /* not JSON — ignore */
  }

  // Boolean case-insensitive
  const el = e.toLowerCase();
  if (el === "true" || el === "false") return a.toLowerCase() === el;

  // Order-insensitive for list-of-lists answers (3Sum, subsets, combinations…)
  if (unorderedMatch(a, e)) return true;

  return false;
}
