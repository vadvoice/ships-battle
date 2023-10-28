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
  BATTLEFIELD_NICKNAMES,
} from '@/libs/config';
import { getRandomBetween, getShootingAccuracy } from '@/libs/helpers';
import { useEffect, useRef, useState } from 'react';
import ConfettiGenerator from 'confetti-js';
import { SummaryTable } from '@/components/SummaryTable';
import SocketIO from 'socket.io-client';
import RoomConnection from '@/components/RoomConnection';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Game() {
  const params = useSearchParams();
  const stageParam = params.get('stage');
  const gameModeParam = params.get('mode');
  const roleParam = params.get('role');
  const { user } = useUser();

  const initialGameSetupState = {
    stage: stageParam ? Number(stageParam) : GAME_STAGES.menu,
    player: {
      ...INITIAL_BATTLEFIELD_SETUP,
      role: BATTLEFIELD_SIDES.player,
      name: BATTLEFIELD_SIDES.player,
    },
    enemy: {
      ...INITIAL_BATTLEFIELD_SETUP,
      name: BATTLEFIELD_SIDES.enemy,
      role: BATTLEFIELD_SIDES.enemy,
    },
    role: roleParam || BATTLEFIELD_SIDES.player,
    name: roleParam
      ? BATTLEFIELD_NICKNAMES[roleParam]
      : BATTLEFIELD_NICKNAMES[BATTLEFIELD_SIDES.player],
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

    socket && socket.disconnect();
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
    const nextGameState = {
      ...gameSetup,
      shotsAmount: gameSetup.shotsAmount + 1,
      [whoseTurn]: {
        ...gameSetup[whoseTurn],
        combatLog: [...gameSetup[whoseTurn].combatLog, shot],
        accuracy: getShootingAccuracy(
          gameSetup[whoseTurn].combatLog.length + 1,
          gameSetup[whoseTurn].combatLog.filter((el) => el.isDamaged).length +
            (shot.isDamaged ? 1 : 0)
        ),
      },
      [oppenentSide]: {
        ...gameSetup[oppenentSide],
        fleet: oppenentFleet,
        accuracy: getShootingAccuracy(
          gameSetup[oppenentSide].combatLog.length,
          gameSetup[oppenentSide].combatLog.filter((el) => el.isDamaged).length
        ),
      },
      whoseTurn: oppenentSide,
      stage: isGameOver ? GAME_STAGES.gameover : GAME_STAGES.ongoing,
      winner: whoseTurn,
    };
    setGameSetup(nextGameState);
    socket && socket.emit('user_send_battle_action', nextGameState);

    if (isGameOver) {
      // TODO: move to services
      fetch('/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          winner: whoseTurn,
          accuracy: nextGameState[whoseTurn].accuracy,
          shots: nextGameState[whoseTurn].combatLog.length,
          nickname: nextGameState[whoseTurn].name,
          role: nextGameState[whoseTurn].role,
        }),
      });
    }
  };

  const onCreateRoom = async (roomName) => {
    if (!socket) {
      return;
    }
    onJoinRoom(roomName);
  };

  const onJoinRoom = async (roomName) => {
    await socket.emit('room_connection_request', roomName);
    toast('Joined to the room!');
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
      reconnectionAttempts: 3,
    });

    socket.on('connect', (con) => {
      setSocket(socket);
    });

    // on revive opponent action
    socket.on('user_action_planning_change', (incomingGameState) => {
      const currentGameState = gameSetupRef.current;
      const { role, name, ...rest } = incomingGameState;
      setGameSetup({
        ...currentGameState,
        stage: incomingGameState.stage,
        [incomingGameState.role]: incomingGameState[incomingGameState.role],
        ...rest,
      });
    });

    socket.on('user_action_combat_log', (incomingGameState) => {
      const currentGameState = gameSetupRef.current;
      const { role, ...rest } = incomingGameState;
      setGameSetup({
        ...currentGameState,
        ...rest,
      });
    });

    socket.on('room_user_connected', (msg) => {
      toast('Opponent connected');
      setGameSetup({
        ...gameSetup,
        stage: GAME_STAGES.planning,
      });
    });

    socket.on('room_user_disconnected', (msg) => {
      toast('Opponent disconnected');
      onReset();
    });

    socket.on('connect_error', (err) => {
      toast.error('Something went wrong. Try again later');
    });

    return socket;
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    setGameSetup({
      ...gameSetup,
      name: user.nickname,
      [gameSetup.role]: {
        ...gameSetup[gameSetup.role],
        name: user.nickname,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, gameSetup.stage]);

  // NOTE: hack to set the current game setup to ref avoiding set state hook
  // because socket.io ignores the component’s lifecycle methods and sees only the first render of the game state
  // SOURCE: https://medium.com/@kishorkrishna/cant-access-latest-state-inside-socket-io-listener-heres-how-to-fix-it-1522a5abebdb
  useEffect(() => {
    gameSetupRef.current = gameSetup;
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
        whoseTurn:
          gameSetup.mode === GAME_MODE.singlePlayer
            ? side
            : BATTLEFIELD_SIDES.player,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (isGameOverStage) {
    return (
      <div className="flex flex-col items-center w-full flex-1 overflow-hidden">
        {/* background confetti */}
        <canvas
          className="inset-x-0 flex-1 w-screen absolute"
          style={{
            maxHeight: '-webkit-fill-available',
          }}
          id="congrats"
        ></canvas>

        <h2 className="mt-4 mb-2 text-2xl font-bold dark:text-white text-center uppercase">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            {gameSetup.name}{' '}
          </span>
          wins!
        </h2>

        <SummaryTable gameState={gameSetup} />

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
    <div
      className={`flex flex-col items-center w-full flex-1 ${
        [
          GAME_STAGES.menu,
          GAME_STAGES.connection,
          GAME_STAGES.planning,
        ].includes(gameSetup.stage)
          ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 to-indigo-500'
          : 'bg-gradient-to-b from-blue-600 via-cyan-950 to-red-600 md:bg-gradient-to-r'
      }`}
    >
      {isConnectionStage && (
        <RoomConnection
          socket={socket}
          gameState={gameSetup}
          actions={{ onCreateRoom, onJoinRoom, onReset }}
        />
      )}

      {[GAME_STAGES.planning].includes(gameSetup.stage) ? (
        <div className="w-full flex justify-around items-center flex-1 lg:flex-row flex-col">
          <BattlefieldPlanning
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
          <motion.div initial={{ x: '-100vw' }} animate={{ x: '0%' }}>
            <Battlefield
              isPlayer
              socket={socket}
              gameState={gameSetup}
              actions={{ onChange: setGameSetup, onShot }}
            />
          </motion.div>

          <motion.div initial={{ x: '100vw' }} animate={{ x: '0%' }}>
            <Battlefield
              isEnemy
              isPc={isPc}
              socket={socket}
              gameState={gameSetup}
              actions={{ onChange: setGameSetup, onShot }}
            />
          </motion.div>
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
