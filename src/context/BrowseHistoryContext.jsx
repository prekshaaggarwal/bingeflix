import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const BrowseHistoryContext = createContext();

const STORAGE_KEY = 'bingeflix_browse_history';

export function BrowseHistoryProvider({ children }) {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      setHistory(all[user.id] || []);
    } else {
      setHistory([]);
    }
  }, [user]);

  const addToHistory = useCallback((movie) => {
    if (!user) return;
    setHistory(prev => {
      const filtered = prev.filter(m => m.id !== movie.id);
      const next = [movie, ...filtered].slice(0, 20);
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      all[user.id] = next;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return next;
    });
  }, [user]);

  return (
    <BrowseHistoryContext.Provider value={{ history, addToHistory }}>
      {children}
    </BrowseHistoryContext.Provider>
  );
}

export const useBrowseHistory = () => useContext(BrowseHistoryContext);
