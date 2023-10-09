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
import { useCallback, useEffect, useState } from 'react';
import ConfettiGenerator from 'confetti-js';
import { Stats } from '@/components/Stats';
import SocketIO from 'socket.io-client';

export default function Game() {
  const initialGameSetupState = {
    stage: GAME_STAGES.menu,
    player: {
      name: 'player',
      ...INITIAL_BATTLEFIELD_SETUP,
    },
    enemy: {
      name: 'enemy',
      ...INITIAL_BATTLEFIELD_SETUP,
    },
    mode: GAME_MODE.singlePlayer,
    whoseTurn: null,
    winner: null,
    shotsAmount: 0,
  };
  const [gameSetup, setGameSetup] = useState(initialGameSetupState);
  const [socket, setSocket] = useState(null);
  const isGameOverStage = gameSetup.stage === GAME_STAGES.gameover;

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
      !isGameOverStage &&
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
    shot.status = 'missed';

    const oppenentSide =
      whoseTurn === BATTLEFIELD_SIDES.player
        ? BATTLEFIELD_SIDES.enemy
        : BATTLEFIELD_SIDES.player;

    let oppenentFleet = [...gameSetup[oppenentSide].fleet];
    // find mark cell as damaged
    oppenentFleet.forEach((ship) => {
      ship.position.forEach((cell) => {
        if (cell.raw === shot.raw) {
          cell.isDamaged = true;
          shot.status = 'hit';
          shot.isDamaged = true;
          shot.shipColor = cell.shipColor;
        }
      });
    });
    // mark ship sunk if all cells are damaged
    oppenentFleet.forEach((ship) => {
      const isSunk = ship.position.every((cell) => {
        return cell.isDamaged;
      });
      const isShipDamaged = ship.position.some((cell) => {
        return cell.isDamaged;
      });
      ship.isDamaged = isShipDamaged;
      ship.isSunk = isSunk;
    });

    const isGameOver = oppenentFleet.every((ship) => ship.isSunk === true);

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
    if (!isGameOverStage) {
      return;
    }
    const confettiSettings = { target: 'congrats' };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();

    return () => confetti.clear();
  }, [isGameOverStage]);

  const socketInitializer = useCallback(async () => {
    // We call this just to make sure we turn on the websocket server
    await fetch('/api/socket');

    const socket = SocketIO(undefined, {
      path: '/api/multiplayer_connection',
    });

    socket.on('connect', (con) => {
      console.log('Connected', socket.id);
    });

    socket.on('newIncomingMessage', (msg) => {
      console.log('New message in client', msg);
    });
    setSocket(socket);

  }, []);

  // initialize socket once multiplaer mode selected
  useEffect(() => {
    if (!socket && gameSetup.mode === GAME_MODE.multiPlayer) {
      socketInitializer();
    }

    return () => {
      socket && socket.disconnect();
    }
  }, [gameSetup.mode, socket, socketInitializer]);

  if (isGameOverStage) {
    return (
      <div className="relative w-full flex justify-around flex-1 flex-col h-screen">
        {/* background confetti */}
        <canvas
          className="inset-x-0 h-screen w-screen absolute"
          id="congrats"
        ></canvas>

        <h2 className="text-2xl font-bold dark:text-white text-center uppercase">
          {gameSetup.winner} wins!
        </h2>

        <Stats gameState={gameSetup} />

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
    <div className="flex flex-1 flex-col items-center p-2 pt-16 min-h-screen min-w-min md:px-10">
      <h1 className="mb-4 text-xl font-extrabold text-gray-900 dark:text-white text-center">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Battle Ships
        </span>{' '}
        multiplayer
      </h1>

      {[GAME_STAGES.planning].includes(gameSetup.stage) ? (
        <div className="w-full flex justify-around items-center flex-1 flex-col lg:flex-row lg:items-start">
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
        <div className="w-full flex justify-around items-center flex-1 lg:flex-row flex-col">
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
