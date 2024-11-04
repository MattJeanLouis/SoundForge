import { useEffect } from 'react';
import { ArrowTrendingUpIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useGameStore } from '../store/gameStore';

export default function Tracks() {
  const { user, loading, error, initializeGame, boostTrack } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <SparklesIcon className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Loading tracks...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <h3 className="text-sm font-medium text-red-800">Error loading tracks</h3>
        <div className="mt-2 text-sm text-red-700">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">No track data available</h3>
      </div>
    );
  }

  const handleBoost = async (trackId: string) => {
    try {
      await boostTrack(trackId);
    } catch (error) {
      console.error('Failed to boost track:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tracks Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8 sm:px-8 sm:py-12">
        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Your Music Collection
          </h2>
          <p className="mt-2 max-w-xl text-lg text-primary-100">
            Manage your tracks, boost their value, and participate in events to earn rewards.
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="rounded-md bg-white/10 px-4 py-2">
              <p className="text-sm text-white">Total Tracks</p>
              <p className="text-xl font-bold text-white">{user.tracks.length}</p>
            </div>
            <div className="rounded-md bg-white/10 px-4 py-2">
              <p className="text-sm text-white">Portfolio Value</p>
              <p className="text-xl font-bold text-white">
                {user.tracks.reduce((sum, track) => sum + track.currentValue, 0).toLocaleString()} ₳
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {user.tracks.map((track) => (
          <div
            key={track.id}
            className="music-card group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5"
          >
            {/* Track Artwork */}
            <div className="relative aspect-square overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <img
                src={track.artwork}
                alt={track.title}
                className="h-full w-full object-cover"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button className="rounded-full bg-white p-3 text-primary-600 shadow-lg hover:bg-primary-50">
                  <HeartIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Track Info */}
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{track.title}</h3>
                {track.trending && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    <ArrowTrendingUpIcon className="mr-1 h-4 w-4" />
                    Trending
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="mt-2 flex flex-wrap gap-2">
                {track.genre.map((g) => (
                  <span
                    key={g}
                    className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700"
                  >
                    {g}
                  </span>
                ))}
                {track.mood.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center rounded-full bg-secondary-50 px-2.5 py-0.5 text-xs font-medium text-secondary-700"
                  >
                    {m}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Current Value</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {track.currentValue.toLocaleString()} ₳
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Play Count</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {track.playCount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Boost Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handleBoost(track.id)}
                  className={clsx(
                    'inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-semibold',
                    'bg-primary-600 text-white hover:bg-primary-500',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                  )}
                >
                  <SparklesIcon className="mr-2 h-5 w-5" />
                  Boost Track ({track.boostCount})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Track Analytics */}
      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
        <h3 className="text-lg font-semibold text-gray-900">Track Performance</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <p className="font-medium text-gray-900">Average Track Value</p>
              <p className="text-sm text-gray-500">Based on your entire collection</p>
            </div>
            <div className="text-lg font-semibold text-primary-600">
              {Math.round(
                user.tracks.reduce((sum, track) => sum + track.currentValue, 0) / user.tracks.length
              ).toLocaleString()} ₳
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <p className="font-medium text-gray-900">Total Boosts</p>
              <p className="text-sm text-gray-500">Across all tracks</p>
            </div>
            <div className="text-lg font-semibold text-primary-600">
              {user.tracks.reduce((sum, track) => sum + track.boostCount, 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
