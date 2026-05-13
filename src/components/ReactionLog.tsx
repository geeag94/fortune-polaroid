import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Save } from 'lucide-react';
import type { HistoryItem } from '../types';

interface Props {
  item: HistoryItem | null;
  onReact: (reaction: 'good' | 'bad') => void;
  onMemo: (memo: string) => void;
}

export default function ReactionLog({ item, onReact, onMemo }: Props) {
  const [memo, setMemo] = useState(item?.memo || '');

  if (!item) return null;

  const handleSaveMemo = () => {
    onMemo(memo);
  };

  return (
    <div className="w-full max-w-[320px] mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
      <div className="flex items-center justify-center gap-4 mb-3">
        <button
          onClick={() => onReact('good')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
            item.reaction === 'good'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-white/5 text-neutral-300 hover:bg-white/10'
          }`}
        >
          <ThumbsUp size={16} />
          <span>좋아요</span>
        </button>
        <button
          onClick={() => onReact('bad')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
            item.reaction === 'bad'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-white/5 text-neutral-300 hover:bg-white/10'
          }`}
        >
          <ThumbsDown size={16} />
          <span>아쉬워요</span>
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={memo}
          onChange={e => setMemo(e.target.value.slice(0, 50))}
          placeholder="짧은 메모를 남겨보세요 (최대 50자)"
          className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
        />
        <button
          onClick={handleSaveMemo}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-white transition-colors"
          title="저장"
        >
          <Save size={16} />
        </button>
      </div>
      <div className="mt-1 text-right text-xs text-neutral-500">
        {memo.length}/50
      </div>
    </div>
  );
}
