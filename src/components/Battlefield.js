import {
  BATTLEFIELD_SIDES,
  COLOR_SCHEMA,
  MAX_AMOUNT_OF_SHOTS,
  TARGET_POSITION,
} from '@/libs/config';
import {
  buildTableContent,
  getRandomShotCoords,
  getVirtualCoords,
} from '@/libs/helpers';
import Image from 'next/image';
import TargetImage from '../../public/target.png';

import React, { useRef, useState, useEffect } from 'react';
import { useWindowSize } from '@/hooks/useWindowSize';
import { CombatStats } from './CombatStats';
import { motion } from 'framer-motion';

export default function Battlefield({
  isPc,
  isPlayer,
  isEnemy,
  gameState,
  actions: { onShot },
}) {
  // TODO: confusing naming and values too
  const { isMobile } = useWindowSize();
  const isClickAllowed = gameState.whoseTurn === gameState.role;
  const battlefieldTable = useRef();
  const initialBattlefieldSetup = isEnemy ? gameState.enemy : gameState.player;
  const [battlefield] = useState(initialBattlefieldSetup);
  const enemySide = isPlayer
    ? BATTLEFIELD_SIDES.enemy
    : BATTLEFIELD_SIDES.player;
  let activeCell = null;

  const onMouseMove = (e) => {
    if (e.target.tagName !== 'TD') {
      return;
    }
    if (activeCell) {
      activeCell.classList.remove(COLOR_SCHEMA.hover);
      activeCell = null;
    }
    activeCell = e.target;
    activeCell.classList.add(COLOR_SCHEMA.hover);
  };

  const onMouseLeave = () => {
    if (activeCell) {
      activeCell.classList.remove(COLOR_SCHEMA.hover);
      activeCell = null;
    }
  };

  const onTouchEnd = () => {
    const cells = battlefieldTable.current.querySelectorAll('td');
    cells.forEach((el) => el.classList.remove(COLOR_SCHEMA.hover));
  };

  useEffect(() => {
    async function makeShot() {
      if (!isPc) {
        return;
      }

      if (gameState.whoseTurn !== BATTLEFIELD_SIDES.enemy) {
        return;
      }

      let isShotValid = false;

      await new Promise((resolve) => setTimeout(resolve, 500));

      // do attempts until PC get a valid shot
      while (!isShotValid) {
        const randomCoords = getRandomShotCoords();
        if (
          gameState[enemySide].combatLog.some(
            (el) => el.raw === randomCoords.raw
          )
        ) {
          continue;
        }
        isShotValid = true;

        onShot({ shot: randomCoords, isPc });
      }
    }

    makeShot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClickAllowed, gameState.whoseTurn, isPc]);

  // once compat log is changed, we need to highlight the last shot on the enemy battlefield
  useEffect(() => {
    if (!gameState[enemySide].combatLog.length) {
      return;
    }

    if (MAX_AMOUNT_OF_SHOTS === gameState.shotsAmount) {
      return;
    }

    const shot =
      gameState[enemySide].combatLog[gameState[enemySide].combatLog.length - 1];
    if (shot) {
      hightlightCombatLog(shot);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState[enemySide].combatLog]);

  useEffect(() => {
    if (
      !battlefield.fleet.length ||
      isPc ||
      battlefield.role !== gameState.role
    ) {
      return;
    }

    battlefield.fleet.map((el) => {
      el.position.map((ship) => {
        let cell = ship.ref;

        if (!cell) {
          cell = battlefieldTable.current.querySelector(
            `td[data-index="${ship.x}"][data-row="${ship.y}"]`
          );
        }
        if (!cell) {
          return;
        }
        cell.classList.add(ship.shipColor);
      });
    });
    if (isPc) {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battlefield.fleet, isPc]);

  const handleBattlefieldClick = (e) => {
    if (e.target.tagName !== 'TD') {
      return;
    }

    // allow click only on users turn
    if (!isClickAllowed) {
      return;
    }

    // avoid click on oun battlefield
    if (e.target.dataset.side === gameState.role) {
      return;
    }

    const coords = getVirtualCoords(
      +e.target.dataset.index,
      +e.target.dataset.row
    );

    if (gameState[enemySide].combatLog.some((el) => el.raw === coords.raw)) {
      return;
    }

    onShot({ shot: coords });
  };

  const hightlightCombatLog = (coords) => {
    const battlefieldCell = battlefieldTable.current.querySelector(
      `td[data-index="${coords.x}"][data-row="${coords.y}"]`
    );

    if (
      !battlefieldCell ||
      battlefield.combatLog.some((el) => el.raw === coords.raw)
    ) {
      return;
    }

    const isCellContainsShip = battlefield.fleet.some((el) => {
      return el.position.some((ship) => {
        return (
          ship.raw ===
          battlefieldCell.dataset.index + battlefieldCell.dataset.row
        );
      });
    });

    if (isCellContainsShip) {
      battlefieldCell.classList.add(`after:content-['❌']`);
    } else {
      battlefieldCell.classList.add(`after:content-['⚫']`);
    }
  };

  return (
    <div className="relative">
      <h4 className="md:text-2xl text-1xl font-bold dark:text-white text-center mt-2 mb-1">
        {isEnemy ? gameState.enemy.name : gameState.player.name}
      </h4>
      {enemySide === gameState.whoseTurn && isClickAllowed ? (
        <motion.div
          initial={{
            scale: 0,
          }}
          animate={{
            x: !isMobile ? TARGET_POSITION.desktop.y : TARGET_POSITION.mobile.x,
            y: !isMobile ? TARGET_POSITION.desktop.y : TARGET_POSITION.mobile.y,
            scale: 1,
          }}
        >
          <Image
            className={`absolute w-11/12 opacity-30 animate-pulse`}
            src={TargetImage}
            alt="Target"
          />
        </motion.div>
      ) : null}
      <table
        id={`table-battlefield-${isPlayer ? 'player' : 'enemy'}`}
        ref={battlefieldTable}
        className={`relative m-0 border-spacing-0.5 border-separate`}
        onClick={handleBattlefieldClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onTouchEnd={onTouchEnd}
      >
        {buildTableContent({
          side: isPlayer ? BATTLEFIELD_SIDES.player : BATTLEFIELD_SIDES.enemy,
          isMobile,
        })}
      </table>
      {!isMobile ? (
        <CombatStats player={gameState[isPlayer ? 'player' : 'enemy']} />
      ) : null}
    </div>
  );
}
