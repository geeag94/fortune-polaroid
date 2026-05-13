import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RotateCcw } from 'lucide-react';
import cameraImg from './assets/camera.png';
import PolaroidFrame from './components/PolaroidFrame';
import ReactionLog from './components/ReactionLog';
import HistoryGallery from './components/HistoryGallery';
import { useFortune } from './hooks/useFortune';
import { useHistory } from './hooks/useHistory';
import { usePolaroidCapture } from './hooks/usePolaroidCapture';
import { playPolaroidSound } from './utils/sound';
import { getStampForFortune } from './utils/stampMatcher';
import type { HistoryItem } from './types';

type Phase = 'idle' | 'ejecting' | 'exposing' | 'developed';

/* 사용자 이미지 기반 칸메라 UI */
function Camera636({ onClick, isPressed }: { onClick: () => void; isPressed: boolean }) {
  return (
    <motion.div
      className="cursor-pointer select-none"
      animate={{ scale: isPressed ? 0.97 : 1 }}
      transition={{ duration: 0.1 }}
      onClick={onClick}
    >
      <img
        src={cameraImg}
        alt="Polaroid 636 CloseUp"
        className="w-[720px] h-auto object-contain"
        style={{
          filter: isPressed
            ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            : 'drop-shadow(0 12px 30px rgba(0,0,0,0.5)) drop-shadow(0 4px 10px rgba(0,0,0,0.3))',
          transition: 'filter 0.1s ease',
        }}
        draggable={false}
      />
    </motion.div>
  );
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [isPressed, setIsPressed] = useState(false);
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);
  const { current, draw } = useFortune();
  const { history, add, updateReaction, updateMemo } = useHistory();
  const { captureRef, capture } = usePolaroidCapture();

  const handleClick = useCallback(() => {
    if (phase !== 'idle') return;

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    draw();
    playPolaroidSound();
    setPhase('ejecting');

    setTimeout(() => {
      setPhase('exposing');
    }, 800);

    setTimeout(() => {
      setPhase('developed');
    }, 3800);
  }, [phase, draw]);

  useEffect(() => {
    if (phase === 'developed' && current) {
      const stamp = getStampForFortune(current);
      const item: HistoryItem = {
        id: `${Date.now()}-${current.id}`,
        fortuneId: current.id,
        text: current.text,
        category: current.category,
        luckLevel: current.luckLevel,
        luckyColor: current.luckyColor,
        stamp: stamp.stamp,
        stampColor: stamp.color,
        date: new Date().toLocaleDateString('ko-KR'),
        reaction: null,
        memo: '',
      };
      setCurrentItem(item);
      add(item);
    }
  }, [phase, current, add]);

  const handleReset = () => {
    setPhase('idle');
    setCurrentItem(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-6 px-4 bg-neutral-900 text-white overflow-x-hidden">
      <header className="mb-4 text-center">
        <h1 className="text-4xl font-bold tracking-widest text-neutral-100 mb-1" style={{ fontFamily: "'Gowun Batang', serif" }}>
          Fortune Polaroid
        </h1>
        <p className="text-neutral-400 text-sm font-medium tracking-wide">
          카메라를 누르면 오늘의 운세가 인화됩니다
        </p>
      </header>

      <div className="flex flex-col items-center relative min-h-[520px]">
        <AnimatePresence mode="wait">
          {phase === 'idle' ? (
            <motion.div
              key="camera"
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -30 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="flex flex-col items-center"
            >
              <Camera636 onClick={handleClick} isPressed={isPressed} />
            </motion.div>
          ) : (
            <motion.div
              key="polaroid"
              initial={{ y: -60, opacity: 0, rotateX: 15 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 70,
                damping: 14,
                duration: 0.8,
              }}
              style={{ transformOrigin: 'top center', perspective: '1000px' }}
              className="z-10"
            >
              <PolaroidFrame
                ref={captureRef}
                fortune={current}
                isDeveloped={phase === 'developed'}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 단계별 안내/액션 */}
        <div className="mt-6 h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-neutral-400 text-sm"
              >
                카메라를 눌러 촬영하세요
              </motion.div>
            )}

            {phase === 'ejecting' && (
              <motion.div
                key="ejecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-neutral-300 text-sm"
              >
                필름 배출 중...
              </motion.div>
            )}

            {phase === 'exposing' && (
              <motion.div
                key="exposing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-neutral-300 text-sm"
              >
                현상 중...
              </motion.div>
            )}

            {phase === 'developed' && currentItem && (
              <motion.div
                key="developed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <button
                  onClick={capture}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                >
                  <Download size={16} />
                  저장하기
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                >
                  <RotateCcw size={16} />
                  다시 뽑기
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {phase === 'developed' && currentItem && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <ReactionLog
              item={currentItem}
              onReact={(reaction) => {
                updateReaction(currentItem.id, reaction);
                setCurrentItem(prev => prev ? { ...prev, reaction } : prev);
              }}
              onMemo={(memo) => {
                updateMemo(currentItem.id, memo);
                setCurrentItem(prev => prev ? { ...prev, memo } : prev);
              }}
            />
          </motion.div>
        )}
      </div>

      <HistoryGallery history={history} />
    </div>
  );
}
