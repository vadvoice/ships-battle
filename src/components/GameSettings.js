'use client';

import { GAME_MODE, GAME_STAGES } from '@/libs/config';

export default function GameSettings({
  actions: { onChange, onReset, onGameModeChange, onGameStart },
  gameSetup,
}) {
  const { horizontalPlacement } = gameSetup;

  const onPositionChange = () => {
    onChange({
      ...gameSetup,
      horizontalPlacement: !horizontalPlacement,
    });
  };
  const isPlanningStage = gameSetup.stage === GAME_STAGES.planning;
  const isMenuState = gameSetup.stage === GAME_STAGES.menu;

  if (isMenuState) {
    return (
      <div className="flex justify-between p-2 mt-5">
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
    );
  }

  if (isPlanningStage) {
    return (
      <div className="flex justify-center p-2 flex-col mt-5">
        <h4 className="text-2xl font-bold dark:text-white">Settings:</h4>

        {/* // ship position  */}
        <div className="my-2 flex">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              onClick={onPositionChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              POSITION: {horizontalPlacement ? 'Horizontal' : 'Vertical'}
            </span>
          </label>
          <div className="ml-2">
            {horizontalPlacement ? (
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 8 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 8"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"
                />
              </svg>
            )}
          </div>
        </div>

        <label>
          <button
            onClick={onReset}
            className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
          >
            Reset
          </button>
        </label>
      </div>
    );
  }

  return (
    <div className="flex justify-between p-2 mt-5">
      <label>
        <button
          onClick={onGameStart}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        >
          I&apos;m ready!
        </button>
      </label>

      <button
        onClick={onReset}
        className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
      >
        Reset
      </button>
    </div>
  );
}
