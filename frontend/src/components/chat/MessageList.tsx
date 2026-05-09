import { useEffect, useRef } from "react";
import CodeSnippet from "./CodeSnippet";

interface Message {
  _id: string;
  content: string;
  type: "text" | "code";
  language?: string;
  senderId: { _id: string; name: string };
  createdAt: string;
}

export default function MessageList({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.map((msg) => (
        <div key={msg._id}>
          <p className="text-xs text-gray-500 mb-1">{msg.senderId.name}</p>
          {msg.type === "code" ? (
            <CodeSnippet code={msg.content} language={msg.language || "javascript"} />
          ) : (
            <div className="bg-gray-800 text-gray-100 text-sm px-4 py-3 rounded-xl max-w-xl">
              {msg.content}
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}