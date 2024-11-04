interface Card {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood: string;
  value: number;
  imageUrl: string;
  lastUpdated: Date;
}

const cards: Card[] = [];

export const createCard = (title: string, artist: string, genre: string, mood: string, imageUrl: string): Card => {
  const newCard: Card = {
    id: generateUniqueId(),
    title,
    artist,
    genre,
    mood,
    value: 0,
    imageUrl,
    lastUpdated: new Date(),
  };
  cards.push(newCard);
  return newCard;
};

export const updateCardValue = (cardId: string, newValue: number): void => {
  const card = cards.find(c => c.id === cardId);
  if (card) {
    card.value = newValue;
    card.lastUpdated = new Date();
  }
};

export const getCardById = (cardId: string): Card | undefined => {
  return cards.find(c => c.id === cardId);
};

const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
