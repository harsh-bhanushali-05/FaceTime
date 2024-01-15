import { useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import "./MeetingRoom-style.css";
function MeetingRoom(props) {
    const socket = props.socket;
    const [thisUserName, setThisUserName] = useState();
    const [remoteUserName, setRemoteUserName] = useState();
    useEffect(() => {
        if (document.getElementById('UserVideo') != null)
            document.getElementById('UserVideo').srcObject = props.localStream;
        if (document.getElementById('RemoteUserVideo') != null)
            document.getElementById('RemoteUserVideo').srcObject = props.remoteStream;
    }, [props.localStream, props.remoteStream, document.getElementById('UserVideo'), document.getElementById('RemoteUserVideo')]);
    useEffect(() => {
        const otherID = props.otherID;
        const user = props.user;
        console.log(otherID + " " + user + " this is the data recived as the props ")
        socket.emit('get_name', { to: user, from: otherID });
    }, []);
    const getThisuser = useCallback(({ userName, otheruser }) => {
        console.log(userName);
        setThisUserName(otheruser);
        setRemoteUserName(userName);
    }, []);
    useEffect(() => {
        socket.on('get_name', getThisuser);
        return () => {
            socket.off('get_name', getThisuser);
        }
    }, [])
    return <div className='fluid' >{props.localStream && (
        <div>

            <video className="video Video-player-MeetingRoom" muted autoplay="true" id="UserVideo" ></video>
            <center><h1 className='title'>{thisUserName} (You)</h1></center>
        </div>
    )}
        {props.remoteStream && (
            <div>
                <video className="video Video-player-MeetingRoom" autoplay="true" id="RemoteUserVideo" ></video>
                <center><h1 className='title'>{remoteUserName}</h1></center>
            </div>
        )}</div>
}
export default MeetingRoom;