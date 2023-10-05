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
import ConfettiGenerator from 'confetti-js';

export default function Game() {
  const initialGameSetupState = {
    stage: GAME_STAGES.menu,
    player: INITIAL_BATTLEFIELD_SETUP,
    enemy: INITIAL_BATTLEFIELD_SETUP,
    mode: GAME_MODE.singlePlayer,
    whoseTurn: null,
    winner: null,
    shotsAmount: 0,
  };
  const [gameSetup, setGameSetup] = useState(initialGameSetupState);
  const isGameOver = gameSetup.stage === GAME_STAGES.gameover;

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
    if (
      !isGameOver &&
      !window.confirm('Are you sure? Game progress will be lost!')
    ) {
      return;
    }

    setGameSetup({
      ...initialGameSetupState,
      stage: GAME_STAGES.menu,
    });
  };

  const onShot = ({ shot }) => {
    const whoseTurn = gameSetup.whoseTurn;

    const oppenentSide =
      whoseTurn === BATTLEFIELD_SIDES.player
        ? BATTLEFIELD_SIDES.enemy
        : BATTLEFIELD_SIDES.player;

    let oppenentFleet = [...gameSetup[oppenentSide].fleet];
    // find mark cell as damaged
    oppenentFleet.forEach((ship) => {
      ship.position.forEach((cell) => {
        if (cell.raw === shot.raw) {
          cell.isDameged = true;
        }
      });
    });
    // mark ship sunk if all cells are damaged
    oppenentFleet.forEach((ship) => {
      const isSunk = ship.position.every((cell) => {
        return cell.isDameged;
      });
      const isShipDamaged = ship.position.some((cell) => {
        return cell.isDameged;
      });
      ship.isDameged = isShipDamaged;
      ship.isSunk = isSunk;
    });

    // const isGameOver = oppenentFleet.every((ship) => ship.isSunk === true);
    const isGameOver = true;

    // do record for the active player
    setGameSetup({
      ...gameSetup,
      shotsAmount: gameSetup.shotsAmount + 1,
      [whoseTurn]: {
        ...gameSetup[whoseTurn],
        combatLog: [...gameSetup[whoseTurn].combatLog, shot],
      },
      [oppenentSide]: {
        ...gameSetup[oppenentSide],
        fleet: oppenentFleet,
      },
      whoseTurn: oppenentSide,
      stage: isGameOver ? GAME_STAGES.gameover : GAME_STAGES.ongoing,
      winner: whoseTurn,
    });
  };

  // wait for both players to be ready to start the game
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
        player: {
          ...gameSetup.player,
          stage: GAME_STAGES.ongoing,
        },
        enemy: {
          ...gameSetup.enemy,
          stage: GAME_STAGES.ongoing,
        },
      });
    }
  }, [gameSetup, gameSetup.player.stage, gameSetup.enemy.stage]);

  useEffect(() => {
    if (!isGameOver) {
      return;
    }
    const confettiSettings = { target: 'congrats' };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();

    return () => confetti.clear();
  }, [isGameOver]);

  if (isGameOver) {
    return (
      <div className="relative w-full flex justify-around flex-1 flex-col">
        <h2 className="absolute inset-1/2 text-2xl font-bold dark:text-white text-center">
          {gameSetup.winner} wins!
        </h2>

        <canvas className="flex flex-1" id="congrats"></canvas>
        {/* TODO: statictics */}
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
  return (
    <div className="flex flex-1 flex-col items-center p-24 h-screen">
      <h1 className="mb-4 text-xl font-extrabold text-gray-900 dark:text-white text-center">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Battle Ships
        </span>{' '}
        multiplayer
      </h1>

      {[GAME_STAGES.planning].includes(gameSetup.stage) ? (
        <div className="w-full flex justify-around flex-1">
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
        <div className="w-full flex justify-around flex-1">
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
