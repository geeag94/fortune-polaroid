import { useState } from 'react';
import { X, Calendar, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import type { HistoryItem } from '../types';

interface Props {
  history: HistoryItem[];
}

const categoryLabels: Record<HistoryItem['category'], string> = {
  love: '인연',
  luck: '행운',
  work: '일',
  health: '건강',
};

export default function HistoryGallery({ history }: Props) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-white/10 backdrop-blur-md border border-white/10 text-white px-4 py-3 rounded-full shadow-lg hover:bg-white/20 transition-colors flex items-center gap-2"
      >
        <Calendar size={18} />
        <span className="text-sm">히스토리 ({history.length})</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-white/10 rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-white text-lg font-medium">나의 운세 히스토리</h3>
          <button
            onClick={() => setOpen(false)}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-3">
          {history.length === 0 && (
            <p className="text-neutral-500 text-center py-8">아직 기록된 운세가 없습니다.</p>
          )}
          {history.map(item => (
            <div
              key={item.id}
              className="bg-white/5 rounded-lg p-3 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white text-sm leading-relaxed">{item.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-neutral-400">{item.date}</span>
                    <span className="text-xs text-neutral-500">{categoryLabels[item.category]} · Lv.{item.luckLevel}</span>
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.stampColor }}
                    />
                  </div>
                </div>
              </div>

              {(item.reaction || item.memo) && (
                <div className="flex items-center gap-3 pt-1 border-t border-white/5">
                  {item.reaction === 'good' && (
                    <span className="flex items-center gap-1 text-green-400 text-xs">
                      <ThumbsUp size={12} /> 좋았어요
                    </span>
                  )}
                  {item.reaction === 'bad' && (
                    <span className="flex items-center gap-1 text-red-400 text-xs">
                      <ThumbsDown size={12} /> 아쉬웠어요
                    </span>
                  )}
                  {item.memo && (
                    <span className="flex items-center gap-1 text-neutral-300 text-xs">
                      <MessageSquare size={12} /> {item.memo}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
