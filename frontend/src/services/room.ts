import api from "./api";
import { endpoints } from "../constants/endpoints";

export const roomService = {
  getRooms: async () => {
    const response = await api.get(endpoints.rooms.list);
    return response.data;
  },

  createRoom: async (name: string) => {
    const response = await api.post(endpoints.rooms.create, { name });
    return response.data;
  },
};
