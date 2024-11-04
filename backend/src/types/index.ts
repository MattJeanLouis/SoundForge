import { Prisma } from '@prisma/client';

// User types
export type User = Prisma.UserGetPayload<{
  include: {
    tracks: true;
    studioItems: {
      include: {
        studioItem: true;
      };
    };
  };
}>;

// Track types
export type Track = Prisma.TrackGetPayload<{
  include: {
    user: true;
    boosts: true;
    eventParticipations: {
      include: {
        event: true;
      };
    };
  };
}>;

// Event types
export type GameEvent = Prisma.GameEventGetPayload<{
  include: {
    participations: {
      include: {
        user: true;
        track: true;
      };
    };
  };
}>;

// Studio types
export type StudioItem = Prisma.StudioItemGetPayload<{}>;
export type UserStudioItem = Prisma.UserStudioItemGetPayload<{
  include: {
    studioItem: true;
  };
}>;

// Transaction types
export type Transaction = Prisma.TransactionGetPayload<{
  include: {
    user: true;
  };
}>;

export interface TransactionSummary {
  [key: string]: {
    count: number;
    total: number;
  };
}

export interface TransactionTotals {
  earnings: number;
  spending: number;
}

// Request body types
export interface CreateEventBody {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  requiredGenres: string[];
  requiredMoods: string[];
  rewardAmount: number;
}

export interface PurchaseStudioItemBody {
  userId: string;
  studioItemId: string;
}

export interface CreateBoostBody {
  senderId: string;
  amount: number;
  duration: number;
}

export interface JoinEventBody {
  userId: string;
  trackId: string;
}

// Response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface UserStudioResponse {
  items: UserStudioItem[];
  totalBonus: number;
}

export interface TransactionSummaryResponse {
  timeframe: string;
  summary: TransactionSummary;
  totals: TransactionTotals;
  transactionCount: number;
}

// Error types
export interface AppErrorResponse {
  status: 'error';
  message: string;
}
