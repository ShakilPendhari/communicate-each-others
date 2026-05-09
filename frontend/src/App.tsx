import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import RoomList from "./components/room/roomList";
import ChatWindow from "./components/chat/ChatWindow";

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [selectedRoom, setSelectedRoom] = useState<{ _id: string; name: string } | null>(null);

  if (!isAuthenticated) {
    return authMode === "login"
      ? <Login onSwitch={() => setAuthMode("register")} />
      : <Register onSwitch={() => setAuthMode("login")} />;
  }

  return (
    <SocketProvider>
      <div className="flex h-screen">
        <RoomList
          onRoomSelect={setSelectedRoom}
          selectedRoomId={selectedRoom?._id || null}
        />
        <div className="flex flex-col flex-1">
          <div className="flex justify-end px-4 py-2 bg-gray-900 border-b border-gray-800">
            <button onClick={logout} className="text-xs text-gray-400 hover:text-white transition">
              Logout
            </button>
          </div>
          {selectedRoom
            ? <ChatWindow roomId={selectedRoom._id} roomName={selectedRoom.name} />
            : <div className="flex-1 flex items-center justify-center text-gray-600 bg-gray-950">Select a room to start chatting</div>
          }
        </div>
      </div>
    </SocketProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}