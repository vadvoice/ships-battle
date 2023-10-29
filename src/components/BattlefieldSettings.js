'use client';

import { GAME_STAGES } from '@/libs/config';
import { Button } from 'flowbite-react';
import { MdSync, MdOutlineUndo, MdDone, MdEast, MdSouth } from 'react-icons/md';
import { Divider, HorizontalDivider } from './Divider';
import { motion } from 'framer-motion';
import { useWindowSize } from '@/hooks/useWindowSize';

export default function BattlefieldSettings({
  actions: { onReset, onPositionChange, onReady, autoGenerate },
  gameState,
}) {
  const { isMobile } = useWindowSize();
  const { horizontalPlacement } = gameState;

  const isPlanningStage = gameState.stage === GAME_STAGES.planning;
  const isPlanningStageComplete =
    gameState.stage === GAME_STAGES.planningComplete;

  return (
    <div className="flex justify-between p-2 mt-5 flex-col">
      <div className="flex justify-between items-center text-xs md:text-base">
        <Button
          size={isMobile ? 'xs' : 'md'}
          color="blue"
          onClick={autoGenerate}
        >
          <MdSync className="mr-2 h-5 w-5" />
          Generic
        </Button>

        <Divider />

        <Button size={isMobile ? 'xs' : 'md'} color="warning" onClick={onReset}>
          <MdOutlineUndo className="mr-2 h-5 w-5" />
          Reset
        </Button>

        <Divider />

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <Button
            size={isMobile ? 'xs' : 'md'}
            color="success"
            onClick={onReady}
            disabled={!isPlanningStageComplete}
          >
            <MdDone className="mr-2 h-5 w-5" />
            I&apos;m ready!
          </Button>
        </motion.div>
      </div>

      {/* // ship position  */}
      <div className="my-2 flex justify-center">
        <label
          className={`relative inline-flex items-center ${
            !isPlanningStage ? 'cursor-not-allowed' : ' cursor-pointer'
          }`}
        >
          <input
            disabled={!isPlanningStage}
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
            <MdEast className="mr-2 h-5 w-5" />
          ) : (
            <MdSouth className="mr-2 h-5 w-5" />
          )}
        </div>
      </div>
    </div>
  );
}
