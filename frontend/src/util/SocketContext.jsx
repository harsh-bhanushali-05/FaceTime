import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client"
const SocketContext = createContext(null);

export function useSocket() {
    const socket = useContext(SocketContext);
    return socket;
}

export const SocketPro = (props) => {
    const socket = useMemo(() => io('localhost:4000'), []);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}