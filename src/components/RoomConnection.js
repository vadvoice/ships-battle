import { BATTLEFIELD_SIDES, GAME_MODE, GAME_STAGES } from '@/libs/config';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Spinner from './Spinner';
import { toast } from 'sonner';
import { Button,  } from 'flowbite-react';

export default function RoomConnection({
  gameState,
  socket,
  actions: { onCreateRoom, onJoinRoom, onReset },
}) {
  const [isInvitationCopied, setIsInvitationCopied] = useState(false);
  const params = useSearchParams();
  const { roomName } = gameState;
  const roomNameParam = params.get('roomName');
  const [connectionState, setConnectionState] = useState({
    roomName: null,
    socket,
  });
  const isRoomCreatetionStage =
    gameState.stage === GAME_STAGES.connection &&
    socket &&
    !roomNameParam &&
    !roomName;
  const isInvitationStage = roomName;
  const isRoomJoiningStage = socket && roomNameParam;

  const onSubmitRoom = (e) => {
    e.preventDefault();
    onCreateRoom(connectionState.roomName);
  };

  const onRoomNameChange = (e) => {
    setConnectionState({ roomName: e.target.value });
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {!socket && <Spinner />}

      {isInvitationStage && (
        <div className="flex items-center flex-col">
          <Button
            color="blue"
            onClick={() => {
              navigator.clipboard.writeText(
                window.location.origin +
                  `/?roomName=${roomName}&stage=${GAME_STAGES.connection}&mode=${GAME_MODE.multiPlayer}&role=${BATTLEFIELD_SIDES.enemy}`
              );
              setIsInvitationCopied(true);
              toast.success('Copied to clipboard');
            }}
            isProcessing={isInvitationCopied}
          >
            Copy Link
          </Button>
          <p className="text-indigo-200">Send this invitation to the friend</p>
        </div>
      )}

      {isRoomCreatetionStage ? (
        <form onSubmit={onSubmitRoom} className="flex flex-col items-center">
          <h3 className="my-2">What name would you give this fight?</h3>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white ">
            <input
              type="text"
              id="room-name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="124, our-battle"
              onChange={onRoomNameChange}
              required
            ></input>
          </label>
          <Button type="submit" color="blue">
            {' '}
            Create Room
          </Button>
        </form>
      ) : null}

      {isRoomJoiningStage ? (
        <>
          <h4 className="text-2xl font-bold text-white my-3 text-center">
            Someone creates fight called:
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 ml-3">
              {roomNameParam}
            </span>
          </h4>
          <Button
            type="button"
            onClick={() => onJoinRoom(roomNameParam)}
            isProcessing={true}
            processingLabel="Press button to join the fight"
          >
            Join the fight
          </Button>
        </>
      ) : null}

      <Button className="mt-10" color="failure" onClick={onReset}>
        Go back
      </Button>
    </div>
  );
}
