/**
 * Smart Code Wrapper — AlgoArena
 *
 * Auto-injects stdin/stdout driver for LeetCode-style class/function solutions.
 *
 * Input formats understood:
 *   Simple single value:   "4"
 *   JSON:                  "[1,2,3]"
 *   Named multi-arg:       "nums = [2,7,11,15] target = 9"
 *
 * Languages: Python, JavaScript, C++
 */

// ─── Python ─────────────────────────────────────────────────────────────────

function isCompletePython(code: string): boolean {
  return (
    /input\s*\(\)|sys\.stdin|raw_input/.test(code) &&
    /print\s*\(/.test(code)
  );
}

function extractPythonMethodParams(code: string, methodName?: string): string[] {
  const regex = methodName
    ? new RegExp(`def\\s+${methodName}\\s*\\(\\s*self\\s*(?:,\\s*([^)]*))?\\)`)
    : /class\\s+Solution[^:]*:[\\s\\S]*?def\\s+[a-zA-Z]\\w*\\s*\\(\\s*self\\s*(?:,\\s*([^)]*))?\\)/;
  const m = code.match(regex);
  if (!m?.[1]) return [];
  return m[1]
    .split(",")
    .map((p) => p.trim().split(":")[0].trim().split("=")[0].trim())
    .filter(Boolean);
}

// Shared Python driver template (embedded in both class and function wrappers)
const PYTHON_DRIVER = `
import sys as _sys

def _auto_parse(s: str):
    s = s.strip()
    try: return int(s)
    except ValueError: pass
    try: return float(s)
    except ValueError: pass
    import json as _json
    try: return _json.loads(s)
    except Exception: pass
    return s


def _parse_named(raw: str):
    import re as _re, json as _json
    result = {}
    # Match: word = value, where value stops before next key or end of string
    pat = r'(\\w+)\\s*=\\s*(.+?)(?=\\s\\w+\\s*=|$)'
    for m in _re.finditer(pat, raw):
        k, v = m.group(1), m.group(2).strip()
        try:
            result[k] = _json.loads(v)
        except Exception:
            result[k] = v.strip("'\\"")
    return result


def _fmt(v):
    if isinstance(v, bool): return str(v).lower()
    import json as _json
    if isinstance(v, (list, dict)): return _json.dumps(v, separators=(',', ':'))
    if v is None: return ''
    return str(v)

_raw = _sys.stdin.read().strip()
_named = _parse_named(_raw)
`;

function wrapPython(code: string, entrypointName?: string): string {
  if (isCompletePython(code)) return code;

  // ── class Solution ────────────────────────────────────────────────────────
  let method = entrypointName;
  if (!method) {
    const classMeth = code.match(
      /class\s+Solution[^:]*:[\s\S]*?def\s+([a-zA-Z]\w*)\s*\(\s*self/
    );
    method = classMeth?.[1];
  }

  if (method) {
    const params = extractPythonMethodParams(code, method);
    const callArgs =
      params.length > 1
        ? params.map((p) => `_named.get('${p}', _auto_parse(_raw))`).join(", ")
        : "_auto_parse(_raw)";

    return (
      code +
      PYTHON_DRIVER +
      `
try:
    _sol = Solution()
    if _named and len(_named) > 1:
        _result = _sol.${method}(${callArgs})
    else:
        _result = _sol.${method}(_auto_parse(_raw))
    print(_fmt(_result))
except Exception as _e:
    print(str(_e), file=_sys.stderr)
`
    );
  }

  // ── standalone def ────────────────────────────────────────────────────────
  const funcMatches = [...code.matchAll(/^def\s+([a-zA-Z]\w*)\s*\(([^)]*)\)/mg)];
  const pub = funcMatches.find((m) => !m[1].startsWith("_"));
  if (pub) {
    const fn     = pub[1];
    const params = pub[2]
      .split(",")
      .map((p) => p.trim().split(":")[0].trim().split("=")[0].trim())
      .filter(Boolean);
    const callArgs =
      params.length > 1
        ? params.map((p) => `_named.get('${p}', _auto_parse(_raw))`).join(", ")
        : "_auto_parse(_raw)";

    return (
      code +
      PYTHON_DRIVER +
      `
try:
    if _named and len(_named) > 1:
        _result = ${fn}(${callArgs})
    else:
        _result = ${fn}(_auto_parse(_raw))
    print(_fmt(_result))
except Exception as _e:
    print(str(_e), file=_sys.stderr)
`
    );
  }

  return code;
}

// ─── JavaScript ─────────────────────────────────────────────────────────────

function isCompleteJs(code: string): boolean {
  return (
    /console\.log/.test(code) &&
    /require\s*\(\s*['"]fs['"]\s*\)|readline|process\.stdin/.test(code)
  );
}

function extractJsParams(code: string, fnName: string): string[] {
  const pats = [
    new RegExp(`function\\s+${fnName}\\s*\\(([^)]*)\\)`),
    new RegExp(`(?:const|let|var)\\s+${fnName}\\s*=\\s*(?:async\\s*)?\\(([^)]*)\\)\\s*=>`),
    new RegExp(`(?:const|let|var)\\s+${fnName}\\s*=\\s*(?:async\\s*)?function\\s*\\(([^)]*)\\)`),
  ];
  for (const p of pats) {
    const m = code.match(p);
    if (m?.[1]) {
      return m[1]
        .split(",")
        .map((s) => s.trim().split("=")[0].trim())
        .filter(Boolean);
    }
  }
  return [];
}

function wrapJavaScript(code: string, entrypointName?: string): string {
  if (isCompleteJs(code)) return code;

  let fn = entrypointName;
  if (!fn) {
    const funcMatch = code.match(
      /(?:function\s+([a-zA-Z]\w*)|(?:var|let|const)\s+([a-zA-Z]\w*)\s*=\s*(?:async\s*)?(?:function|\())/
    );
    fn = funcMatch?.[1] ?? funcMatch?.[2] ?? "solve";
  }
  const params = extractJsParams(code, fn);

  const driver = `

// ── AlgoArena driver ──────────────────────────────────────────────────────
const _fs  = require('fs');
const _raw = _fs.readFileSync('/dev/stdin', 'utf8').trim();

function _parseValue(s) {
    s = s.trim();
    if (s === 'true')  return true;
    if (s === 'false') return false;
    if (s === 'null')  return null;
    const n = Number(s);
    if (!isNaN(n) && s !== '') return n;
    try { return JSON.parse(s); } catch(e) {}
    return s;
}

function _parseNamedArgs(raw) {
    const named = {};
    // Match: word = value, where value stops before the next "word =" or end of string
    const re = /(\\w+)\\s*=\\s*(.+?)(?=\\s+\\w+\\s*=|$)/gs;
    let m;
    while ((m = re.exec(raw)) !== null) {
        const k = m[1], v = m[2].trim();
        try { named[k] = JSON.parse(v); }
        catch(e) { named[k] = _parseValue(v); }
    }
    return named;
}


function _fmt(v) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'boolean') return String(v);
    if (Array.isArray(v) || (typeof v === 'object')) return JSON.stringify(v);
    return String(v);
}

try {
    const _named = _parseNamedArgs(_raw);
    const _nKeys = Object.keys(_named);
    let   _result;

    if (_nKeys.length > 1) {
        const _params = ${JSON.stringify(params)};
        if (_params.length > 0) {
            _result = ${fn}(..._params.map(p => _named[p] !== undefined ? _named[p] : _parseValue(_raw)));
        } else {
            _result = ${fn}(..._nKeys.map(k => _named[k]));
        }
    } else if (_nKeys.length === 1) {
        _result = ${fn}(_named[_nKeys[0]]);
    } else {
        _result = ${fn}(_parseValue(_raw));
    }

    const _out = _fmt(_result);
    if (_out !== '') console.log(_out);
} catch(e) {
    process.stderr.write(String(e) + '\\n');
}
`;

  return code + driver;
}

// ─── C++ ─────────────────────────────────────────────────────────────────────

function isCompleteCpp(code: string): boolean {
  return /int\s+main\s*\(/.test(code);
}

interface CppParam {
  baseType: string;  // "vector<int>", "int", "string", "bool"
  name:     string;  // "nums", "target", "s", "n"
  isVec:    boolean;
  isStr:    boolean;
  isBool:   boolean;
}

/** Split "vector<int>& nums, int target" on top-level commas only. */
function splitCppParams(paramStr: string): string[] {
  const parts: string[] = [];
  let depth = 0, cur = "";
  for (const ch of paramStr) {
    if (ch === "<") depth++;
    else if (ch === ">") depth--;
    else if (ch === "," && depth === 0) {
      if (cur.trim()) parts.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

function parseCppParams(paramStr: string): CppParam[] {
  return splitCppParams(paramStr)
    .map((p) => {
      const clean = p.replace(/&/g, "").replace(/\s+/g, " ").trim();
      // The last word is the param name; everything before is the type
      const lastSpace = clean.lastIndexOf(" ");
      if (lastSpace < 0) return null;
      const baseType = clean.slice(0, lastSpace).trim();
      const name     = clean.slice(lastSpace + 1).trim();
      if (!name || !baseType) return null;
      return {
        baseType,
        name,
        isVec:  /vector/.test(baseType),
        isStr:  baseType === "string",
        isBool: baseType === "bool",
      };
    })
    .filter((x): x is CppParam => x !== null);
}

/**
 * Generates a C++ variable declaration for one parameter, parsing its value
 * from the raw stdin string using the injected `_aa` helper functions.
 * Handles: vector<int>, vector<vector<int>>, vector<string>, string, bool,
 * integral (int/long/long long), and floating (double/float).
 */
function cppDeclParam(p: CppParam): string {
  const clean = p.baseType
    .replace(/\bconst\b/g, "")
    .replace(/[*&]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const bt = clean.replace(/\s+/g, "");
  const field = `_aa::field(_raw, "${p.name}")`;

  if (/^vector<vector</.test(bt)) {
    return `    vector<vector<int>> ${p.name} = _aa::toIntVec2(${field});`;
  }
  if (/^vector<(string|basic_string)/.test(bt)) {
    return `    vector<string> ${p.name} = _aa::toStrVec(${field});`;
  }
  if (/^vector</.test(bt)) {
    return `    vector<int> ${p.name} = _aa::toIntVec(${field});`;
  }
  if (bt === "string") {
    return `    string ${p.name} = _aa::toStr(${field});`;
  }
  if (bt === "bool") {
    return `    bool ${p.name} = _aa::toBool(${field});`;
  }
  if (bt === "double" || bt === "float") {
    return `    ${clean} ${p.name} = (${clean})_aa::toDouble(${field});`;
  }
  // integral: int, long, long long, unsigned, size_t, etc.
  return `    ${clean} ${p.name} = (${clean})_aa::toLL(${field});`;
}

/**
 * C++ helper namespace injected into every wrapped program. Provides input
 * parsing (named-arg aware) and generic recursive printing that matches the
 * LeetCode JSON output style, e.g. vector<vector<int>> -> [[1,2],[3,4]].
 *
 * NOTE: kept free of backslash escape sequences so it survives being embedded
 * in a JS template literal unchanged.
 */
const AA_CPP_HELPERS = `
namespace _aa {
static string trim(const string& s){
    size_t a=0,b=s.size();
    while(a<b && isspace((unsigned char)s[a])) a++;
    while(b>a && isspace((unsigned char)s[b-1])) b--;
    return s.substr(a,b-a);
}
// Extract the value for a named field "name = <value>"; if no such named marker
// exists, returns the whole trimmed input (single-argument case).
static string field(const string& raw, const string& name){
    size_t p = raw.find(name);
    while(p != string::npos){
        bool boundary = (p==0) || !(isalnum((unsigned char)raw[p-1]) || raw[p-1]=='_');
        if(boundary){
            size_t q = raw.find('=', p + name.size());
            if(q != string::npos){
                bool ok=true;
                for(size_t i=p+name.size(); i<q; ++i){ if(!isspace((unsigned char)raw[i])){ ok=false; break; } }
                if(ok){
                    string rest = raw.substr(q+1);
                    size_t nq = rest.find('=');
                    if(nq != string::npos){
                        size_t e = nq;
                        while(e>0 && isspace((unsigned char)rest[e-1])) e--;
                        size_t idend = e;
                        while(e>0 && (isalnum((unsigned char)rest[e-1]) || rest[e-1]=='_')) e--;
                        if(idend>e) rest = rest.substr(0,e);
                    }
                    return trim(rest);
                }
            }
        }
        p = raw.find(name, p+1);
    }
    return trim(raw);
}
static long long toLL(const string& s){
    size_t i=0; while(i<s.size() && s[i]!='-' && !isdigit((unsigned char)s[i])) i++;
    if(i>=s.size()) return 0;
    try { return stoll(s.substr(i)); } catch(...) { return 0; }
}
static double toDouble(const string& s){
    size_t i=0; while(i<s.size() && s[i]!='-' && s[i]!='.' && !isdigit((unsigned char)s[i])) i++;
    if(i>=s.size()) return 0;
    try { return stod(s.substr(i)); } catch(...) { return 0; }
}
static bool toBool(const string& s){ string t=trim(s); return t.substr(0,4)=="true" || t=="1"; }
static string toStr(const string& s){
    size_t q1=s.find('"');
    if(q1!=string::npos){ size_t q2=s.find('"',q1+1); if(q2!=string::npos) return s.substr(q1+1,q2-q1-1); }
    return trim(s);
}
static vector<int> parseInts(const string& s){
    vector<int> v; string num;
    for(char c: s){
        if(c=='-'||isdigit((unsigned char)c)) num+=c;
        else { if(!num.empty()){ try{ v.push_back(stoi(num)); }catch(...){} num.clear(); } }
    }
    if(!num.empty()){ try{ v.push_back(stoi(num)); }catch(...){} }
    return v;
}
static vector<int> toIntVec(const string& s){ return parseInts(s); }
static vector<vector<int>> toIntVec2(const string& s){
    vector<vector<int>> res; int depth=0; string cur; bool in=false;
    for(char c: s){
        if(c=='['){ depth++; if(depth==2){ in=true; cur=""; } }
        else if(c==']'){ if(depth==2 && in){ res.push_back(parseInts(cur)); in=false; } if(depth>0) depth--; }
        else if(in) cur+=c;
    }
    return res;
}
static vector<string> toStrVec(const string& s){
    vector<string> v; bool in=false; string cur;
    for(char c: s){
        if(c=='"'){ if(in){ v.push_back(cur); cur=""; in=false; } else in=true; }
        else if(in) cur+=c;
    }
    return v;
}
static void pr(bool x){ cout<<(x?"true":"false"); }
static void pr(const string& s){ cout<<s; }
static void pr(const char* s){ cout<<s; }
template<class T> static void pr(const T& x){ cout<<x; }
template<class T> static void pr(const vector<T>& v){
    cout<<"[";
    for(size_t i=0;i<v.size();++i){ if(i) cout<<","; pr(v[i]); }
    cout<<"]";
}
}
`;

/**
 * Detect the entry function to call — works for BOTH a free function
 * (e.g. `vector<vector<int>> threeSum(vector<int>& nums)`) and a
 * `class Solution { ... }` method. Handles multi-line signatures.
 */
function findCppEntry(
  code: string,
  entrypointName?: string
): { retType: string; methodName: string; params: string } | null {
  const RET = "[\\w:<>,\\s\\*&]+?";
  const SKIP = /^(if|for|while|switch|catch|return|else|do|sizeof)$/;

  if (entrypointName) {
    const m = code.match(
      new RegExp(`(${RET})\\s+(${entrypointName})\\s*\\(([\\s\\S]*?)\\)\\s*(?:const\\s*)?\\{`)
    );
    if (m) return { retType: m[1].trim(), methodName: m[2].trim(), params: m[3].trim() };
  }

  // Auto-detect: scan for "<retType> <name>(<params>) {" definitions.
  const re = new RegExp(
    `(${RET})\\s+([A-Za-z_]\\w*)\\s*\\(([\\s\\S]*?)\\)\\s*(?:const\\s*)?\\{`,
    "g"
  );
  let m: RegExpExecArray | null;
  while ((m = re.exec(code)) !== null) {
    const nm = m[2].trim();
    if (nm === "main" || SKIP.test(nm)) continue;
    return { retType: m[1].trim(), methodName: nm, params: m[3].trim() };
  }
  return null;
}

function wrapCpp(code: string, entrypointName?: string): string {
  if (isCompleteCpp(code)) return code;

  // Prepend standard headers if missing
  const hasInclude = /#include/.test(code);
  const hasUsing   = /using\s+namespace\s+std/.test(code);
  let prefix = "";
  if (!hasInclude) prefix += "#include <bits/stdc++.h>\n";
  if (!hasUsing)   prefix += "using namespace std;\n";
  if (prefix)      prefix += "\n";

  const fullCode = prefix + code;

  const sig = findCppEntry(fullCode, entrypointName);
  if (!sig) return fullCode; // can't detect an entry — return unchanged

  const params  = parseCppParams(sig.params);
  const decls   = params.map(cppDeclParam).join("\n");
  const argList = params.map((p) => p.name).join(", ");

  const hasSolutionClass = /(?:class|struct)\s+Solution\b/.test(fullCode);
  const callExpr = hasSolutionClass
    ? `Solution _sol;\n    auto _res = _sol.${sig.methodName}(${argList});`
    : `auto _res = ${sig.methodName}(${argList});`;

  const driver = `
${AA_CPP_HELPERS}
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Read ALL of stdin (handles multi-line inputs)
    string _raw, _line;
    while (getline(cin, _line)) {
        if (!_raw.empty()) _raw += " ";
        _raw += _line;
    }

${decls}

    ${callExpr}
    _aa::pr(_res);
    cout << endl;
    return 0;
}
`;

  return fullCode + driver;
}

// ─── Public facade ───────────────────────────────────────────────────────────

export function wrapCode(language: string, code: string, entrypointName?: string): string {
  switch (language.toUpperCase()) {
    case "PYTHON":     return wrapPython(code, entrypointName);
    case "JAVASCRIPT":
    case "JS":         return wrapJavaScript(code, entrypointName);
    case "CPP":        return wrapCpp(code, entrypointName);
    default:           return code;
  }
}

export function extractEntrypointName(language: string, templateCode: string): string | null {
  const lang = language.toUpperCase();
  if (lang === "PYTHON") {
    const m = templateCode.match(/def\s+([a-zA-Z]\w*)\s*\(\s*self/);
    return m ? m[1] : null;
  }
  if (lang === "JAVASCRIPT" || lang === "JS") {
    const m = templateCode.match(
      /(?:function\s+([a-zA-Z]\w*)|(?:var|let|const)\s+([a-zA-Z]\w*)\s*=\s*(?:async\s*)?(?:function|\())/
    );
    return m ? (m[1] ?? m[2]) : null;
  }
  if (lang === "CPP") {
    // Handles both class Solution methods and standalone free functions,
    // including multi-line signatures.
    const sig = findCppEntry(templateCode);
    return sig ? sig.methodName : null;
  }
  return null;
}
