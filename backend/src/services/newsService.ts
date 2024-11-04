interface NewsArticle {
  id: string;
  title: string;
  content: string;
  date: Date;
}

const newsFeed: NewsArticle[] = [];

export const createNewsArticle = (title: string, content: string): NewsArticle => {
  const newArticle: NewsArticle = {
    id: generateUniqueId(),
    title,
    content,
    date: new Date(),
  };
  newsFeed.push(newArticle);
  return newArticle;
};

export const getRecentNews = (limit: number = 5): NewsArticle[] => {
  return newsFeed.slice(-limit).reverse();
};

const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
