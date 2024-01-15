import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../util/SocketContext";
import "./Login-styles.css";
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
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
            (stream) => {
                document.getElementById('videoElement').srcObject = stream;
            }
        )
    }, []);
    return <div className="login-cointainer">
        <video className="video" muted autoplay="true" id="videoElement" ></video>
        <div className="val">
            <h1>Login to the FaceTime Clone</h1>
            <div className="input-text">
                <label className="lable">Name:</label>
                <input className="lable input-text-field" placeholder="Enter your NickName" value={userName} onChange={(event) => { setUsername(event.target.value) }} type='text' />
            </div>
            <div className="input-text">
                <label className="lable">RoomID:</label>
                <input className="lable input-text-field" placeholder="Enter Room ID" value={roomID} onChange={(event) => { setroomID(event.target.value) }} type='text' />
            </div>
            <center>
                <button className="button button-submit " onClick={submit_handle}>SUBMIT</button>
            </center>
        </div>
    </div>
}
export default Login;