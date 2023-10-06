import {
  CELL_HEIGHT,
  CELL_WIDTH,
  COLUMNS_AMOUNT,
  ROWS_AMOUNT,
  ROW_NAMES,
} from './config';

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
export const getVirtualCoords = (x, y, shipColor = '') => {
  return {
    x,
    y,
    concatenated: `x:${x};y:${y}`,
    // x and y are swapped for the raw value
    raw: `${x}${y}`,
    isDamaged: false,
    shipColor,
  };
};

export const getVirtualAffectedCells = ({
  colunnIndex,
  rowIndex,
  ship,
  isHorizontalPlacement = true,
  shipColor,
}) => {
  let affectedCells = [];
  if (isHorizontalPlacement) {
    affectedCells = Array(ship.length)
      .fill()
      .map((_, index) => {
        const nextColumnIndex = colunnIndex + index;
        if (nextColumnIndex > COLUMNS_AMOUNT) return;
        return getVirtualCoords(nextColumnIndex, rowIndex, shipColor);
      })
      .filter(Boolean);
  } else {
    affectedCells = Array(ship.length)
      .fill()
      .map((_, index) => {
        const nextRowIndex = rowIndex + index;
        if (nextRowIndex > ROWS_AMOUNT) return;
        return getVirtualCoords(colunnIndex, nextRowIndex, shipColor);
      })
      .filter(Boolean);
  }

  return affectedCells;
};

export const isShipPlacementValid = ({ affectedCells, fleet, ship }) => {
  const isShipFitOnBattlefield = ship.length === affectedCells.length;

  const isOverlapsWithExistingShips = fleet.some(({ position }) => {
    return affectedCells.some((coord) => {
      return position.some((p) => p.raw === coord.raw);
    });
  });

  return !isOverlapsWithExistingShips && isShipFitOnBattlefield;
};
/**
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

    const affectedCells = getVirtualAffectedCells({
      colunnIndex: randomColumnIndex,
      rowIndex: randomRowIndex,
      ship: currentShip,
      isHorizontalPlacement: Math.random() > 0.5,
      shipColor: currentShip.color,
    });

    if (!isShipPlacementValid({ affectedCells, fleet, ship: currentShip })) {
      continue;
    }

    counter++;
    fleet.push({
      ...currentShip,
      position: affectedCells,
    });
  }

  return fleet;
};

export const getRandomShotCoords = () => {
  const randomColumnIndex = getRandomBetween(1, COLUMNS_AMOUNT);
  const randomRowIndex = getRandomBetween(1, ROWS_AMOUNT);

  return getVirtualCoords(randomColumnIndex, randomRowIndex);
};

export const buildTableContent = () => {
  return (
    <>
      <thead>
        <tr>
          {Array(ROWS_AMOUNT)
            .fill()
            .map((_, headIndex) => {
              return (
                <th
                  // className={`${CELL_WIDTH} ${CELL_HEIGHT} uppercase`}
                  className={`w-10 h-10 uppercase`}
                  key={`table-head-${headIndex}`}
                >
                  {headIndex || ''}
                </th>
              );
            })}
        </tr>
      </thead>
      <tbody>
        {Array(COLUMNS_AMOUNT)
          .fill()
          .map((el, index) => {
            return (
              <tr key={`row-${index}`}>
                {Array(8)
                  .fill()
                  .map((el, innerIndex) => {
                    if (!innerIndex) {
                      return (
                        <th
                          key={`table-data-${innerIndex}`}
                          className={`${CELL_WIDTH} ${CELL_HEIGHT} uppercase`}
                        >
                          {ROW_NAMES[index]}
                        </th>
                      );
                    }
                    return (
                      <td
                        key={`table-data-${innerIndex}`}
                        className={`${CELL_WIDTH} ${CELL_HEIGHT} text-center border-solid border-2 border-indigo-600 rounded relative hover:bg-sky-700 cursor-pointer`}
                        data-index={innerIndex}
                        data-row={index + 1}
                      >
                        {/* {innerIndex} */}
                      </td>
                    );
                  })}
              </tr>
            );
          })}
      </tbody>
    </>
  );
};

export function financialFormat(x) {
  return Number.parseFloat(x).toFixed(2);
}

export const getShootingAccuracy = (shotsMade, hits) => {
  return financialFormat((hits / shotsMade) * 100);
}