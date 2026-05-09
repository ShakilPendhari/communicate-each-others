import api from "./api";
import { endpoints } from "../constants/endpoints";

export const authService = {
    register: async (name: string, email: string, password: string) => {
        const response = await api.post(endpoints.auth.register, { name, email, password });
        return response.data;
    },
    login: async (email: string, password: string) => {
        const response = await api.post(endpoints.auth.login, { email, password });
        return response.data;
    },
};