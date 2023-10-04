'use client';

import Battlefield from '@/components/Battlefield';
import BattlefieldPlanning from '@/components/BattlefieldPlanning';
import GameSettings from '@/components/GameSettings';
import {
  GAME_STAGES,
  GAME_MODE,
  INITIAL_BATTLEFIELD_SETUP,
  BATTLEFIELD_SIDES,
} from '@/libs/config';
import { getRandomBetween } from '@/libs/helpers';
import { useEffect, useState } from 'react';

export default function Game() {
  const initialGameSetupState = {
    stage: GAME_STAGES.menu,
    player: INITIAL_BATTLEFIELD_SETUP,
    enemy: INITIAL_BATTLEFIELD_SETUP,
    mode: GAME_MODE.singlePlayer,
    whoseTurn: null,
    shotsAmount: 0,
  };
  const [gameSetup, setGameSetup] = useState(initialGameSetupState);

  const onGameModeChange = (mode) => {
    setGameSetup({
      ...gameSetup,
      mode,
      stage: GAME_STAGES.planning,
    });
  };

  const onGameStart = () => {
    setGameSetup({
      ...gameSetup,
      stage: GAME_STAGES.ongoing,
    });
  };

  const onReset = () => {
    if (window.confirm('Are you sure? Game progress will be lost!')) {
      setGameSetup({
        ...initialGameSetupState,
        stage: GAME_STAGES.menu,
      });
    }
  };

  const onShot = ({ shot }) => {
    const whoseTurn = gameSetup.whoseTurn;

    // do record for the active player
    setGameSetup({
      ...gameSetup,
      shotsAmount: gameSetup.shotsAmount + 1,
      [whoseTurn]: {
        ...gameSetup[whoseTurn],
        combatLog: [...gameSetup[whoseTurn].combatLog, shot],
      },
      whoseTurn:
        whoseTurn === BATTLEFIELD_SIDES.player
          ? BATTLEFIELD_SIDES.enemy
          : BATTLEFIELD_SIDES.player,
    });

    // TODO: check for gameover
  };

  useEffect(() => {
    if (
      gameSetup.stage !== GAME_STAGES.ongoing &&
      gameSetup.player.stage === GAME_STAGES.ready &&
      gameSetup.enemy.stage === GAME_STAGES.ready
    ) {
      // get random side between player and enemy
      // could be added as separate stage
      const side = Object.keys(BATTLEFIELD_SIDES)[getRandomBetween(0, 1)];
      setGameSetup({
        ...gameSetup,
        stage: GAME_STAGES.ongoing,
        whoseTurn: side,
      });
    }
  }, [gameSetup, gameSetup.player.stage, gameSetup.enemy.stage]);

  return (
    <div className="flex flex-1 flex-col items-center p-24 h-screen">
      <h1 className="mb-4 text-xl font-extrabold text-gray-900 dark:text-white text-center">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Battle Ships
        </span>{' '}
        multiplayer
      </h1>

      {[GAME_STAGES.planning].includes(gameSetup.stage) ? (
        <div className="w-full flex justify-around">
          <BattlefieldPlanning
            isMain
            actions={{ onChange: setGameSetup }}
            gameState={gameSetup}
          />

          <BattlefieldPlanning
            isPc
            actions={{ onChange: setGameSetup }}
            gameState={gameSetup}
          />
        </div>
      ) : null}

      {[GAME_STAGES.ongoing].includes(gameSetup.stage) ? (
        <div className="w-full flex justify-around">
          <Battlefield
            isMain
            enemyFleet={gameSetup.enemy.fleet}
            gameState={gameSetup}
            actions={{ onChange: setGameSetup, onShot }}
          />

          <Battlefield
            isPc
            enemyFleet={gameSetup.player.fleet}
            gameState={gameSetup}
            actions={{ onChange: setGameSetup, onShot }}
          />
        </div>
      ) : null}

      <GameSettings
        gameSetup={gameSetup}
        actions={{
          onReset,
          onGameModeChange: onGameModeChange,
          onChange: setGameSetup,
          onGameStart: onGameStart,
        }}
      />
    </div>
  );
}
