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
