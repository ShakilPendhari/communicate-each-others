import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../../context/SocketContext";
import { useEncryption } from "../../context/EncryptionContext";
import { encryptMessage, decryptMessage, isCryptoSupported } from "../../utils/crypto";
import { messageService } from "../../services/message";
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
  const { getOrCreateKey } = useEncryption();
  const [messages, setMessages] = useState<Message[]>([]);
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize encryption for the room automatically
  useEffect(() => {
    if (!isCryptoSupported()) {
      setError("Security Unavailable: Please use HTTPS or localhost.");
      return;
    }

    const initEncryption = async () => {
      try {
        const key = await getOrCreateKey(roomId);
        setCryptoKey(key);
      } catch (err) {
        setError("Failed to initialize encryption.");
      }
    };

    initEncryption();
  }, [roomId, getOrCreateKey]);

  const decryptAll = useCallback(async (msgs: Message[], key: CryptoKey) => {
    const decrypted = await Promise.all(
      msgs.map(async (m) => {
        try {
          return {
            ...m,
            content: await decryptMessage(m.content, key),
          };
        } catch (e) {
          // If decryption fails, it might be an old plaintext message
          return { ...m, content: m.content };
        }
      })
    );
    setMessages(decrypted);
  }, []);

  // Load history
  useEffect(() => {
    if (!cryptoKey) return;
    
    messageService.getMessages(roomId).then((data) => {
      decryptAll(data, cryptoKey);
    });
  }, [roomId, cryptoKey, decryptAll]);

  // Listen for new messages
  useEffect(() => {
    if (!socket || !cryptoKey) return;

    const newMessageHandler = async (msg: Message) => {
      try {
        const content = await decryptMessage(msg.content, cryptoKey);
        setMessages((prev) => [...prev, { ...msg, content }]);
      } catch {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const updateMessageHandler = async (updated: Message) => {
      try {
        const content = await decryptMessage(updated.content, cryptoKey);
        setMessages((prev) => prev.map((msg) => (msg._id === updated._id ? { ...updated, content } : msg)));
      } catch {
        setMessages((prev) => prev.map((msg) => (msg._id === updated._id ? updated : msg)));
      }
    };

    socket.on("new_message", newMessageHandler);
    socket.on("update_message", updateMessageHandler);

    return () => {
      socket.off("new_message", newMessageHandler);
      socket.off("update_message", updateMessageHandler);
    };
  }, [socket, cryptoKey]);

  const handleSend = async (content: string, type: "text" | "code", language: string) => {
    if (!cryptoKey) return;
    try {
      const encryptedContent = await encryptMessage(content, cryptoKey);
      socket?.emit("send_message", { roomId, content: encryptedContent, type, language });
    } catch (err) {
      console.error("Encryption failed:", err);
    }
  };

  const handleEditMessage = async (messageId: string, content: string) => {
    if (!cryptoKey) return;
    try {
      const encryptedContent = await encryptMessage(content, cryptoKey);
      socket?.emit("edit_message", { messageId, content: encryptedContent });
    } catch (err) {
      console.error("Encryption failed during edit:", err);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    socket?.emit("delete_message", { messageId });
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <div className="text-rose-400 font-medium">{error}</div>
      </div>
    );
  }

  if (!cryptoKey) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="px-6 py-4 border-b border-white/10 bg-black/20 backdrop-blur-sm flex justify-between items-center">
        <h2 className="text-white font-bold text-xl tracking-wide flex items-center gap-3">
          <span className="text-indigo-400">#</span> {roomName}
          <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md border border-indigo-500/30 uppercase tracking-widest font-black">
            Secure Session
          </span>
        </h2>
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
