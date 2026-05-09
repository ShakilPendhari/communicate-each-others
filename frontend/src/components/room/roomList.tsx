import { useEffect, useState } from "react";
import api from "../../services/api";
import { useSocket } from "../../context/SocketContext";

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
    api.get("/rooms").then(({ data }) => setRooms(data));
  }, []);

  const handleJoin = (room: Room) => {
    socket?.emit("join_room", room._id);
    onRoomSelect(room);
  };

  const handleCreate = async () => {
    if (!newRoom.trim()) return;
    const { data } = await api.post("/rooms", { name: newRoom.trim() });
    setRooms((prev) => [data, ...prev]);
    setNewRoom("");
    handleJoin(data);
  };

  return (
    <div className="w-64 bg-gray-900 h-screen flex flex-col p-4 border-r border-gray-800">
      <h2 className="text-white font-bold text-lg mb-4">Rooms</h2>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="New room..."
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        <button
          onClick={handleCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
        >
          +
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1">
        {rooms.map((room) => (
          <div
            key={room._id}
            onClick={() => handleJoin(room)}
            className={`px-3 py-2 rounded-lg cursor-pointer text-sm transition ${
              selectedRoomId === room._id
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            # {room.name}
          </div>
        ))}
      </div>
    </div>
  );
}