export interface Fortune {
  id: number;
  text: string;
  category: 'love' | 'luck' | 'work' | 'health';
  luckLevel: number;
  luckyColor: string;
}

export interface HistoryItem {
  id: string;
  fortuneId: number;
  text: string;
  category: Fortune['category'];
  luckLevel: number;
  luckyColor: string;
  stamp: string;
  stampColor: string;
  date: string;
  reaction: 'good' | 'bad' | null;
  memo: string;
}
