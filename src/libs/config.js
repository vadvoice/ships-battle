export const GAME_STAGES = {
  menu: 0,
  connection: 1,
  planning: 2,
  planningComplete: 3,
  ready: 4,
  ongoing: 5,
  gameover: 6,
};

export const GAME_STAGE_MAP = {
  0: 'Menu',
  1: 'Connection',
  2: 'Planning',
  3: 'Planning Complete',
  4: 'Ready',
  5: 'Game',
  6: 'gameover',
};

export const SHIP_DETAILS = [
  {
    name: 'carrier',
    length: 5,
    amount: 1,
    isDamaged: false,
    color: 'bg-red-400',
    isSunk: false,
  },
  {
    name: 'battleship',
    length: 4,
    amount: 1,
    isDamaged: false,
    color: 'bg-blue-500',
    isSunk: false,
  },
  {
    name: 'cruiser',
    length: 3,
    amount: 1,
    isDamaged: false,
    color: 'bg-green-500',
    isSunk: false,
  },
  {
    name: 'destroyer',
    length: 3,
    amount: 1,
    isDamaged: false,
    color: 'bg-yellow-500',
    isSunk: false,
  },
  {
    name: 'frigate',
    length: 2,
    amount: 1,
    isDamaged: false,
    color: 'bg-purple-500',
    isSunk: false,
  },
];

export const COLOR_SCHEMA = {
  hover: 'bg-violet-200',
  // placed: 'bg-neutral-900',
  placed: 'dark:bg-gray-700 bg-neutral-900',
  damage: 'bg-orange-600',
  empty: 'bg-teal-50',
  dynamicHoverColor: 'rgb(148 163 184)',
};

export const GAME_MODE = {
  singlePlayer: 1,
  multiPlayer: 2,
};

export const ROW_NAMES = 'abcdefghijklmnopqrstuvwxyz'.split('');

export const CELL_SIZE = {
  desktop: 'w-12 h-12',
  mobile: 'w-8 h-8',
};

export const CELL_WIDTH = 'w-12';
export const CELL_HEIGHT = 'h-12';

export const ROWS_AMOUNT = 7;
export const COLUMNS_AMOUNT = 7;

export const MAX_AMOUNT_OF_SHOTS = ROWS_AMOUNT * COLUMNS_AMOUNT;

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

export const BATTLEFIELD_NICKNAMES = {
  player: 'Alliance',
  enemy: 'Horde',
};

export const ENV_VARS = {
  socketPath: process.env.SOCKET_MULTIPLAYER_PATH || '/api/multiplayer_connection',
};