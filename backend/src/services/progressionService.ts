interface Player {
  id: string;
  name: string;
  level: number;
  experience: number;
  boosts: Boost[];
}

interface Boost {
  id: string;
  cardId: string;
  duration: number; // in hours
  effect: string;
}

const players: Player[] = [];

export const addPlayer = (name: string): Player => {
  const newPlayer: Player = {
    id: generateUniqueId(),
    name,
    level: 1,
    experience: 0,
    boosts: [],
  };
  players.push(newPlayer);
  return newPlayer;
};

export const addBoostToPlayer = (playerId: string, cardId: string, duration: number, effect: string): Boost | null => {
  const player = players.find(p => p.id === playerId);
  if (player) {
    const newBoost: Boost = {
      id: generateUniqueId(),
      cardId,
      duration,
      effect,
    };
    player.boosts.push(newBoost);
    return newBoost;
  }
  return null;
};

export const gainExperience = (playerId: string, exp: number): void => {
  const player = players.find(p => p.id === playerId);
  if (player) {
    player.experience += exp;
    if (player.experience >= player.level * 100) {
      player.level += 1;
      player.experience = 0;
    }
  }
};

const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
