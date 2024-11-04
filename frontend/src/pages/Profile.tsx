import { useEffect } from 'react';
import {
  TrophyIcon,
  StarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useGameStore } from '../store/gameStore';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: typeof StarIcon;
  progress: number;
  maxProgress: number;
  completed: boolean;
}

const achievements: Achievement[] = [
  {
    id: '1',
    name: 'Track Master',
    description: 'Create 10 tracks',
    icon: StarIcon,
    progress: 8,
    maxProgress: 10,
    completed: false,
  },
  {
    id: '2',
    name: 'Event Champion',
    description: 'Win 5 events',
    icon: TrophyIcon,
    progress: 3,
    maxProgress: 5,
    completed: false,
  },
  {
    id: '3',
    name: 'Boost Expert',
    description: 'Give 50 boosts',
    icon: SparklesIcon,
    progress: 45,
    maxProgress: 50,
    completed: false,
  },
];

export default function Profile() {
  const { user, loading, error, initializeGame } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <SparklesIcon className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Loading profile...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <h3 className="text-sm font-medium text-red-800">Error loading profile</h3>
        <div className="mt-2 text-sm text-red-700">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">No profile data available</h3>
      </div>
    );
  }

  const stats = {
    totalTracks: user.tracks.length,
    totalEvents: 8,
    totalBoosts: user.tracks.reduce((sum, track) => sum + track.boostCount, 0),
    totalEarnings: user.infosargent,
    level: user.level,
    experience: user.experience,
    nextLevelExperience: 3000,
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8 sm:px-8 sm:py-12">
        <div className="relative flex items-center gap-8">
          <div className="h-24 w-24 overflow-hidden rounded-full bg-white/10">
            <img
              src="/profile-placeholder.jpg"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {user.username}
            </h2>
            <p className="mt-2 text-lg text-primary-100">Level {stats.level} Producer</p>
            {/* Level Progress Bar */}
            <div className="mt-4 w-64">
              <div className="flex justify-between text-sm text-primary-100">
                <span>Level {stats.level}</span>
                <span>{Math.round((stats.experience / stats.nextLevelExperience) * 100)}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-primary-300"
                  style={{ width: `${(stats.experience / stats.nextLevelExperience) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
          <div className="flex items-center">
            <div className="rounded-md bg-primary-100 p-3">
              <ChartBarIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Tracks</h3>
              <p className="text-lg font-semibold text-gray-900">{stats.totalTracks}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
          <div className="flex items-center">
            <div className="rounded-md bg-primary-100 p-3">
              <TrophyIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Events Joined</h3>
              <p className="text-lg font-semibold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
          <div className="flex items-center">
            <div className="rounded-md bg-primary-100 p-3">
              <SparklesIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Boosts</h3>
              <p className="text-lg font-semibold text-gray-900">{stats.totalBoosts}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
          <div className="flex items-center">
            <div className="rounded-md bg-primary-100 p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
              <p className="text-lg font-semibold text-gray-900">{stats.totalEarnings.toLocaleString()} ₳</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
        <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
        <div className="mt-6 space-y-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={clsx(
                'rounded-lg p-4',
                achievement.completed ? 'bg-primary-50' : 'bg-gray-50'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={clsx(
                  'rounded-lg p-3',
                  achievement.completed ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                )}>
                  <achievement.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{achievement.name}</h4>
                    <span className="text-sm text-gray-500">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{achievement.description}</p>
                  <div className="mt-2">
                    <div className="h-2 rounded-full bg-gray-200">
                      <div
                        className={clsx(
                          'h-full rounded-full',
                          achievement.completed ? 'bg-primary-600' : 'bg-primary-400'
                        )}
                        style={{
                          width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <div className="mt-6 space-y-4">
          {user.tracks
            .filter(track => track.trending)
            .map(track => (
              <div key={track.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <div>
                  <p className="font-medium text-gray-900">{track.title} received a boost</p>
                  <p className="text-sm text-gray-500">Current value: {track.currentValue.toLocaleString()} ₳</p>
                </div>
                <span className="text-sm font-medium text-primary-600">Trending</span>
              </div>
            ))}
          {user.tracks.filter(track => track.trending).length === 0 && (
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">No recent activity to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
