import jssvg from "../../styles/javascript-logo-svgrepo-com.svg";
import pysvg from "../../styles/python-logo-svgrepo-com.svg";
import cppsvg from "../../styles/cpp-logo-svgrepo-com.svg";

// Keys MUST match backend config/languages.ts LANG_CONFIG exactly —
// this string is sent as `lang` in the WS terminal-init/terminal-file messages.
export type ExecutionLanguage = "javascript" | "python" | "cpp";

type LangMeta = {
  label: string;
  icon: string;
  fileName: string; // mirrors LANG_CONFIG[lang].file on the backend
};

export const LANGUAGES: Record<ExecutionLanguage, LangMeta> = {
  javascript: { label: "JavaScript", icon: jssvg, fileName: "main.js" },
  python:     { label: "Python",     icon: pysvg, fileName: "main.py" },
  cpp:        { label: "C++",        icon: cppsvg, fileName: "main.cpp" },
};

export const LANGUAGE_LIST = Object.keys(LANGUAGES) as ExecutionLanguage[];