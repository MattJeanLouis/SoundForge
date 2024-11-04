import { Link } from 'react-router-dom';
import { ArrowTrendingUpIcon, MusicalNoteIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useGameStore } from '../store/gameStore';

export default function Dashboard() {
  const { user, events, loading, error } = useGameStore(state => ({
    user: state.user,
    events: state.events,
    loading: state.loading,
    error: state.error,
  }));

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <SparklesIcon className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Loading game data...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <h3 className="text-sm font-medium text-red-800">Error loading game data</h3>
        <div className="mt-2 text-sm text-red-700">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">No user data available</h3>
      </div>
    );
  }

  const stats = [
    {
      name: 'Portfolio Value',
      value: user.tracks.reduce((sum, track) => sum + track.currentValue, 0).toLocaleString(),
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: ArrowTrendingUpIcon,
    },
    {
      name: 'Active Tracks',
      value: user.tracks.length.toString(),
      change: `+${user.tracks.filter(t => t.trending).length}`,
      changeType: 'increase' as const,
      icon: MusicalNoteIcon,
    },
    {
      name: 'Event Rewards',
      value: '2,340',
      change: '+18.2%',
      changeType: 'increase' as const,
      icon: SparklesIcon,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8 sm:px-8 sm:py-12">
        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Welcome back, {user.username}!
          </h2>
          <p className="mt-2 max-w-xl text-lg text-primary-100">
            Your music empire awaits. Check out the latest events and boost your tracks to earn more rewards.
          </p>
          <div className="mt-6 space-x-4">
            <Link
              to="/studio"
              className="inline-flex items-center rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
            >
              Visit Studio
              <SparklesIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
            >
              View Events
              <ArrowTrendingUpIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-6 py-5 shadow-sm ring-1 ring-gray-900/5"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-600 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Active Events */}
      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
        <div className="border-b border-gray-200 px-6 py-5">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Active Events</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {events.filter(event => event.status === 'active').map(event => (
            <div key={event.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{event.name}</h4>
                  <p className="text-sm text-gray-500">{event.description}</p>
                </div>
                <Link
                  to={`/events`}
                  className="rounded-md bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-100"
                >
                  Join Now
                </Link>
              </div>
            </div>
          ))}
          {events.filter(event => event.status === 'active').length === 0 && (
            <div className="px-6 py-4">
              <p className="text-sm text-gray-500">No active events at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
        <div className="border-b border-gray-200 px-6 py-5">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {user.tracks
            .filter(track => track.trending)
            .map(track => (
              <div key={track.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{track.title}</h4>
                    <p className="text-sm text-gray-500">
                      Current value: {track.currentValue.toLocaleString()} ₳
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Trending
                  </span>
                </div>
              </div>
            ))}
          {user.tracks.filter(track => track.trending).length === 0 && (
            <div className="px-6 py-4">
              <p className="text-sm text-gray-500">No recent activity to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
