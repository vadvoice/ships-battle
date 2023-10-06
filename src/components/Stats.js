import { BATTLEFIELD_SIDES } from '@/libs/config';
import { getShootingAccuracy } from '@/libs/helpers';

export const Stats = ({ gameState }) => {
  const playerShootingAccuracy = getShootingAccuracy(gameState.player.combatLog.length, gameState.player.combatLog.filter((el) => el.isDamaged).length)
  const enemyShootingAccuracy = getShootingAccuracy(gameState.enemy.combatLog.length, gameState.enemy.combatLog.filter((el) => el.isDamaged).length)
  return (
    <div className="w-full flex">
      <div className="relative overflow-x-auto w-full shadow-md sm:rounded-lg mx-5">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Player
              </th>
              <th scope="col" className="px-6 py-3">
                Shots made
              </th>
              <th scope="col" className="px-6 py-3">
                Hits
              </th>
              <th scope="col" className="px-6 py-3">
                Accuracy
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {gameState.player.name}
              </th>
              <td className="px-6 py-4">{gameState.player.combatLog.length}</td>
              <td className="px-6 py-4">{gameState.player.combatLog.filter((el) => el.isDamaged).length}</td>
              <td className="px-6 py-4">{playerShootingAccuracy}%</td>
              <td className="px-6 py-4">
                {gameState.winner === BATTLEFIELD_SIDES.player
                  ? '✅'
                  : '❌'}
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {gameState.enemy.name}
              </th>
              <td className="px-6 py-4">{gameState.enemy.combatLog.length}</td>
              <td className="px-6 py-4">{gameState.enemy.combatLog.filter((el) => el.isDamaged).length}</td>
              <td className="px-6 py-4">{enemyShootingAccuracy}%</td>
              <td className="px-6 py-4">
                {gameState.winner === BATTLEFIELD_SIDES.enemy
                  ? '✅'
                  : '❌'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};