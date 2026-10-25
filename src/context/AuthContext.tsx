import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types/cricket';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (type: 'team' | 'player' | 'series', id: string) => Promise<void>;
  toggleReminder: (matchId: string) => Promise<void>;
  isFavorite: (type: 'team' | 'player' | 'series', id: string) => boolean;
  hasReminder: (matchId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt auto-login via HTTP-only cookie
    api.getCurrentUser()
      .then((res) => {
        if (res?.user) setUser(res.user);
      })
      .catch(() => {
        // Not logged in or guest
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    setUser(res.user);
  };

  const signup = async (email: string, pass: string, name: string) => {
    const res = await api.signup({ email, password: pass, name });
    setUser(res.user);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const [guestReminders, setGuestReminders] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('guest_reminders') || '[]');
    } catch {
      return [];
    }
  });

  const [guestFavTeams, setGuestFavTeams] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('guest_fav_team') || '[]');
    } catch {
      return [];
    }
  });

  const toggleFavorite = async (type: 'team' | 'player' | 'series', id: string) => {
    // 1. Always update local storage and guest state for instant UI responsiveness
    const guestKey = `guest_fav_${type}`;
    const saved: string[] = JSON.parse(localStorage.getItem(guestKey) || '[]');
    const set = new Set<string>(saved);
    if (set.has(id)) set.delete(id); else set.add(id);
    const updated: string[] = Array.from(set);
    localStorage.setItem(guestKey, JSON.stringify(updated));
    if (type === 'team') setGuestFavTeams(updated);

    // 2. If signed in, sync with backend
    if (user) {
      try {
        const res = await api.toggleFavorite(type, id);
        if (res && res.favoriteTeams) {
          setUser((prev) => prev ? {
            ...prev,
            favoriteTeams: res.favoriteTeams,
            favoritePlayers: res.favoritePlayers,
            favoriteSeries: res.favoriteSeries,
          } : null);
        }
      } catch (err: any) {
        // In case session expired or 401, smoothly fall back to local storage
        if (err?.message?.includes('Authentication') || err?.message?.includes('401')) {
          setUser(null);
        }
      }
    }
  };

  const toggleReminder = async (matchId: string) => {
    // 1. Always update local storage and reactive state
    const guestKey = 'guest_reminders';
    const saved: string[] = JSON.parse(localStorage.getItem(guestKey) || '[]');
    const set = new Set<string>(saved);
    if (set.has(matchId)) set.delete(matchId); else set.add(matchId);
    const updated: string[] = Array.from(set);
    localStorage.setItem(guestKey, JSON.stringify(updated));
    setGuestReminders(updated);

    // 2. If signed in, sync with backend
    if (user) {
      try {
        const res = await api.toggleReminder(matchId);
        if (res && res.reminders) {
          setUser((prev) => prev ? {
            ...prev,
            reminders: res.reminders,
          } : null);
        }
      } catch (err: any) {
        if (err?.message?.includes('Authentication') || err?.message?.includes('401')) {
          setUser(null);
        }
      }
    }
  };

  const isFavorite = (type: 'team' | 'player' | 'series', id: string): boolean => {
    if (user) {
      if (type === 'team' && user.favoriteTeams?.includes(id)) return true;
      if (type === 'player' && user.favoritePlayers?.includes(id)) return true;
      if (type === 'series' && user.favoriteSeries?.includes(id)) return true;
    }
    const guestKey = `guest_fav_${type}`;
    const saved = JSON.parse(localStorage.getItem(guestKey) || '[]');
    return saved.includes(id);
  };

  const hasReminder = (matchId: string): boolean => {
    if (user?.reminders?.includes(matchId)) return true;
    return guestReminders.includes(matchId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        toggleFavorite,
        toggleReminder,
        isFavorite,
        hasReminder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
