import { Suspense } from 'react';
import Navbar from '../components/Navbar';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// open graph meta tags
export const metadata = {
  title: 'Battleship',
  description: 'Ships battle like a table game but in your browser',
  siteUrl: 'https://ships-battle.vercel.app/',
  image: 'https://ships-battle.vercel.app/battleship.png',
  type: 'website',
  keyworkds: 'battleship, game, ships, table game',
  locale: 'en_US',
  twitter: {
    card: 'Ships battle like a table game but in your browser',
    title: 'BattleShip',
    description: 'Ships battle like a table game but in your browser',
    creator: '@shev4enko_v',
    images: ['https://twitter.com/@shev4enko_v'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col min-h-screen overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        <header>
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
          </Suspense>
        </header>
        <div className="flex flex-1 flex-col min-w-min text-slate-50">
          {children}
        </div>
      </body>
    </html>
  );
}
