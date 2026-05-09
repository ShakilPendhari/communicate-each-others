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

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;
    const handler = (msg: Message) => setMessages((prev) => [...prev, msg]);
    socket.on("new_message", handler);
    return () => { socket.off("new_message", handler); };
  }, [socket]);

  const handleSend = (content: string, type: "text" | "code", language: string) => {
    socket?.emit("send_message", { roomId, content, type, language });
  };

  return (
    <div className="flex flex-col flex-1 h-screen bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-900">
        <h2 className="text-white font-semibold"># {roomName}</h2>
      </div>
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} />
    </div>
  );
}