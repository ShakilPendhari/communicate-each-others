import api from "./api";
import { endpoints } from "../constants/endpoints";

export const messageService = {
  getMessages: async (roomId: string) => {
    const response = await api.get(endpoints.messages.list(roomId));
    return response.data;
  },
};
