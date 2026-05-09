import {createContext, useContext, useState, useEffect, useRef, type ReactNode} from 'react';
import { io, Socket } from "socket.io-client";
import { useAuth } from './AuthContext';

interface SocketContextType {
    socket: WebSocket | null;
    connect: (token: string) => void;
    disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({children}:{children: ReactNode}) =>{
    const { token } = useAuth();
    const socketRef = useRef<Socket | null>(null);
     const [isConnected, setIsConnected] = useState<boolean | null>(false)  

      useEffect(()=>{
        if(!token) return;
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
  auth: { token },
});
         socket.on("connect", ()=>setIsConnected(true))
          socket.on("disconnect", ()=>setIsConnected(false))
         socketRef.current = socket;
     return ()=>{
      socket.disconnect();
           }
      
      }, [token])
 return <SocketContext.Provider value={{ socket:socketRef.current, isConnected}}>
    {children}
 </SocketContext.Provider>
    
}

export const useSocket = ()=>{
  const ctx = useContext(SocketContext);
  if(!ctx){
    throw new Error("useSocket must be used within SocketProvider")
  }
  return ctx;
}