import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../util/SocketContext";
function Login() {
    const [userName, setUsername] = useState("");
    const [roomID, setroomID] = useState("");
    const socket = useSocket();
    const navigate = useNavigate();
    const submit_handle = useCallback((e) => {
        e.preventDefault();
        socket.emit("Join", { userName, roomID })
    }, [userName, roomID, socket]);

    const handleJoin = useCallback((data) => {
        const { userName, roomID } = data;
        navigate('/room/' + roomID);
    }, [])

    useEffect(() => {
        socket.on("Join", handleJoin)
        return () => {
            socket.off("Join", handleJoin)
        }
    }, [socket]);
    return <div>
        <label>userName</label>
        <input type="text" value={userName} onChange={(event) => { setUsername(event.target.value) }} />
        <br />
        <label>roomID</label>
        <input type="text" value={roomID} onChange={(event) => { setroomID(event.target.value) }} />
        <button onClick={submit_handle}>submit</button>
    </div>
}
export default Login;