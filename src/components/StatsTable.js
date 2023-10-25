import { BATTLEFIELD_SIDES } from '@/libs/config';
import Image from 'next/image';

export const StatsTable = ({ stats }) => {
  // TODO: pagination
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-5 w-screen">
      <h1 className="mb-2 text-2xl font-extrabold text-gray-900 dark:text-white text-center">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Battle Ships
        </span>{' '}
        Statistics
      </h1>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Player name
            </th>
            <th scope="col" className="px-6 py-3">
              Side
            </th>
            <th scope="col" className="px-6 py-3">
              Shots made
            </th>
            <th scope="col" className="px-6 py-3">
              Accuracy
            </th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat, index) => (
            <tr
              key={stat.accuracy + index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-4">{stat.nickname}</td>
              <td className="px-6 py-4">
                {stat.winner === BATTLEFIELD_SIDES.player ? (
                  <Image src="/alliance.png" alt="alliance" width={50} height={50} />
                ) : (
                  <Image src="/horde.png" alt="horde" width={50} height={50} />
                )}
              </td>
              <td className="px-6 py-4">{stat.shots}</td>
              <td className="px-6 py-4">{stat.accuracy} %</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
