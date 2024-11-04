import { create } from 'zustand';
import { User, Track, StudioItem, GameEvent } from '../services/mockData';
import * as mockApi from '../services/mockData';
import AuthService from '../services/authService';

interface GameStore {
  // State
  user: User | null;
  studioItems: StudioItem[];
  events: GameEvent[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  initializeGame: () => Promise<void>;
  purchaseStudioItem: (itemId: string) => Promise<void>;
  boostTrack: (trackId: string) => Promise<void>;
  joinEvent: (eventId: string, trackId: string) => Promise<void>;
  clearError: () => void;
  setAuthToken: (token: string) => void;
  logout: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  user: null,
  studioItems: [],
  events: [],
  loading: false,
  error: null,
  isAuthenticated: AuthService.isAuthenticated(),

  initializeGame: async () => {
    set({ loading: true, error: null });
    try {
      const [user, studioItems, events] = await Promise.all([
        mockApi.getMockUser(),
        mockApi.getMockStudioItems(),
        mockApi.getMockEvents(),
      ]);
      set({ user, studioItems, events, loading: false });
    } catch (error) {
      set({ error: 'Failed to initialize game', loading: false });
    }
  },

  purchaseStudioItem: async (itemId: string) => {
    set({ loading: true, error: null });
    try {
      const purchasedItem = await mockApi.purchaseStudioItem(itemId);
      set(state => ({
        studioItems: state.studioItems.map(item =>
          item.id === itemId ? purchasedItem : item
        ),
        user: state.user
          ? {
              ...state.user,
              infosargent: state.user.infosargent - purchasedItem.price,
            }
          : null,
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to purchase item',
        loading: false,
      });
    }
  },

  boostTrack: async (trackId: string) => {
    set({ loading: true, error: null });
    try {
      const boostedTrack = await mockApi.boostTrack(trackId);
      set(state => ({
        user: state.user
          ? {
              ...state.user,
              tracks: state.user.tracks.map(track =>
                track.id === trackId ? boostedTrack : track
              ),
            }
          : null,
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to boost track',
        loading: false,
      });
    }
  },

  joinEvent: async (eventId: string, trackId: string) => {
    set({ loading: true, error: null });
    try {
      await mockApi.joinEvent(eventId, trackId);
      set(state => ({
        events: state.events.map(event =>
          event.id === eventId
            ? { ...event, participantCount: event.participantCount + 1 }
            : event
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to join event',
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),

  setAuthToken: (token: string) => {
    try {
      const parsedToken = JSON.parse(atob(token));
      AuthService.setToken(parsedToken);
      set({ isAuthenticated: true });
    } catch (error) {
      set({ error: 'Invalid authentication token' });
    }
  },

  logout: () => {
    AuthService.removeToken();
    set({ isAuthenticated: false, user: null });
  },
}));
