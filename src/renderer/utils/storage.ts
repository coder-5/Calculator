import { STORAGE_KEYS } from '../../shared/constants';
import { HistoryEntry, MemorySlot, Theme, CalculatorMode } from '../../shared/types';

export const storage = {
  // Theme
  getTheme(): Theme {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return (theme as Theme) || 'dark';
  },

  setTheme(theme: Theme): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // History
  getHistory(): HistoryEntry[] {
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!history) return [];

    try {
      const parsed = JSON.parse(history);
      return parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }));
    } catch {
      return [];
    }
  },

  setHistory(history: HistoryEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },

  addToHistory(entry: HistoryEntry): void {
    const history = this.getHistory();
    history.unshift(entry);
    // Keep only last 100 entries
    if (history.length > 100) {
      history.pop();
    }
    this.setHistory(history);
  },

  clearHistory(): void {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
  },

  // Memory
  getMemory(): MemorySlot[] {
    const memory = localStorage.getItem(STORAGE_KEYS.MEMORY);
    if (!memory) return [];

    try {
      return JSON.parse(memory);
    } catch {
      return [];
    }
  },

  setMemory(memory: MemorySlot[]): void {
    localStorage.setItem(STORAGE_KEYS.MEMORY, JSON.stringify(memory));
  },

  // Last Mode
  getLastMode(): CalculatorMode {
    const mode = localStorage.getItem(STORAGE_KEYS.LAST_MODE);
    return (mode as CalculatorMode) || 'basic';
  },

  setLastMode(mode: CalculatorMode): void {
    localStorage.setItem(STORAGE_KEYS.LAST_MODE, mode);
  },
};
