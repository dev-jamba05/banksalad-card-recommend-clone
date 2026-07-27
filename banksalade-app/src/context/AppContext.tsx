'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { AppState, AppAction, AppNotification, User } from '@/types';

const MOCK_USER: User = {
  id: '1',
  name: '김뱅샐',
  email: 'bangsalade@email.com',
  phone: '010-1234-5678',
  membership: 'Premium Member',
  notifications: { email: true, sms: true, push: false, marketing: false },
};

const initialState: AppState = {
  auth: { user: null, isAuthenticated: false, isLoading: true },
  notifications: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, auth: { user: action.payload, isAuthenticated: true, isLoading: false } };
    case 'LOGOUT':
      return { ...state, auth: { user: null, isAuthenticated: false, isLoading: false } };
    case 'SET_LOADING':
      return { ...state, auth: { ...state.auth, isLoading: action.payload } };
    case 'UPDATE_USER':
      return {
        ...state,
        auth: { ...state.auth, user: state.auth.user ? { ...state.auth.user, ...action.payload } : null },
      };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter((n) => n.id !== action.payload) };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  notify: (type: AppNotification['type'], message: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('bs_user') : null;
    if (saved) {
      try {
        dispatch({ type: 'LOGIN', payload: JSON.parse(saved) });
      } catch {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    await new Promise((r) => setTimeout(r, 1000));
    if (email && password.length >= 6) {
      const user = { ...MOCK_USER, email };
      localStorage.setItem('bs_user', JSON.stringify(user));
      dispatch({ type: 'LOGIN', payload: user });
      return true;
    }
    dispatch({ type: 'SET_LOADING', payload: false });
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('bs_user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: data });
    if (state.auth.user) {
      const updated = { ...state.auth.user, ...data };
      localStorage.setItem('bs_user', JSON.stringify(updated));
    }
  }, [state.auth.user]);

  const notify = useCallback((type: AppNotification['type'], message: string) => {
    const id = Date.now().toString();
    dispatch({ type: 'ADD_NOTIFICATION', payload: { id, type, message } });
    setTimeout(() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }), 4000);
  }, []);

  return (
    <AppContext.Provider value={{ state, login, logout, updateUser, notify }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
