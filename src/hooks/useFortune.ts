import { useCallback, useState } from 'react';
import fortunesData from '../data/fortunes.json';
import type { Fortune } from '../types';

const STORAGE_KEY = 'fortune-drawn-ids';
const MAX_HISTORY = 30;

function getDrawnIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDrawnIds(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(-MAX_HISTORY)));
}

export function useFortune() {
  const [current, setCurrent] = useState<Fortune | null>(null);

  const draw = useCallback(() => {
    const drawnIds = getDrawnIds();
    const available = (fortunesData as Fortune[]).filter(f => !drawnIds.includes(f.id));

    const pool = available.length > 0 ? available : (fortunesData as Fortune[]);
    if (pool.length === 0) return;

    const fortune = pool[Math.floor(Math.random() * pool.length)];

    if (available.length > 0) {
      drawnIds.push(fortune.id);
      saveDrawnIds(drawnIds);
    } else {
      // 모두 뽑힌 경우 초기화
      saveDrawnIds([fortune.id]);
    }

    setCurrent(fortune);
  }, []);

  return { current, draw };
}
