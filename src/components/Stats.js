import { BATTLEFIELD_SIDES } from '@/libs/config';

export const Stats = ({ gameState }) => {
  // TODO: accuracy calculation
  return (
    <div className="w-full flex">
      <div class="relative overflow-x-auto w-full">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Player
              </th>
              <th scope="col" class="px-6 py-3">
                Shots made
              </th>
              <th scope="col" class="px-6 py-3">
                Accuracy
              </th>
              <th scope="col" class="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {gameState.player.name}
              </th>
              <td class="px-6 py-4">{gameState.player.combatLog.length}</td>
              <td class="px-6 py-4">30%</td>
              <td class="px-6 py-4">
                {gameState.winner === BATTLEFIELD_SIDES.player
                  ? '☑'
                  : '☒'}
              </td>
            </tr>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {gameState.enemy.name}
              </th>
              <td class="px-6 py-4">{gameState.enemy.combatLog.length}</td>
              <td class="px-6 py-4">23%</td>
              <td class="px-6 py-4">
                {gameState.winner === BATTLEFIELD_SIDES.enemy
                  ? '☑'
                  : '☒'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
