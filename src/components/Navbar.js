'use client';

import { useUser } from '@/hooks/useUser';
import Link from 'next/link';

export default function Navbar() {
  const { user, onResetUserState } = useUser();

  return (
    <nav className="absolute z-10 flex justify-between items-center px-4 md:py-2 py-1 w-screen bg-white dark:bg-gray-900">
      <Link href="/">
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            Battle Ships
          </span>{' '}
        </h1>
      </Link>

      <ul className="font-medium flex p-4 md:p-0 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        <Link
          href="/about"
          className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
        >
          About
        </Link>
      </ul>

      {user ? (
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>

          <span className="ml-2 text-gray-900 dark:text-white">
            {user.nickname}
          </span>
          <button
            className="ml-2 bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
            onClick={onResetUserState}
          >
            Login
          </button>
        </div>
      ) : (
        <Link
          className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded"
          href="/user"
        >
          Login
        </Link>
      )}
    </nav>
  );
}
