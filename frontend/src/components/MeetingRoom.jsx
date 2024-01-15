import ReactPlayer from 'react-player';
import "./MeetingRoom-style.css";
function MeetingRoom(props) {
    return <div className='fluid' >{props.localStream && (
        <div>
            <h1>{props.you}</h1>
            <ReactPlayer
                playing
                muted
                url={props.localStream}
            />
        </div>
    )}
        {props.remoteStream && (
            <div>
                <h1>{props.remoteUserID}</h1>
                <ReactPlayer
                    playing
                    url={props.remoteStream}
                />
            </div>
        )}</div>
}
export default MeetingRoom;