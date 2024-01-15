import { useEffect } from "react";
import "./Login-styles.css";
function WaitingRoom(props) {
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
            (stream) => {
                if (document.getElementById('videoElement') != null)
                    document.getElementById('videoElement').srcObject = stream;
            });
    }, []);

    return <div className="login-cointainer">
        <video className="video" muted autoplay="true" id="videoElement" ></video>
        <div className="val">
            <h1>Login to the FaceTime Clone</h1>
            <h2>Waiting for the second person to join!!!</h2>
            <center>
                <i className="fa-solid fa-spinner fa-spin" style={{ color: "#F8E559", margin: "30px", fontSize: "3rem" }}></i>
            </center>
        </div>
    </div>
}
export default WaitingRoom;