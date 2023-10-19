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
    <div className="flex flex-1 flex-col justify-around items-center bg-gradient-to-bl from-indigo-900 via-indigo-400 to-indigo-900">
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
