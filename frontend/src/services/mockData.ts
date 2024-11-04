import { create } from 'zustand';

// Base64 placeholder images
const SUMMER_TRACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzBlYTVlOTtzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNkOTQ2ZWY7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9InVybCgjZ3JhZDEpIi8+PC9zdmc+';
const MIDNIGHT_TRACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFlMjkzYjtzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0MzM4Y2E7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9InVybCgjZ3JhZDEpIi8+PC9zdmc+';
const PROFILE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIxMDAiIGZpbGw9IiMwZWE1ZTkiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI4MCIgcj0iNDAiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNDAsIDE4MCBRMTAwLDEyMCAxNjAsMTgwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==';

export interface User {
  id: string;
  username: string;
  level: number;
  experience: number;
  infosargent: number;
  tracks: Track[];
}

export interface Track {
  id: string;
  title: string;
  artwork: string;
  genre: string[];
  mood: string[];
  baseValue: number;
  currentValue: number;
  boostCount: number;
  playCount: number;
  trending: boolean;
}

export interface StudioItem {
  id: string;
  name: string;
  description: string;
  price: number;
  bonusMultiplier: number;
  imageUrl: string;
  owned: boolean;
}

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  requiredGenres: string[];
  requiredMoods: string[];
  rewardAmount: number;
  participantCount: number;
  status: 'upcoming' | 'active' | 'completed';
  type: 'competition' | 'challenge' | 'festival';
}

export const mockUser: User = {
  id: '1',
  username: 'MusicMaster',
  level: 12,
  experience: 2400,
  infosargent: 5000,
  tracks: [
    {
      id: '1',
      title: 'Summer Vibes',
      artwork: SUMMER_TRACK_IMAGE,
      genre: ['Electronic', 'Pop'],
      mood: ['Happy', 'Energetic'],
      baseValue: 1000,
      currentValue: 1200,
      boostCount: 5,
      playCount: 1234,
      trending: true,
    },
    {
      id: '2',
      title: 'Midnight Dreams',
      artwork: MIDNIGHT_TRACK_IMAGE,
      genre: ['Lo-fi', 'Ambient'],
      mood: ['Calm', 'Relaxing'],
      baseValue: 800,
      currentValue: 850,
      boostCount: 2,
      playCount: 567,
      trending: false,
    },
  ],
};

export const mockStudioItems: StudioItem[] = [
  {
    id: '1',
    name: 'Pro Microphone',
    description: 'High-quality condenser microphone for crystal clear recordings',
    price: 1000,
    bonusMultiplier: 1.2,
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMwZWE1ZTkiLz48L3N2Zz4=',
    owned: true,
  },
  {
    id: '2',
    name: 'MIDI Controller',
    description: 'Professional grade MIDI keyboard for enhanced music production',
    price: 2000,
    bonusMultiplier: 1.3,
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNkOTQ2ZWYiLz48L3N2Zz4=',
    owned: false,
  },
  {
    id: '3',
    name: 'Studio Monitors',
    description: 'Premium studio monitors for accurate sound reproduction',
    price: 3000,
    bonusMultiplier: 1.4,
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiM0MzM4Y2EiLz48L3N2Zz4=',
    owned: false,
  },
];

export const mockEvents: GameEvent[] = [
  {
    id: '1',
    name: 'Summer Beats Festival',
    description: 'Create the ultimate summer anthem and compete for massive rewards!',
    startDate: '2024-06-01',
    endDate: '2024-06-14',
    requiredGenres: ['Electronic', 'Pop'],
    requiredMoods: ['Happy', 'Energetic'],
    rewardAmount: 5000,
    participantCount: 128,
    status: 'active',
    type: 'festival',
  },
  {
    id: '2',
    name: 'Lo-fi Challenge',
    description: 'Show your skills in creating the perfect lo-fi atmosphere',
    startDate: '2024-06-15',
    endDate: '2024-06-21',
    requiredGenres: ['Lo-fi', 'Ambient'],
    requiredMoods: ['Calm', 'Relaxing'],
    rewardAmount: 2500,
    participantCount: 64,
    status: 'upcoming',
    type: 'challenge',
  },
];

// Mock API functions
export const getMockUser = () => Promise.resolve(mockUser);
export const getMockStudioItems = () => Promise.resolve(mockStudioItems);
export const getMockEvents = () => Promise.resolve(mockEvents);

export const purchaseStudioItem = async (itemId: string) => {
  const item = mockStudioItems.find(i => i.id === itemId);
  if (!item) {
    throw new Error('Item not found');
  }
  if (mockUser.infosargent < item.price) {
    throw new Error('Insufficient funds');
  }
  return Promise.resolve({ ...item, owned: true });
};

export const boostTrack = async (trackId: string) => {
  const track = mockUser.tracks.find(t => t.id === trackId);
  if (!track) {
    throw new Error('Track not found');
  }
  return Promise.resolve({
    ...track,
    currentValue: track.currentValue * 1.1,
    boostCount: track.boostCount + 1,
  });
};

export const joinEvent = async (eventId: string, trackId: string) => {
  const event = mockEvents.find(e => e.id === eventId);
  if (!event) {
    throw new Error('Event not found');
  }
  if (event.status !== 'active') {
    throw new Error('Event is not active');
  }
  return Promise.resolve({
    eventId,
    trackId,
    joinedAt: new Date().toISOString(),
  });
};
