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
    <div className="rounded-xl overflow-hidden max-w-xl border border-gray-700">
      <div className="bg-gray-800 px-4 py-1 text-xs text-gray-400 flex justify-between">
        <span>{language}</span>
      </div>
      <pre className="!m-0 !rounded-none overflow-x-auto">
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}