export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Room {
  _id: string;
  name: string;
  createdBy: User;
  createdAt: string;
}

export interface Message {
  _id: string;
  roomId: string;
  senderId: User;
  content: string;
  type: "text" | "code";
  language: string | null;
  createdAt: string;
}