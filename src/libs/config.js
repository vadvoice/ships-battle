export const GAME_STAGES = {
  menu: 0,
  planning: 1,
  planningComplete: 2,
  ready: 3,
  ongoing: 4,
  gameover: 5,
};

export const GAME_STAGE_MAP = {
  0: 'Menu',
  1: 'Planning',
  2: 'Planning Complete',
  3: 'Ready',
  4: 'Game',
  5: 'gameover',
};

export const SHIP_DETAILS = [
  { name: 'carrier', length: 5, amount: 1, used: false, color: 'bg-red-500' },
  { name: 'battleship', length: 4, amount: 1, used: false, color: 'bg-blue-500' },
  { name: 'cruiser', length: 3, amount: 1, used: false, color: 'bg-green-500' },
  { name: 'destroyer', length: 3, amount: 1, used: false, color: 'bg-yellow-500' },
  { name: 'frigate', length: 2, amount: 1, used: false, color: 'bg-purple-500' },
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

export const INITIAL_BATTLEFIELD_SETUP = {
  shipDetails: SHIP_DETAILS,
  currentShipIndex: 0,
  currentShip: SHIP_DETAILS[0],
  horizontalPlacement: true,
  fleet: [],
  stage: GAME_STAGES.planning,
  combatLog: [],
};

export const BATTLEFIELD_SIDES = {
  player: 'player',
  enemy: 'enemy',
};