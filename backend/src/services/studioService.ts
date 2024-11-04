interface StudioItem {
  id: string;
  name: string;
  type: 'equipment' | 'decoration';
  effect: string;
  cost: number;
}

const studioInventory: StudioItem[] = [];

export const addStudioItem = (name: string, type: 'equipment' | 'decoration', effect: string, cost: number): StudioItem => {
  const newItem: StudioItem = {
    id: generateUniqueId(),
    name,
    type,
    effect,
    cost,
  };
  studioInventory.push(newItem);
  return newItem;
};

export const getStudioItems = (): StudioItem[] => {
  return studioInventory;
};

const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
