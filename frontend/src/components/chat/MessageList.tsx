import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import CodeSnippet from "./CodeSnippet";

interface Message {
  _id: string;
  content: string;
  type: "text" | "code";
  language?: string;
  senderId: { _id: string; name: string };
  edited?: boolean;
  deleted?: boolean;
  createdAt: string;
}

interface Props {
  messages: Message[];
  onEditMessage: (messageId: string, content: string) => void;
  onDeleteMessage: (messageId: string) => void;
}

export default function MessageList({ messages, onEditMessage, onDeleteMessage }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const startEdit = (message: Message) => {
    setEditingId(message._id);
    setEditingContent(message.content);
    setMenuOpenId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent("");
  };

  const saveEdit = (messageId: string) => {
    if (!editingContent.trim()) return;
    onEditMessage(messageId, editingContent.trim());
    cancelEdit();
  };

  const toggleMenu = (messageId: string) => {
    setMenuOpenId((prev) => (prev === messageId ? null : messageId));
  };

  const closeMenu = () => setMenuOpenId(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
      {messages.map((msg) => {
        const isOwnMessage = user && msg.senderId._id === user.id;
        const isEditing = editingId === msg._id;

        const bubbleClass = isOwnMessage
          ? 'bg-gradient-to-r from-indigo-500/80 to-purple-600/80 text-white border-indigo-400/30 ml-auto shadow-lg'
          : 'bg-white/10 text-white border-white/20 shadow-md';

        return (
          <div key={msg._id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl ${isOwnMessage ? 'order-2' : 'order-1'} relative`}>
              <div className={`flex items-center justify-between gap-2 mb-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                <p className="text-xs text-white/50 font-medium">{msg.senderId.name}</p>
                {isOwnMessage && !msg.deleted && !isEditing && (
                  <div className="relative">
                    <button
                      onClick={() => toggleMenu(msg._id)}
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20"
                    >
                      <span className="text-lg">⋯</span>
                    </button>
                    {menuOpenId === msg._id && (
                      <div className="absolute right-0 top-full mt-2 w-32 rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl p-2 z-10">
                        {msg.edited && <div className="text-[10px] text-white/40 uppercase tracking-[0.18em] mb-2">edited</div>}
                        <button
                          onClick={() => startEdit(msg)}
                          className="w-full text-left px-3 py-2 rounded-xl text-sm text-white/80 hover:bg-white/10"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => { onDeleteMessage(msg._id); closeMenu(); }}
                          className="w-full text-left px-3 py-2 rounded-xl text-sm text-rose-300 hover:bg-rose-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {msg.deleted ? (
                <div className="text-sm px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white/30 italic blur-[0.5px] select-none">
                  This message was deleted.
                </div>
              ) : isEditing ? (
                <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <textarea
                    rows={msg.type === 'code' ? 4 : 2}
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full bg-slate-950/80 text-white rounded-xl p-3 outline-none border border-white/10 resize-none focus:border-indigo-400"
                  />
                  <div className="mt-3 flex gap-2 justify-end">
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-2 rounded-xl bg-white/10 text-white/80 hover:bg-white/20"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(msg._id)}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : msg.type === "code" ? (
                <CodeSnippet code={msg.content} language={msg.language || "javascript"} />
              ) : (
                <div className={`text-sm px-6 py-4 rounded-2xl backdrop-blur-sm border ${bubbleClass}`}>
                  {msg.content}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}