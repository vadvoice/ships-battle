import { BATTLEFIELD_SIDES } from '@/libs/config';

export const SummaryTable = ({ gameState }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-5 w-screen">
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
              Alliance
            </th>
            <td className="px-6 py-4">{gameState.player.combatLog.length}</td>
            <td className="px-6 py-4">
              {gameState.player.combatLog.filter((el) => el.isDamaged).length}
            </td>
            <td className="px-6 py-4">{gameState.player.accuracy}%</td>
            <td className="px-6 py-4">
              {gameState.winner === BATTLEFIELD_SIDES.player ? '✅' : '❌'}
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              Horde
            </th>
            <td className="px-6 py-4">{gameState.enemy.combatLog.length}</td>
            <td className="px-6 py-4">
              {gameState.enemy.combatLog.filter((el) => el.isDamaged).length}
            </td>
            <td className="px-6 py-4">{gameState.enemy.accuracy}%</td>
            <td className="px-6 py-4">
              {gameState.winner === BATTLEFIELD_SIDES.enemy ? '✅' : '❌'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
