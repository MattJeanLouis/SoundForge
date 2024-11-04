import { schedule } from 'node-cron';

interface GameState {
  infosargent: number;
  boosts: any[];
  positions: any[];
}

const gameState: GameState = {
  infosargent: 0,
  boosts: [],
  positions: [],
};

export const resetGameCycle = () => {
  gameState.infosargent = 0;
  gameState.boosts = [];
  gameState.positions = [];
  console.log('Game cycle has been reset.');
};

export const startGameCycle = () => {
  // Schedule the reset every 14 days
  schedule('0 0 */14 * *', () => {
    resetGameCycle();
  });
  console.log('Game cycle scheduling started.');
};
