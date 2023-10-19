'use client';

import Spinner from '@/components/Spinner';
import { StatsTable } from '@/components/StatsTable';
import { useEffect, useState } from 'react';

export default function About() {
  const [stats, setStats] = useState([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const fetchStaticticsData = () => {
    return fetch('/api/stats').then((res) => res.json());
  };

  useEffect(() => {
    fetchStaticticsData().then((res) => {
      setStats(res.data);
      setIsStatsLoading(false);
    });
  }, []);

  return (
    <div className="h-screen pt-20 flex flex-col justify-around items-center bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-rose-900 via-amber-800 to-rose-400">
      {/* about description */}
      <div className="flex flex-col justify-center items-center px-4">
        <h1 className="text-2xl font-bold dark:text-white text-center">
          About
        </h1>
        <p className="text-center">
          Battle Ships is a classic game for two players, also known as Sea
          Battle or Battleship. Each player has a fleet of ships of different
          lengths placed on a grid. The goal is to sink the opponent`s fleet.
        </p>
      </div>
      <StatsTable stats={stats} />
      <br />
      {isStatsLoading && <Spinner />}
    </div>
  );
}
