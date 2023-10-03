'use client';

import { GAME_MODE, GAME_STAGES, GAME_STAGE_MAP } from '@/libs/config';

export default function GameSettings({
  actions: { onChange, onReset, onGameModeChange, onGameStart },
  gameSetup,
}) {
  const isMenuState = gameSetup.stage === GAME_STAGES.menu;

  const PlayerAvatar = ({ player }) => {
    return (
      <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
        <svg
          class="absolute w-12 h-12 text-gray-400 -left-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
    );
  };

  const StatusBadge = ({ stage }) => {
    const stageLabel = GAME_STAGE_MAP[stage] || GAME_STAGE_MAP[1];
    if (stage === GAME_STAGES.ready) {
      return (
        <span class="ml-2 bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
          {stageLabel}
        </span>
      );
    }

    return (
      <span class="ml-2 bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
        {stageLabel}
      </span>
    );
  };

  if (isMenuState) {
    return (
      <div className="flex justify-between p-2 mt-5 flex-col">
        <h4 class="text-2xl font-bold dark:text-white text-center mb-2">
          {GAME_STAGE_MAP[gameSetup.stage]}
        </h4>
        <div className="flex">
          <button
            onClick={() => onGameModeChange(GAME_MODE.singlePlayer)}
            className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded mr-5"
          >
            1 Player
          </button>

          <button
            onClick={() => onGameModeChange(GAME_MODE.multiplayer)}
            className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
          >
            2 Player
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-2 flex-col">
      <h4 class="text-2xl font-bold dark:text-white text-center">
        {GAME_STAGE_MAP[gameSetup.stage]}
      </h4>
      <div className="flex">
        <div className="flex items-center">
          <PlayerAvatar player={gameSetup.player1} />
          <StatusBadge stage={gameSetup.player1.stage} />
        </div>

        <div className="flex items-center">
          <PlayerAvatar player={gameSetup.player2} />
          <StatusBadge stage={gameSetup.player2.stage} />
        </div>
      </div>
      <div className="actions flex self-center mt-2">
        <button
          onClick={onReset}
          className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
