export const GAME_STAGES = {
  menu: 0,
  planning: 1,
  planningComplete: 2,
  ongoing: 3,
  gameover: 4,
};

export const SHIP_DETAILS = [
  { name: 'carrier', length: 5, amount: 1, used: false },
  { name: 'battleship', length: 4, amount: 1, used: false },
  { name: 'cruiser', length: 3, amount: 1, used: false },
  { name: 'destroyer', length: 3, amount: 1, used: false },
  { name: 'frigate', length: 2, amount: 1, used: false },
];

export const COLOR_SCHEMA = {
  hover: 'bg-slate-400',
  // placed: 'bg-neutral-900',
  placed: 'dark:bg-gray-700 bg-neutral-900',
  damage: 'bg-orange-600',
  empty: 'bg-teal-50',
  dynamicHoverColor: 'rgb(148 163 184)',
};

export const GAME_MODE = {
  singlePlayer: 1,
  multiplayer: 2,
}

export const ROW_NAMES = 'abcdefghijklmnopqrstuvwxyz'.split('');

export const CELL_WIDTH = 'w-10';
export const CELL_HEIGHT = 'h-10';

export const ROWS_AMOUNT = 8;
export const COLUMNS_AMOUNT = 7;
