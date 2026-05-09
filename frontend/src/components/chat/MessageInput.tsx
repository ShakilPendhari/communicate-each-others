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
    <div className="px-4 py-3 border-t border-gray-800 bg-gray-900">
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setMode("text")}
          className={`text-xs px-3 py-1 rounded-full transition ${
            mode === "text" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400"
          }`}
        >
          Text
        </button>
        <button
          onClick={() => setMode("code")}
          className={`text-xs px-3 py-1 rounded-full transition ${
            mode === "code" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400"
          }`}
        >
          Code
        </button>
        {mode === "code" && (
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs bg-gray-800 text-gray-300 rounded-full px-3 py-1 outline-none"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        )}
      </div>
      <div className="flex gap-2">
        <textarea
          rows={mode === "code" ? 4 : 1}
          className="flex-1 bg-gray-800 text-white text-sm rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-indigo-500 font-mono"
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
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl transition disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}