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
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <RoomList
          onRoomSelect={setSelectedRoom}
          selectedRoomId={selectedRoom?._id || null}
        />
        <div className="flex flex-col flex-1">
          <div className="flex justify-end px-6 py-3 bg-black/20 backdrop-blur-sm border-b border-white/10">
            <button
              onClick={logout}
              className="text-sm text-white/70 hover:text-white transition-all duration-300 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-medium"
            >
              🚪 Logout
            </button>
          </div>
          {selectedRoom
            ? <ChatWindow roomId={selectedRoom._id} roomName={selectedRoom.name} />
            : (
              <div className="flex-1 flex flex-col items-center justify-center text-white/60">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h2 className="text-2xl font-bold mb-2 text-white/80">Welcome to Chat</h2>
                  <p className="text-white/50">Select a room from the sidebar to start chatting</p>
                </div>
              </div>
            )
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