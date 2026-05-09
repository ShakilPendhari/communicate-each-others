import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { EncryptionProvider } from "./context/EncryptionContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import RoomList from "./components/room/roomList";
import ChatWindow from "./components/chat/ChatWindow";

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [selectedRoom, setSelectedRoom] = useState<{ _id: string; name: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return authMode === "login"
      ? <Login onSwitch={() => setAuthMode("register")} />
      : <Register onSwitch={() => setAuthMode("login")} />;
  }

  return (
    <SocketProvider>
      <EncryptionProvider>
        <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {/* Sidebar - Hidden on mobile/tablet by default */}
          <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <RoomList
              onRoomSelect={(room) => {
                setSelectedRoom(room);
                setSidebarOpen(false); // Close sidebar on mobile after selection
              }}
              selectedRoomId={selectedRoom?._id || null}
            />
          </div>

          {/* Overlay for mobile/tablet */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="flex flex-col flex-1 lg:ml-0">
            <div className="flex justify-between items-center px-6 py-3 bg-black/20 backdrop-blur-sm border-b border-white/10">
              {/* App logo and title - visible on desktop */}
              <div className="hidden lg:flex items-center space-x-3">
                <img src="/src/assets/chat-icon.svg" alt="Chat App" className="w-8 h-8" />
                <h1 className="text-white font-bold text-lg">Communicate</h1>
              </div>

              {/* Hamburger menu button - visible on mobile/tablet */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white/70 hover:text-white transition-all duration-300 p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Spacer for mobile/tablet */}
              <div className="lg:hidden"></div>

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
                    <div className="mb-6">
                      <img src="/src/assets/chat-icon.svg" alt="Chat App" className="w-20 h-20 mx-auto opacity-60" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-white/80">Welcome to Communicate</h2>
                    <p className="text-white/50">Select a room from the sidebar to start chatting</p>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </EncryptionProvider>
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