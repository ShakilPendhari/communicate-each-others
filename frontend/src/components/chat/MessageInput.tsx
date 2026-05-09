import { useState } from "react";

const LANGUAGES = ["javascript", "typescript", "python", "bash"];

interface Props {
  onSend: (content: string, type: "text" | "code", language: string) => void;
}

export default function MessageInput({ onSend }: Props) {
  const [content, setContent] = useState("");
  const [mode, setMode] = useState<"text" | "code">("text");
  const [language, setLanguage] = useState("javascript");

  const handleSend = () => {
    if (!content.trim()) return;
    onSend(content.trim(), mode, language);
    setContent("");
  };

  return (
    <div className="px-6 py-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="flex gap-3 mb-3">
        <button
          onClick={() => setMode("text")}
          className={`text-sm px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
            mode === "text"
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
              : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/20"
          }`}
        >
          💬 Text
        </button>
        <button
          onClick={() => setMode("code")}
          className={`text-sm px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
            mode === "code"
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
              : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/20"
          }`}
        >
          💻 Code
        </button>
        {mode === "code" && (
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 outline-none focus:border-indigo-400 backdrop-blur-sm"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l} className="bg-slate-800">{l}</option>
            ))}
          </select>
        )}
      </div>
      <div className="flex gap-3">
        <textarea
          rows={mode === "code" ? 4 : 1}
          className="flex-1 bg-white/10 border border-white/20 text-white text-sm rounded-xl px-4 py-3 outline-none resize-none focus:border-indigo-400 placeholder-white/50 backdrop-blur-sm"
          placeholder={mode === "code" ? "Paste your code here..." : "Type a message..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && mode === "text") {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={!content.trim()}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22,2 15,22 11,13 2,9"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
}