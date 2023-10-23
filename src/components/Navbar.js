'use client';

import { Navbar } from 'flowbite-react';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';

export default function HeaderNavbar() {
  const { user, onResetUserState } = useUser();

  const onLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onResetUserState();
  };

  const customTheme = {
    base: 'sticky top-0 z-[60] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between w-full mx-auto py-2.5 px-4',
    inner: {
      base: 'mx-auto flex flex-wrap justify-between items-center w-full bg-slate-700',
    },
  };

  return (
    <Navbar fluid={true} theme={{ theme: customTheme }}>
      <Navbar.Brand href="/">
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            Battle Ships
          </span>{' '}
        </h1>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="/about">About</Navbar.Link>
        <Navbar.Link href="/user">
          {user ? (
            <div className="flex items-center">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  width={50}
                  height={50}
                  alt="user avatar"
                />
              ) : (
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
              )}

              <span className="ml-2 text-gray-900 dark:text-white">
                {user.nickname}
              </span>
              <button
                className="ml-2 bg-red-500 hover:bg-red-400 text-white font-bold px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            'Login'
          )}
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
