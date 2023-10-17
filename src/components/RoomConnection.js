import { BATTLEFIELD_SIDES, GAME_MODE, GAME_STAGES } from '@/libs/config';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Spinner from './Spinner';

export default function RoomConnection({
  gameState,
  socket,
  actions: { createRoom, onJoinRoom },
}) {
  const params = useSearchParams();
  const { roomName } = gameState;
  const roomNameParam = params.get('roomName');
  const [connectionState, setConnectionState] = useState({
    roomName: null,
    socket,
  });

  const onCreateRoom = (e) => {
    e.preventDefault();
    createRoom(connectionState.roomName);
  };

  const onRoomNameChange = (e) => {
    setConnectionState({ roomName: e.target.value });
  };

  if (!socket) {
    return <Spinner />;
  }

  if (roomName) {
    return (
      <div className="flex items-center flex-col">
        <button
          className="flex items-center mr-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          onClick={() => {
            navigator.clipboard.writeText(
              window.location.origin +
                `/?roomName=${roomName}&stage=${GAME_STAGES.connection}&mode=${GAME_MODE.multiPlayer}&role=${BATTLEFIELD_SIDES.enemy}`
            );
          }}
        >
          Copy Link <Spinner />
        </button>

        <p className="text-indigo-200">Send this invitation to the friend</p>
      </div>
    );
  }

  if (gameState.stage === GAME_STAGES.connection && socket && !roomNameParam) {
    return (
      <div>
        <form onSubmit={onCreateRoom} className="flex flex-col items-center">
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
          <button
            type="submit"
            className="flex items-center mr-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          >
            Create Room
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h4 className="text-2xl font-bold dark:text-white my-3">
        Someone creates fight called:
        <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 ml-3">
          {roomNameParam}
        </span>
      </h4>
      <button
        data-tooltip-target="tooltip-default"
        type="button"
        className="flex items-center mr-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        onClick={() => onJoinRoom(roomNameParam)}
      >
        Join the fight
      </button>
    </div>
  );
}
