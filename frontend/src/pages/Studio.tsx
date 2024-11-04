import { useEffect } from 'react';
import { SparklesIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useGameStore } from '../store/gameStore';

export default function Studio() {
  const { user, studioItems, loading, error, initializeGame, purchaseStudioItem } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <SparklesIcon className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Loading studio...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <h3 className="text-sm font-medium text-red-800">Error loading studio</h3>
        <div className="mt-2 text-sm text-red-700">{error}</div>
      </div>
    );
  }

  if (!user || !studioItems) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">No studio data available</h3>
      </div>
    );
  }

  const totalBonus = studioItems
    .filter(item => item.owned)
    .reduce((sum, item) => sum + (item.bonusMultiplier - 1) * 100, 0);

  const handlePurchase = async (itemId: string) => {
    try {
      await purchaseStudioItem(itemId);
    } catch (error) {
      console.error('Failed to purchase item:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Studio Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8 sm:px-8 sm:py-12">
        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Your Virtual Studio
          </h2>
          <p className="mt-2 max-w-xl text-lg text-primary-100">
            Upgrade your studio with powerful equipment to boost your music's performance.
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="rounded-md bg-white/10 px-4 py-2">
              <p className="text-sm text-white">Total Bonus</p>
              <p className="text-xl font-bold text-white">+{totalBonus.toFixed(1)}%</p>
            </div>
            <div className="rounded-md bg-white/10 px-4 py-2">
              <p className="text-sm text-white">Available Infosargent</p>
              <p className="text-xl font-bold text-white">{user.infosargent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Studio Items Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {studioItems.map((item) => (
          <div
            key={item.id}
            className={clsx(
              'studio-item group relative flex flex-col overflow-hidden rounded-lg bg-white p-6 shadow-sm ring-1',
              item.owned ? 'ring-primary-500' : 'ring-gray-900/5'
            )}
          >
            {item.owned && (
              <div className="absolute right-4 top-4">
                <SparklesIcon className="h-6 w-6 text-primary-500" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{item.description}</p>
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">Bonus:</span>
                <span className="text-sm text-primary-600">+{((item.bonusMultiplier - 1) * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="mt-6">
              {item.owned ? (
                <div className="inline-flex items-center rounded-md bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-600">
                  Owned
                </div>
              ) : (
                <button
                  type="button"
                  className={clsx(
                    'inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold',
                    user.infosargent >= item.price
                      ? 'bg-primary-600 text-white hover:bg-primary-500'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  )}
                  onClick={() => handlePurchase(item.id)}
                  disabled={user.infosargent < item.price}
                >
                  <PlusIcon className="mr-2 h-5 w-5" />
                  Purchase ({item.price.toLocaleString()} ₳)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Studio Effects */}
      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
        <h3 className="text-lg font-semibold text-gray-900">Studio Effects</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <p className="font-medium text-gray-900">Track Value Boost</p>
              <p className="text-sm text-gray-500">Increases the base value of all your tracks</p>
            </div>
            <div className="text-lg font-semibold text-primary-600">+{totalBonus.toFixed(1)}%</div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <p className="font-medium text-gray-900">Event Bonus</p>
              <p className="text-sm text-gray-500">Additional rewards from event participation</p>
            </div>
            <div className="text-lg font-semibold text-primary-600">+{(totalBonus * 0.75).toFixed(1)}%</div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <p className="font-medium text-gray-900">Collaboration Boost</p>
              <p className="text-sm text-gray-500">Enhanced effects when collaborating with others</p>
            </div>
            <div className="text-lg font-semibold text-primary-600">+{(totalBonus * 0.5).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
