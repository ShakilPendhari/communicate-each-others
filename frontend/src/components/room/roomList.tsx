import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { roomService } from "../../services/room";

interface Room {
  _id: string;
  name: string;
}

interface Props {
  onRoomSelect: (room: Room) => void;
  selectedRoomId: string | null;
}

export default function RoomList({ onRoomSelect, selectedRoomId }: Props) {
  const { socket } = useSocket();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState("");

  useEffect(() => {
    roomService.getRooms().then((data) => setRooms(data));
  }, []);

  const handleJoin = (room: Room) => {
    socket?.emit("join_room", room._id);
    onRoomSelect(room);
  };

  const handleCreate = async () => {
    if (!newRoom.trim()) return;
    const data = await roomService.createRoom(newRoom.trim());
    setRooms((prev) => [data, ...prev]);
    setNewRoom("");
    handleJoin(data);
  };

  return (
    <div className="w-72 min-h-screen bg-slate-950/95 backdrop-blur-xl flex flex-col p-6 border-r border-white/10 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-white font-bold text-xl mb-2 tracking-wide">🏠 Rooms</h2>
        <p className="text-white/50 text-sm">Choose a room to start chatting</p>
      </div>
      <div className="flex gap-3 mb-6">
        <input
          className="flex-1 bg-white/10 border border-white/20 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-indigo-400 placeholder-white/50 backdrop-blur-sm"
          placeholder="Create new room..."
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        <button
          onClick={handleCreate}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex-shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {rooms.map((room) => (
          <div
            key={room._id}
            onClick={() => handleJoin(room)}
            className={`px-4 py-3 rounded-xl cursor-pointer text-sm transition-all duration-300 font-medium ${
              selectedRoomId === room._id
                ? "bg-gradient-to-r from-indigo-500/80 to-purple-600/80 text-white shadow-lg border border-indigo-400/30"
                : "text-white/70 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20"
            }`}
          >
            # {room.name}
          </div>
        ))}
      </div>
    </div>
  );
}