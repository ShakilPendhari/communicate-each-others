import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";

interface Props {
  code: string;
  language: string;
}

export default function CodeSnippet({ code, language }: Props) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) Prism.highlightElement(codeRef.current);
  }, [code]);

  return (
    <div className="rounded-2xl overflow-hidden max-w-xl border border-white/20 bg-black/30 backdrop-blur-sm shadow-lg">
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 px-4 py-3 text-sm text-white/80 flex justify-between border-b border-white/10">
        <span className="font-medium">{language}</span>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
      </div>
      <pre className="!m-0 !rounded-none overflow-x-auto bg-slate-900/50 p-4">
        <code ref={codeRef} className={`language-${language} text-white/90 block`}>
          {code}
        </code>
      </pre>
    </div>
  );
}