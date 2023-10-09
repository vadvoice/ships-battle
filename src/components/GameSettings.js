'use client';

import {
  BATTLEFIELD_SIDES,
  GAME_MODE,
  GAME_STAGES,
  GAME_STAGE_MAP,
} from '@/libs/config';

export default function GameSettings({
  actions: { onReset, onGameModeChange },
  gameSetup,
}) {
  const isMenuState = gameSetup.stage === GAME_STAGES.menu;
  const isGameOngoing = gameSetup.stage === GAME_STAGES.ongoing;
  const isGameOver = gameSetup.stage === GAME_STAGES.gameover;
  const whoseTurn = gameSetup.whoseTurn;

  // TODO: player personalization
  const PlayerAvatar = ({ player }) => {
    return (
      <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
        <svg
          className="absolute w-12 h-12 text-gray-400 -left-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
    );
  };

  const StatusBadge = ({ stage }) => {
    const stageLabel = GAME_STAGE_MAP[stage] || GAME_STAGE_MAP[1];

    if (stage === GAME_STAGES.planningComplete) {
      return (
        <span className="ml-2 bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
          {stageLabel}
        </span>
      );
    }

    if (stage === GAME_STAGES.ready) {
      return (
        <span className="ml-2 bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
          {stageLabel}
        </span>
      );
    }

    return (
      <span className="ml-2 bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
        {stageLabel}
      </span>
    );
  };

  if (isMenuState) {
    return (
      <div className="flex justify-between p-2 mt-5 flex-col">
        <h4 className="text-2xl font-bold dark:text-white text-center mb-2">
          {GAME_STAGE_MAP[gameSetup.stage]}
        </h4>
        <div className="flex">
          <button
            onClick={() => onGameModeChange(GAME_MODE.singlePlayer)}
            className="flex items-center mr-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          >
            1 Player
          </button>

          <button
            onClick={() => onGameModeChange(GAME_MODE.multiPlayer)}
            className="flex items-center mr-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            title="Coming soon"
          >
            2 Player
          </button>
        </div>
      </div>
    );
  }

  if (isGameOngoing) {
    return (
      <div className="flex justify-center p-2 flex-col">
        <h4 className="text-2xl font-bold dark:text-white text-center">
          {GAME_STAGE_MAP[gameSetup.stage]}
        </h4>
        <div className="flex items-center text-blue-700 border-y-2 border-indigo-500 justify-center">
          <p className="text-sm text-center mr-2">Shots made:</p>
          <span className="text-md font-bold">{gameSetup.shotsAmount}</span>
        </div>
        <div className="flex mt-3">
          <div className={`relative flex items-center mx-3`}>
            <PlayerAvatar player={gameSetup.player} />
            <h5 className="font-bold dark:text-white text-center">Player 1</h5>
            <span className="absolute left-0 flex h-3 w-3 ml-2 self-baseline">
              <span
                className={`${
                  whoseTurn === BATTLEFIELD_SIDES.player ? 'animate-ping' : null
                } absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75`}
              ></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
          </div>
          <div className={`relative flex items-center mx-3`}>
            <PlayerAvatar player={gameSetup.enemy} />
            <h5 className="font-bold dark:text-white text-center">Player 2</h5>

            <span className="absolute left-0 flex h-3 w-3 ml-2 self-baseline">
              <span
                className={`${
                  whoseTurn === BATTLEFIELD_SIDES.enemy ? 'animate-ping' : null
                } absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75`}
              ></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
          </div>
        </div>
        <div className="actions flex self-center mt-2">
          <button
            onClick={onReset}
            className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
          >
            Quit
          </button>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="flex justify-center flex-col items-center relative">
        <div className="actions flex self-center mt-2">
          <button
            onClick={onReset}
            className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
          >
            Quit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-2 flex-col">
      <h4 className="text-2xl font-bold dark:text-white text-center">
        {GAME_STAGE_MAP[gameSetup.stage]}
      </h4>
      <div className="flex">
        <div className="flex items-center">
          <PlayerAvatar player={gameSetup.player} />
          <StatusBadge stage={gameSetup.player.stage} />
        </div>

        <div className="flex items-center">
          <PlayerAvatar player={gameSetup.enemy} />
          <StatusBadge stage={gameSetup.enemy.stage} />
        </div>
      </div>
      <div className="actions flex self-center mt-2">
        <button
          onClick={onReset}
          className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
        >
          Quit
        </button>
      </div>
    </div>
  );
}
