import { useCallback, useEffect, useState } from "react";
import peer from "../RTC-services/peer";
import { useSocket } from "../util/SocketContext";
import ReactPlayer from 'react-player';
import MeetingRoom from "./MeetingRoom";
import WaitingRoom from "./WaitingRoom";
function Room() {
    const socket = useSocket();
    const [otherId, setOtherId] = useState(null);
    const [localStream, setlocalStream] = useState();
    const [remoteStream, setRemoteStream] = useState();

    const handleUserJoined = useCallback(({ username, id }) => {
        setOtherId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        const offer = await peer.getOffer();
        socket.emit('Call-other-user', { to: otherId, offer });
        setlocalStream(stream);
    }, [otherId, socket]);

    const handleIncommingCall = useCallback(
        async ({ from, offer }) => {
            setOtherId(from);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setlocalStream(stream);
            console.log(`Incoming Call`, from, offer);
            const ans = await peer.getAnser(offer);
            socket.emit('call-accepted', { to: from, ans });
        },
        [socket]
    );

    const sendStreams = useCallback(() => {
        for (const track of localStream.getTracks()) {
            peer.peer.addTrack(track, localStream);
        }
    }, [localStream]);

    const handleCallAccepted = useCallback(
        ({ from, ans }) => {
            peer.setLocalDescription(ans);
            console.log("Call Accepted!");
            sendStreams();
        },
        [sendStreams]
    );

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit('peer-nego', { offer, to: otherId });
    }, [otherId, socket]);

    useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
    }, [handleNegoNeeded]);

    const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }) => {
            const ans = await peer.getAnser(offer);
            socket.emit('peer:nego:done', { to: from, ans });
        },
        [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await peer.setLocalDescription(ans);
    }, []);

    useEffect(() => {
        peer.peer.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams;
            console.log("GOT TRACKS!!");
            setRemoteStream(remoteStream[0]);
        });
    }, []);

    useEffect(() => {
        socket.on("Join", handleUserJoined);
        socket.on('incomming-call', handleIncommingCall);
        socket.on('call-accepted', handleCallAccepted);
        socket.on("peer-nego", handleNegoNeedIncomming);
        socket.on('peer:nego:final', handleNegoNeedFinal);

        return () => {
            socket.off("Join", handleUserJoined);
            socket.off('incomming-call', handleIncommingCall);
            socket.off('call-accepted', handleCallAccepted);
            socket.off("peer-nego", handleNegoNeedIncomming);
            socket.off('peer:nego:final', handleNegoNeedFinal);
        };
    }, [
        socket,
        handleUserJoined,
        handleIncommingCall,
        handleCallAccepted,
        handleNegoNeedIncomming,
        handleNegoNeedFinal,
    ]);
    useEffect(() => {
        if (otherId)
            handleCallUser();
    }, [otherId]);
    return (
        <div>
            <h4>{otherId ? <MeetingRoom localStream={localStream} remoteStream={remoteStream} /> : <WaitingRoom localStream={localStream} />}</h4>
        </div>
    );
};

export default Room;