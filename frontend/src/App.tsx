import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Studio from './pages/Studio';
import Tracks from './pages/Tracks';
import Events from './pages/Events';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { useGameStore } from './store/gameStore';
import { SparklesIcon } from '@heroicons/react/24/outline';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppContent() {
  const { initializeGame, isAuthenticated, loading } = useGameStore(state => ({
    initializeGame: state.initializeGame,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
  }));

  useEffect(() => {
    if (isAuthenticated) {
      initializeGame();
    }
  }, [isAuthenticated, initializeGame]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <SparklesIcon className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Loading SoundForge...</h3>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route
          path="studio"
          element={
            <ProtectedRoute>
              <Studio />
            </ProtectedRoute>
          }
        />
        <Route
          path="tracks"
          element={
            <ProtectedRoute>
              <Tracks />
            </ProtectedRoute>
          }
        />
        <Route
          path="events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
