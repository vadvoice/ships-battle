import { COLUMNS_AMOUNT, ROWS_AMOUNT } from "./config";

export const getCoords = (domEl) => {
  if (!domEl) return;

  return {
    x: domEl.dataset.index,
    y: domEl.dataset.row,
    concatenated: `x:${domEl.dataset.index};y:${domEl.dataset.row}`,
    raw: domEl.dataset.index + domEl.dataset.row,
    ref: domEl,
  };
};

/**
 * @param {Number} min
 * @param {Number} max
 * @returns {Number} random number between min and max
 * 
 * @example
*/
export function getRandomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 
 * @param {Number} x coordinate
 * @param {Number} y coordinate
 * @returns {Object} virtual coordinates
 */
export const getVirtualCoords = (x, y) => {
  return {
    x,
    y,
    concatenated: `x:${x};y:${y}`,
    raw: x + y,
  };
}

/**
 * 
 * @param {Object} battlefield
 * @returns {Array} fleet
*/
export const getGenericFleet = (battlefield) => {
  const fleet = [];
  let counter = 0;
  const shipList = battlefield.shipDetails;

  while (fleet.length < shipList.length) {
    const randomColumnIndex = getRandomBetween(1, COLUMNS_AMOUNT);
    const randomRowIndex = getRandomBetween(1, ROWS_AMOUNT);

    const currentShip = shipList[counter];
    const affectedCells = Array(currentShip.length)
      .fill()
      .map((_, index) => {
        const nextColumnIndex = randomColumnIndex + index;
        return {
          x: nextColumnIndex,
          y: randomRowIndex,
          raw: `${nextColumnIndex}${randomRowIndex}`,
          concatenated: `x:${nextColumnIndex};y:${randomRowIndex}`,
        };
      });

    const shipLength = randomColumnIndex + currentShip.length;
    const isShipFitOnBattlefield = shipLength < ROWS_AMOUNT;
    const isOverlapsWithExistingShips = fleet.some(({ position }) => {
      return affectedCells.some((coord) => {
        return position.some((p) => p.raw === coord.raw);
      });
    });

    if (isOverlapsWithExistingShips || !isShipFitOnBattlefield) {
      continue;
    }

    counter++;
    fleet.push({
      name: currentShip.name,
      position: affectedCells,
    });
  }

  return fleet;
};

/**
 *
 * @param {DOMElement} target clicked table cell
 * @returns {Array} prediction of affected cells
 */
export const getAffectedCells = (target, battlefieldTable, battlefield) => {
  const targetColIndex = Number(target.dataset.index);
  const targetRowIndex = Number(target.dataset.row);
  const amountOfCellsToBeHightlightedHorizontally =
    battlefield.currentShip.length + targetColIndex;
  const amountOfCellsToBeHightlightedVertically =
    battlefield.currentShip.length + targetRowIndex;

  const affectedCells = [];
  // just KISS
  // regular horizontal placement
  if (battlefield.horizontalPlacement) {
    for (
      let index = targetColIndex;
      index < amountOfCellsToBeHightlightedHorizontally;
      index++
    ) {
      const cell = battlefieldTable.current.querySelector(
        `td[data-index="${index}"][data-row="${targetRowIndex}"]`
      );

      if (!cell) return;
      affectedCells.push(cell);
    }
  } else {
    // vertical placement
    for (
      let index = targetRowIndex;
      index < amountOfCellsToBeHightlightedVertically;
      index++
    ) {
      const cell = battlefieldTable.current.querySelector(
        `td[data-index="${targetColIndex}"][data-row="${index}"]`
      );

      if (!cell) return;

      affectedCells.push(cell);
    }
  }

  return affectedCells;
};
