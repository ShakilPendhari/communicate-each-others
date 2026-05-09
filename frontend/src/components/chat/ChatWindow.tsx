import { useEffect, useState } from "react";
import api from "../../services/api";
import { useSocket } from "../../context/SocketContext";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface Message {
  _id: string;
  content: string;
  type: "text" | "code";
  language?: string;
  senderId: { _id: string; name: string };
  createdAt: string;
}

interface Props {
  roomId: string;
  roomName: string;
}

export default function ChatWindow({ roomId, roomName }: Props) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);

  // Load history
  useEffect(() => {
    api.get(`/messages/${roomId}`).then(({ data }) => setMessages(data));
  }, [roomId]);

  // Listen for new messages and updates
  useEffect(() => {
    if (!socket) return;

    const newMessageHandler = (msg: Message) => setMessages((prev) => [...prev, msg]);
    const updateMessageHandler = (updated: Message) => {
      setMessages((prev) => prev.map((msg) => (msg._id === updated._id ? updated : msg)));
    };

    socket.on("new_message", newMessageHandler);
    socket.on("update_message", updateMessageHandler);

    return () => {
      socket.off("new_message", newMessageHandler);
      socket.off("update_message", updateMessageHandler);
    };
  }, [socket]);

  const handleSend = (content: string, type: "text" | "code", language: string) => {
    socket?.emit("send_message", { roomId, content, type, language });
  };

  const handleEditMessage = (messageId: string, content: string) => {
    socket?.emit("edit_message", { messageId, content });
  };

  const handleDeleteMessage = (messageId: string) => {
    socket?.emit("delete_message", { messageId });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="px-6 py-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <h2 className="text-white font-bold text-xl tracking-wide"># {roomName}</h2>
      </div>
      <MessageList
        messages={messages}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
      />
      <MessageInput onSend={handleSend} />
    </div>
  );
}