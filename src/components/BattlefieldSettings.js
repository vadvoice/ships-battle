'use client';

import { GAME_STAGES } from '@/libs/config';

export default function BattlefieldSettings({
  actions: { onReset, onPositionChange, onReady, autoGenerate },
  gameState,
}) {
  const { horizontalPlacement } = gameState;

  const isPlanningStage = gameState.stage === GAME_STAGES.planning;

  if (isPlanningStage) {
    return (
      <div className="flex justify-center p-2 flex-col mt-5">
        <h4 className="text-xl font-bold dark:text-white">Settings:</h4>

        <div className="flex justify-between">
          <button
            onClick={autoGenerate}
            className="flex items-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          >
            Generic
            <svg
              className="h-8 w-8"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -5v5h5" />
              <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5" />
            </svg>
          </button>
          <button
            onClick={onReset}
            className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
          >
            Reset
          </button>
        </div>
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
      </div>
    );
  }

  return (
    <div className="flex justify-between p-2 mt-5 flex-col">
      <h4 className="text-xl font-bold dark:text-white">Settings:</h4>

      <div className="flex justify-between">
        <button
          onClick={autoGenerate}
          className="flex items-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        >
          Generic
          <svg
            className="h-8 w-8"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -5v5h5" />
            <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5" />
          </svg>
        </button>
        <button
          onClick={onReady}
          className="flex items-center bg-green-400 hover:bg-green-300 text-white font-bold py-2 px-4 border-b-4 border-green-500 hover:border-green-600 rounded"
        >
          I&apos;m ready!
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {' '}
            <polygon points="5 4 15 12 5 20 5 4" />{' '}
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>

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
