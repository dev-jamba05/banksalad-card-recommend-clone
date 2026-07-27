export interface Transaction {
  id: number;
  date: string;
  name: string;
  amount: number;
  category: string;
  icon: string;
  status?: 'completed' | 'pending';
}

export interface CardBenefit {
  category: string;
  desc: string;
}

export interface RecommendedCard {
  id: string;
  name: string;
  saving: number;
  benefits: CardBenefit[];
  color: string;
  isBest?: boolean;
  apr?: number;
  annualFee?: number;
  cashbackRate?: number;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membership: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
}

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppState {
  auth: AuthState;
  notifications: AppNotification[];
}

export type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_USER'; payload: Partial<User> };
