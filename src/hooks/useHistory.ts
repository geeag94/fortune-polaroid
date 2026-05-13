import { useCallback, useState } from 'react';
import type { HistoryItem } from '../types';

const STORAGE_KEY = 'fortune-history';

function getAll(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(items: HistoryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(getAll);

  const refresh = useCallback(() => {
    setHistory(getAll());
  }, []);

  const add = useCallback((item: HistoryItem) => {
    const all = getAll();
    all.unshift(item);
    saveAll(all);
    setHistory(all);
  }, []);

  const updateReaction = useCallback((id: string, reaction: 'good' | 'bad') => {
    const all = getAll();
    const idx = all.findIndex(i => i.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], reaction };
      saveAll(all);
      setHistory(all);
    }
  }, []);

  const updateMemo = useCallback((id: string, memo: string) => {
    const all = getAll();
    const idx = all.findIndex(i => i.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], memo };
      saveAll(all);
      setHistory(all);
    }
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, refresh, add, updateReaction, updateMemo, clear };
}
