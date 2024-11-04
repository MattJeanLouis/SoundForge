import { useEffect, useState } from 'react';
import { CalendarIcon, TrophyIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useGameStore } from '../store/gameStore';
import { Track } from '../services/mockData';

export default function Events() {
  const { user, events, loading, error, initializeGame, joinEvent } = useGameStore();
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [joiningEvent, setJoiningEvent] = useState<string | null>(null);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <ClockIcon className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Loading events...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <h3 className="text-sm font-medium text-red-800">Error loading events</h3>
        <div className="mt-2 text-sm text-red-700">{error}</div>
      </div>
    );
  }

  if (!user || !events) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">No event data available</h3>
      </div>
    );
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'competition':
        return TrophyIcon;
      case 'challenge':
        return ClockIcon;
      case 'festival':
        return UserGroupIcon;
      default:
        return CalendarIcon;
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    if (!selectedTrack) {
      return;
    }

    setJoiningEvent(eventId);
    try {
      await joinEvent(eventId, selectedTrack);
      setSelectedTrack(null);
    } catch (error) {
      console.error('Failed to join event:', error);
    } finally {
      setJoiningEvent(null);
    }
  };

  const isTrackEligible = (track: Track, event: typeof events[0]) => {
    const hasRequiredGenre = event.requiredGenres.some(genre => 
      track.genre.includes(genre)
    );
    const hasRequiredMood = event.requiredMoods.some(mood => 
      track.mood.includes(mood)
    );
    return hasRequiredGenre && hasRequiredMood;
  };

  return (
    <div className="space-y-8">
      {/* Events Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8 sm:px-8 sm:py-12">
        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Game Events
          </h2>
          <p className="mt-2 max-w-xl text-lg text-primary-100">
            Participate in events to earn rewards and boost your reputation in the music world.
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="rounded-md bg-white/10 px-4 py-2">
              <p className="text-sm text-white">Active Events</p>
              <p className="text-xl font-bold text-white">
                {events.filter((e) => e.status === 'active').length}
              </p>
            </div>
            <div className="rounded-md bg-white/10 px-4 py-2">
              <p className="text-sm text-white">Total Rewards Available</p>
              <p className="text-xl font-bold text-white">
                {events.reduce((sum, event) => sum + event.rewardAmount, 0).toLocaleString()} ₳
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {events.map((event) => {
          const EventIcon = getEventTypeIcon(event.type);
          const eligibleTracks = user.tracks.filter(track => isTrackEligible(track, event));

          return (
            <div
              key={event.id}
              className={clsx(
                'event-card group relative overflow-hidden rounded-lg bg-white p-6 shadow-sm transition-all duration-300',
                event.status === 'active' && 'ring-2 ring-primary-500'
              )}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className={clsx(
                    'rounded-lg p-3',
                    event.status === 'active' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                  )}>
                    <EventIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                    <span
                      className={clsx(
                        'rounded-full px-2.5 py-0.5 text-xs font-medium',
                        {
                          'bg-green-100 text-green-800': event.status === 'active',
                          'bg-yellow-100 text-yellow-800': event.status === 'upcoming',
                          'bg-gray-100 text-gray-800': event.status === 'completed',
                        }
                      )}
                    >
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{event.description}</p>
                  
                  {/* Requirements and Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {event.requiredGenres.map((genre) => (
                      <span
                        key={genre}
                        className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700"
                      >
                        {genre}
                      </span>
                    ))}
                    {event.requiredMoods.map((mood) => (
                      <span
                        key={mood}
                        className="inline-flex items-center rounded-full bg-secondary-50 px-2.5 py-0.5 text-xs font-medium text-secondary-700"
                      >
                        {mood}
                      </span>
                    ))}
                  </div>

                  {/* Event Details */}
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="text-sm font-medium text-gray-900">{event.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="text-sm font-medium text-gray-900">{event.endDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Reward Pool</p>
                      <p className="text-sm font-medium text-gray-900">{event.rewardAmount.toLocaleString()} ₳</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Participants</p>
                      <p className="text-sm font-medium text-gray-900">{event.participantCount}</p>
                    </div>
                  </div>

                  {/* Track Selection and Join Button */}
                  {event.status === 'active' && (
                    <div className="mt-6 flex items-center gap-4">
                      <select
                        className="block w-full rounded-md border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
                        value={selectedTrack || ''}
                        onChange={(e) => setSelectedTrack(e.target.value)}
                      >
                        <option value="">Select a track</option>
                        {eligibleTracks.map((track) => (
                          <option key={track.id} value={track.id}>
                            {track.title}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className={clsx(
                          'inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold',
                          selectedTrack
                            ? 'bg-primary-600 text-white hover:bg-primary-500'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed',
                          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                        )}
                        onClick={() => handleJoinEvent(event.id)}
                        disabled={!selectedTrack || joiningEvent === event.id}
                      >
                        {joiningEvent === event.id ? 'Joining...' : 'Join Event'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Event History */}
      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
        <h3 className="text-lg font-semibold text-gray-900">Your Event History</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <p className="font-medium text-gray-900">Total Events Participated</p>
              <p className="text-sm text-gray-500">Across all seasons</p>
            </div>
            <div className="text-lg font-semibold text-primary-600">12</div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <p className="font-medium text-gray-900">Total Rewards Earned</p>
              <p className="text-sm text-gray-500">From event participation</p>
            </div>
            <div className="text-lg font-semibold text-primary-600">15,000 ₳</div>
          </div>
        </div>
      </div>
    </div>
  );
}
