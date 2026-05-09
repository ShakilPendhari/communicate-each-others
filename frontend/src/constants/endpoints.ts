export const endpoints = {
    auth : {
        register: "/auth/register",
        login: "/auth/login"
    },
    rooms: {
        list: "/rooms",
        create: "/rooms"
    },
    messages: {
        list: (roomId: string) => `/messages/${roomId}`,
        edit: (messageId: string) => `/messages/${messageId}`,
        delete: (messageId: string) => `/messages/${messageId}`,
    }
}