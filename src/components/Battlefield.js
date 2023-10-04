import { BATTLEFIELD_SIDES, COLOR_SCHEMA } from '@/libs/config';
import {
  buildTableContent,
  getRandomShotCoords,
  getVirtualCoords,
} from '@/libs/helpers';

import React, { useRef, useState, useEffect } from 'react';

export default function Battlefield({
  isPc,
  isMain,
  gameState,
  actions: { onShot },
}) {
  // TODO: confusing naming and values too
  const battlefieldTable = useRef();
  const initialBattlefieldSetup = isPc
    ? gameState.enemy
    : gameState.player;
  const playerSide = isMain
    ? BATTLEFIELD_SIDES.player
    : BATTLEFIELD_SIDES.enemy;
  const isFireAllowed = gameState.whoseTurn === playerSide;
  const [battlefield,] = useState(initialBattlefieldSetup);
  const enemySide = isMain ? BATTLEFIELD_SIDES.enemy : BATTLEFIELD_SIDES.player;
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
  }

  useEffect(() => {
    if (!isFireAllowed) {
      return;
    }

    if (!isPc) {
      return;
    }

    let isShotValid = false;
    // do attempts until PC get a valid shot
    while (!isShotValid) {
      const randomCoords = getRandomShotCoords();
      if (gameState[enemySide].combatLog.some((el) => el.raw === randomCoords.raw)) {
        continue;
      }
      isShotValid = true;

      onShot({ shot: randomCoords });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFireAllowed]);
 
  // once compat log is changed, we need to highlight the last shot on the enemy battlefield
  useEffect(() => {
    if (!gameState[enemySide].combatLog.length) {
      return;
    }
    const shot = gameState[enemySide].combatLog[gameState[enemySide].combatLog.length - 1];
    if (shot) {
      hightlightCombatLog(shot);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState[enemySide].combatLog]);

  useEffect(() => {
    if (!battlefield.fleet.length || isPc) {
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
  }, [battlefield.fleet, isPc]);

  const handleBattlefieldClick = (e) => {
    if (e.target.tagName !== 'TD') {
      return;
    }
    // REDO: check for the active player
    if (isMain) {
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
    <div>
      <h4 className="text-2xl font-bold dark:text-white text-center my-2">
        {isPc ? 'PC' : 'Player'}
      </h4>

      <table
        ref={battlefieldTable}
        className={`m-0 border-spacing-0.5 border-separate`}
        onClick={handleBattlefieldClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {buildTableContent()}
      </table>
    </div>
  );
}
