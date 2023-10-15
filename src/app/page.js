'use client';

import Battlefield from '@/components/Battlefield';
import BattlefieldPlanning from '@/components/BattlefieldPlanning';
import GameSettings from '@/components/GameSettings';
import {
  GAME_STAGES,
  GAME_MODE,
  INITIAL_BATTLEFIELD_SETUP,
  BATTLEFIELD_SIDES,
  ENV_VARS,
  GAME_STAGE_MAP,
} from '@/libs/config';
import { getRandomBetween } from '@/libs/helpers';
import { useEffect, useRef, useState } from 'react';
import ConfettiGenerator from 'confetti-js';
import { Stats } from '@/components/Stats';
import SocketIO from 'socket.io-client';
import RoomConnection from '@/components/RoomConnection';
import { useSearchParams } from 'next/navigation';

export default function Game() {
  const params = useSearchParams();
  const stageParam = params.get('stage');
  const gameModeParam = params.get('mode');
  const roleParam = params.get('role');

  const initialGameSetupState = {
    stage: stageParam ? Number(stageParam) : GAME_STAGES.menu,
    player: {
      name: BATTLEFIELD_SIDES.player,
      ...INITIAL_BATTLEFIELD_SETUP,
    },
    enemy: {
      name: BATTLEFIELD_SIDES.enemy,
      ...INITIAL_BATTLEFIELD_SETUP,
    },
    role: roleParam || BATTLEFIELD_SIDES.player,
    roomName: null,
    mode: gameModeParam ? +gameModeParam : GAME_MODE.singlePlayer,
    whoseTurn: null,
    winner: null,
    shotsAmount: 0,
  };

  const [gameSetup, setGameSetup] = useState(initialGameSetupState);
  const gameSetupRef = useRef(gameSetup);
  const [socket, setSocket] = useState(null);
  const isPc = gameSetup.mode === GAME_MODE.singlePlayer;
  const isGameOverStage = gameSetup.stage === GAME_STAGES.gameover;
  const isConnectionStage = gameSetup.stage === GAME_STAGES.connection;

  const onGameModeChange = (mode) => {
    if (mode === GAME_MODE.multiPlayer) {
      setGameSetup({
        ...gameSetup,
        mode,
        stage: GAME_STAGES.connection,
      });
      return;
    }
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

  // NOTE: hack to set the current game setup to ref avoiding set state hook
  // because socket.io ignores the component’s lifecycle methods and sees only the first render of the game state
  // SOURCE: https://medium.com/@kishorkrishna/cant-access-latest-state-inside-socket-io-listener-heres-how-to-fix-it-1522a5abebdb
  useEffect(() => {
    gameSetupRef.current = gameSetup;
    // TODO: possibly could be moved to the parent
    // TODO: potentially memory leak
    socket && socket.emit('user_send_action', gameSetup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSetup]);

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
      const nextGameState = {
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
      };
      setGameSetup(nextGameState);
    }
  }, [gameSetup]);

  useEffect(() => {
    if (!isGameOverStage) {
      return;
    }
    const confettiSettings = { target: 'congrats' };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();

    return () => confetti.clear();
  }, [isGameOverStage]);

  const createRoom = async (roomName) => {
    if (!socket) {
      return;
    }
    onJoinRoom(roomName);
  };

  const onJoinRoom = async (roomName) => {
    await socket.emit('join_room', roomName);
    setGameSetup({
      ...gameSetup,
      roomName,
    });
  };

  const socketInitializer = async () => {
    // We call this just to make sure we turn on the websocket server
    await fetch('/api/socket');

    const socket = SocketIO(undefined, {
      path: ENV_VARS.socketPath,
    });

    socket.on('connect', (con) => {
      console.log('Connected', socket.id);
      setSocket(socket);
    });

    // on revive opponent action
    socket.on('user_action', (incomingGameState) => {
      const currentGameState = gameSetupRef.current;
      setGameSetup({
        ...currentGameState,
        stage:
          currentGameState.stage === GAME_STAGES.connection
            ? GAME_STAGES.planning
            : currentGameState.stage,
        [incomingGameState.role]: incomingGameState[incomingGameState.role],
      });
    });

    socket.on('connection_successful', (msg) => {
      setGameSetup({
        ...gameSetup,
        stage: GAME_STAGES.planning,
      });
    });

    socket.on('user_disconnected', (msg) => {
      console.log('opponent disconnected', msg);
      setGameSetup(initialGameSetupState);
    });

    return socket;
  };

  // initialize socket once multiplaer mode selected
  useEffect(() => {
    const isConnectionHaveToEstablished =
      gameSetup.mode === GAME_MODE.multiPlayer && !socket && isConnectionStage;

    if (!isConnectionHaveToEstablished) {
      return;
    }
    socketInitializer();

    return () => {
      socket && socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSetup.mode]);

  if (isConnectionStage) {
    return (
      <RoomConnection
        socket={socket}
        gameState={gameSetup}
        actions={{ createRoom, onJoinRoom }}
      />
    );
  }

  if (isGameOverStage) {
    return (
      <div className="relative w-full flex justify-center flex-1 h-screen">
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
    <div className="flex flex-1 flex-col items-center">
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
            socket={socket}
            actions={{ onChange: setGameSetup }}
            gameState={gameSetup}
          />

          {isPc ? (
            <BattlefieldPlanning
              isPc={isPc}
              socket={socket}
              actions={{ onChange: setGameSetup }}
              gameState={gameSetup}
            />
          ) : null}
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
            isPc={isPc}
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
