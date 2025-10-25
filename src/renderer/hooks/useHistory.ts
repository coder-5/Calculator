import { useState, useEffect } from 'react';
import { HistoryEntry } from '../../shared/types';
import { storage } from '../utils/storage';

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => storage.getHistory());

  useEffect(() => {
    storage.setHistory(history);
  }, [history]);

  const addEntry = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    setHistory((prev) => {
      const updated = [newEntry, ...prev];
      return updated.slice(0, 100); // Keep only last 100
    });
  };

  const clearHistory = () => {
    setHistory([]);
    storage.clearHistory();
  };

  const deleteEntry = (id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  };

  return {
    history,
    addEntry,
    clearHistory,
    deleteEntry,
  };
}
