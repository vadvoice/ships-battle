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
  const isGameStarted = gameSetup.stage === GAME_STAGES.ongoing;

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
        Planer 1 vs Plyaer 2
      </div>
    );
  }

  if (isGameStarted) {
    return (
      <div className="flex justify-center p-2 flex-col mt-5">
        done
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
