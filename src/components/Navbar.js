'use client';

import { Avatar, Button, Navbar } from 'flowbite-react';
import { useUser } from '@/hooks/useUser';
import { DarkThemeToggle, Flowbite, Label } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Divider } from './Divider';

export default function HeaderNavbar() {
  const { user, onResetUserState } = useUser();
  let initialThemeMode = false;
  if (typeof window !== 'undefined') {
    // Client-side-only code
    initialThemeMode =
      window?.matchMedia &&
      window?.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  const [isDarkMode, setIsDarkMode] = useState(initialThemeMode);

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

  useEffect(() => {
    // listener dor theme change
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        setIsDarkMode(true);
      } else {
        setIsDarkMode(false);
      }
    };
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <Flowbite theme={{ dark: isDarkMode }}>
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
          <div className="flex items-center">
            <Navbar.Link href="/about" className="border-0">
              About
            </Navbar.Link>

            <Divider />

            <Navbar.Link href="/user" className="border-0">
              {user ? (
                <div className="flex items-center">
                  {user.avatarUrl ? (
                    <Avatar rounded img={user.avatarUrl} />
                  ) : (
                    <Avatar rounded />
                  )}

                  <Label className="mx-2">{user.nickname}</Label>
                  <Button color="failure" onClick={onLogout} size="xs">
                    Logout
                  </Button>
                </div>
              ) : (
                'Login'
              )}
            </Navbar.Link>
            <Divider />
            <DarkThemeToggle />
          </div>
        </Navbar.Collapse>
      </Navbar>
    </Flowbite>
  );
}
