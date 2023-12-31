'use client';

import {
  BATTLEFIELD_NICKNAMES,
  BATTLEFIELD_SIDES,
  GAME_MODE,
  GAME_STAGES,
  GAME_STAGE_MAP,
} from '@/libs/config';
import Spinner from './Spinner';
import { motion } from 'framer-motion';
import { Button, Tooltip } from 'flowbite-react';
import { Divider } from './Divider';

export default function GameSettings({
  actions: { onReset, onGameModeChange },
  gameSetup,
}) {
  const isMenuState = gameSetup.stage === GAME_STAGES.menu;
  const isConnectionState = gameSetup.stage === GAME_STAGES.connection;
  const isGamePlanning = gameSetup.stage === GAME_STAGES.planning;
  const isGameOngoing = gameSetup.stage === GAME_STAGES.ongoing;
  const isGameOver = gameSetup.stage === GAME_STAGES.gameover;
  const whoseTurn = gameSetup.whoseTurn;

  // TODO: player personalization
  const PlayerAvatar = ({ player }) => {
    return (
      <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 mr-2">
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
        <span className="bg-yellow-100 text-yellow-800 text-sm font-medium mx-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
          {stageLabel}
        </span>
      );
    }

    if (stage === GAME_STAGES.ready) {
      return (
        <span className="bg-green-100 text-green-800 text-sm font-medium mx-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
          {stageLabel}
        </span>
      );
    }

    return (
      <span className="bg-blue-100 text-blue-800 text-sm font-medium mx-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
        {stageLabel}
      </span>
    );
  };

  if (isConnectionState) {
    return <></>;
  }

  return (
    <div className="flex justify-center p-2 flex-col flex-1">
      {isMenuState ? (
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ x: '-100vw' }}
            animate={{ x: '0%' }}
            whileHover={{ scale: 1.1 }}
          >
            <Button
              onClick={() => onGameModeChange(GAME_MODE.singlePlayer)}
              color="blue"
            >
              1 Player
            </Button>
          </motion.div>

          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Divider />
          </motion.div>

          <Tooltip content="Beta version">
            <motion.div
              initial={{ x: '100vw' }}
              animate={{ x: '0%' }}
              whileHover={{ scale: 1.1 }}
            >
              <Button
                onClick={() => onGameModeChange(GAME_MODE.multiPlayer)}
                color="warning"
              >
                2 Player
              </Button>
            </motion.div>
          </Tooltip>
        </div>
      ) : null}

      {isGamePlanning ? (
        <>
          <h4 className="text-2xl font-bold dark:text-white text-center">
            {GAME_STAGE_MAP[gameSetup.stage]} Stage
          </h4>
          <div className="flex flex-col items-center md:flex-row">
            <div className="flex items-center">
              <PlayerAvatar player={gameSetup.player} />
              {gameSetup.player.name || BATTLEFIELD_NICKNAMES.player}
              <StatusBadge stage={gameSetup.player.stage} />
            </div>

            <Divider />

            <div className="flex items-center">
              <PlayerAvatar player={gameSetup.enemy} />
              {gameSetup.enemy.name || BATTLEFIELD_NICKNAMES.enemy}
              <StatusBadge stage={gameSetup.enemy.stage} />
            </div>
          </div>
          <div className="actions flex self-center mt-2">
            <motion.div whileHover={{ scale: 1.1 }}>
              <Button color="failure" onClick={onReset}>
                Quit
              </Button>
            </motion.div>
          </div>
        </>
      ) : null}

      {isGameOngoing ? (
        <>
          <div className="flex items-center text-blue-700 border-y-2 border-fuchsia-50 justify-center text-fuchsia-50">
            {/* TODO: shoul I use translate.json???? */}
            <p className="text-sm text-center mr-2">Shots made:</p>
            <span className="text-md font-bold">{gameSetup.shotsAmount}</span>
          </div>
          <div className="flex my-3 items-center">
            <div className={`relative flex items-center mx-3`}>
              {whoseTurn === BATTLEFIELD_SIDES.player ? (
                <div className="absolute z-10">
                  <Spinner />
                </div>
              ) : null}
              <PlayerAvatar player={gameSetup.player} />
              <h5 className="font-bold dark:text-white text-center">
                {gameSetup.player.name || BATTLEFIELD_NICKNAMES.player}
              </h5>
            </div>

            <Divider />

            <div className={`relative flex items-center mx-3`}>
              {whoseTurn === BATTLEFIELD_SIDES.enemy ? (
                <div className="absolute z-10">
                  <Spinner />
                </div>
              ) : null}
              <PlayerAvatar player={gameSetup.enemy} />
              <h5 className="font-bold dark:text-white text-center">
                {gameSetup.enemy.name || BATTLEFIELD_NICKNAMES.enemy}
              </h5>
            </div>
          </div>
          <div className="actions flex self-center mt-2">
            <motion.div whileHover={{ scale: 1.1 }}>
              <Button color="failure" onClick={onReset}>
                Quit
              </Button>
            </motion.div>
          </div>
        </>
      ) : null}

      {isGameOver && (
        <div className="relative actions flex self-center mt-2">
          <Button color="failure" onClick={onReset}>
            Quit
          </Button>
        </div>
      )}
    </div>
  );
}
