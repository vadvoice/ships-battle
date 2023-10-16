import { BATTLEFIELD_SIDES, GAME_MODE, GAME_STAGES } from '@/libs/config';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

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
    return;
  }

  if (roomName) {
    return (
      <div>
        <h1>Connection stage</h1>

        <button
          className="flex items-center mr-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          onClick={() => {
            navigator.clipboard.writeText(
              window.location.origin +
                `/?roomName=${roomName}&stage=${GAME_STAGES.connection}&mode=${GAME_MODE.multiPlayer}&role=${BATTLEFIELD_SIDES.enemy}`
            );
          }}
        >
          Invate Player
        </button>
      </div>
    );
  }

  if (gameState.stage === GAME_STAGES.connection && socket && !roomNameParam) {
    return (
      <div>
        <h1>Create Roome</h1>
        <form onSubmit={onCreateRoom}>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
    <div>
      <button
        className="flex items-center mr-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        onClick={() => onJoinRoom(roomNameParam)}
      >
        Join room: {roomNameParam}
      </button>
    </div>
  );
}
