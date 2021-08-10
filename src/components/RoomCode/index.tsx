import copyImg from '../../assets/images/copy.svg'

import '../../styles/room-code.scss'

interface IProps {
    code: string
}

const RoomCode: React.FC<IProps> = (props) => {

    const copyRoomCode2Clipboard = () => {
        navigator.clipboard.writeText(props.code)
    }

    return (
        <button
            className="room-code"
            onClick={copyRoomCode2Clipboard}
        >
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>Sala {props.code}</span>
        </button>
    )
}

export { RoomCode }