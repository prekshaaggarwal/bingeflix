import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const UserStatsContext = createContext();

const STORAGE_KEY = 'bingeflix_stats';

function getStoredStats(userId) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return all[userId] || {
    watched: [],
    myList: [],
    totalWatchTime: 0,
    lastWatchedAt: null,
  };
}

function saveStats(userId, stats) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  all[userId] = stats;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function UserStatsProvider({ children }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ watched: [], myList: [], totalWatchTime: 0, lastWatchedAt: null });

  useEffect(() => {
    if (user) {
      setStats(getStoredStats(user.id));
    } else {
      setStats({ watched: [], myList: [], totalWatchTime: 0, lastWatchedAt: null });
    }
  }, [user]);

  const persist = useCallback((newStats) => {
    if (user) saveStats(user.id, newStats);
  }, [user]);

  const markWatched = useCallback((movie) => {
    setStats(prev => {
      if (prev.watched.find(m => m.id === movie.id)) return prev;
      const now = new Date();
      const next = {
        ...prev,
        watched: [...prev.watched, { ...movie, watchedAt: now.toISOString() }],
        totalWatchTime: prev.totalWatchTime + (movie.duration || 120),
        lastWatchedAt: now.toISOString(),
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const toggleMyList = useCallback((movie) => {
    setStats(prev => {
      const exists = prev.myList.find(m => m.id === movie.id);
      const next = {
        ...prev,
        myList: exists
          ? prev.myList.filter(m => m.id !== movie.id)
          : [...prev.myList, movie],
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const isInMyList = useCallback((movieId) => {
    return stats.myList.some(m => m.id === movieId);
  }, [stats.myList]);

  const isWatched = useCallback((movieId) => {
    return stats.watched.some(m => m.id === movieId);
  }, [stats.watched]);

  const getFavoriteGenre = useCallback(() => {
    const genreCounts = {};
    stats.watched.forEach(m => {
      genreCounts[m.genre] = (genreCounts[m.genre] || 0) + 1;
    });
    let maxGenre = null, maxCount = 0;
    Object.entries(genreCounts).forEach(([genre, count]) => {
      if (count > maxCount) { maxGenre = genre; maxCount = count; }
    });
    return maxGenre;
  }, [stats.watched]);

  const getBadges = useCallback(() => {
    const badges = [];
    if (stats.watched.length >= 5) badges.push({ id: 'binger', name: 'Weekend Binger', icon: '🍿', desc: 'Watched 5+ movies' });
    if (stats.watched.length >= 10) badges.push({ id: 'addict', name: 'Screen Addict', icon: '📺', desc: 'Watched 10+ movies' });

    const hasNightWatch = stats.watched.some(m => {
      const h = new Date(m.watchedAt).getHours();
      return h >= 22 || h < 5;
    });
    if (hasNightWatch) badges.push({ id: 'nightowl', name: 'Night Owl', icon: '🦉', desc: 'Watched a movie late at night' });

    const genreCounts = {};
    stats.watched.forEach(m => { genreCounts[m.genre] = (genreCounts[m.genre] || 0) + 1; });
    const hasGenreMaster = Object.values(genreCounts).some(c => c >= 3);
    if (hasGenreMaster) badges.push({ id: 'genremaster', name: 'Genre Master', icon: '🎭', desc: '3+ movies in one genre' });

    if (stats.totalWatchTime >= 600) badges.push({ id: 'marathon', name: 'Marathon Runner', icon: '🏃', desc: '10+ hours of watch time' });

    return badges;
  }, [stats.watched, stats.totalWatchTime]);

  return (
    <UserStatsContext.Provider value={{
      stats, markWatched, toggleMyList, isInMyList, isWatched, getFavoriteGenre, getBadges,
    }}>
      {children}
    </UserStatsContext.Provider>
  );
}

export const useUserStats = () => useContext(UserStatsContext);
