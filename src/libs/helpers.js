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