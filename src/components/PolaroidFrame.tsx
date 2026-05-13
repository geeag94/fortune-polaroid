import React from 'react';
import type { Fortune } from '../types';
import { getStampForFortune } from '../utils/stampMatcher';

interface Props {
  fortune: Fortune | null;
  isDeveloped: boolean;
}

const categoryLabels: Record<Fortune['category'], string> = {
  love: '인연',
  luck: '행운',
  work: '일',
  health: '건강',
};

const luckyColorMap: Record<string, string> = {
  '금색': '#f39c12',
  '빨강': '#e74c3c',
  '파랑': '#3498db',
  '초록': '#27ae60',
  '볼색': '#d8bfd8',
  '노랑': '#f1c40f',
  '분홍': '#ff69b4',
  '주황': '#e67e22',
  '하늘': '#87ceeb',
  '남색': '#2c3e50',
  '회색': '#95a5a6',
};

const PolaroidFrame = React.forwardRef<HTMLDivElement, Props>(
  ({ fortune, isDeveloped }, ref) => {
    const stamp = fortune ? getStampForFortune(fortune) : null;

    return (
      <div
        ref={ref}
        className="relative w-[320px] bg-polaroid-bg p-4 pb-8 shadow-2xl"
        style={{
          boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)',
          borderRadius: 2,
        }}
      >
        {/* 사진 영역 */}
        <div
          className="relative w-full aspect-square bg-neutral-900 overflow-hidden flex items-center justify-center"
          style={{ borderRadius: 1 }}
        >
          {fortune && (
            <div className="relative w-full h-full flex flex-col items-center justify-center px-6 text-center">
              {/* 검은 필름 오버레이 */}
              <div
                className="absolute inset-0 bg-black transition-opacity duration-[3000ms] ease-out z-10 pointer-events-none"
                style={{ opacity: isDeveloped ? 0 : 1 }}
              />

              {/* 운세 텍스트 - 줄바꿈 적용 */}
              <p
                className="text-white text-base leading-loose font-normal z-0 transition-all duration-[2000ms] ease-out break-keep"
                style={{
                  fontFamily: "'Gowun Batang', serif",
                  letterSpacing: '0.02em',
                  textWrap: 'balance',
                  filter: isDeveloped ? 'blur(0px)' : 'blur(10px)',
                  opacity: isDeveloped ? 1 : 0,
                  transform: isDeveloped ? 'scale(1)' : 'scale(0.96)',
                }}
              >
                {fortune.text}
              </p>

              {/* 부적 스탬프 */}
              {isDeveloped && stamp && (
                <StampIcon
                  stamp={stamp.stamp}
                  color={stamp.color}
                />
              )}
            </div>
          )}

          {!fortune && (
            <span className="text-neutral-500 text-sm tracking-widest">
              터치하여 촬영
            </span>
          )}
        </div>

        {/* 폴로라이드 하단 정보 */}
        <div className="mt-4 flex items-center justify-between px-1">
          <div className="text-vintage-ink text-xs tracking-wider opacity-70">
            {fortune ? new Date().toLocaleDateString('ko-KR') : 'ISO 800'}
          </div>
          {fortune && (
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: luckyColorMap[fortune.luckyColor] || '#000' }}
              />
              <span className="text-vintage-ink text-xs">
                {categoryLabels[fortune.category]} · Lv.{fortune.luckLevel}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

function StampIcon({ stamp, color }: { stamp: string; color: string }) {
  const paths: Record<string, string> = {
    clover: 'M12 2C12 2 14 4 14 6C14 8 12 10 12 10C12 10 10 8 10 6C10 4 12 2 12 2ZM6 10C6 10 8 12 10 12C12 12 14 10 14 10C14 10 12 8 10 8C8 8 6 10 6 10ZM18 10C18 10 16 8 14 8C12 8 10 10 10 10C10 10 12 12 14 12C16 12 18 10 18 10ZM12 14C12 14 10 16 10 18C10 20 12 22 12 22C12 22 14 20 14 18C14 16 12 14 12 14Z',
    star: 'M12 2L15 9L22 9L16 14L18 22L12 17L6 22L8 14L2 9L9 9Z',
    moon: 'M12 3C10 3 8 4 7 6C6 8 6 10 7 12C8 14 10 15 12 15C14 15 16 14 17 12C18 10 18 8 17 6C16 4 14 3 12 3ZM12 17C10 17 8 16 7 14',
    sun: 'M12 2V4M12 20V22M4 12H2M22 12H20M6.3 6.3L4.9 4.9M19.1 19.1L17.7 17.7M6.3 17.7L4.9 19.1M19.1 4.9L17.7 6.3M12 7C9.2 7 7 9.2 7 12C7 14.8 9.2 17 12 17C14.8 17 17 14.8 17 12C17 9.2 14.8 7 12 7Z',
    key: 'M8 14C8 14 6 12 6 10C6 8 8 6 10 6C12 6 14 8 14 10C14 12 12 14 12 14L18 20L16 22L10 16C10 16 10 18 8 18C6 18 4 16 4 14C4 12 6 10 6 10',
    diamond: 'M12 2L22 12L12 22L2 12Z',
    heart: 'M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z',
    lightning: 'M13 2L3 14H12L11 22L21 10H12L13 2Z',
    book: 'M4 19.5C4 18.1 5.1 17 6.5 17H20M4 19.5C4 20.9 5.1 22 6.5 22H20V2H6.5C5.1 2 4 3.1 4 4.5V19.5Z',
    coffee: 'M18 8H19C20.1 8 21 8.9 21 10V12C21 13.1 20.1 14 19 14H18M2 8H18V14C18 16.2 16.2 18 14 18H6C3.8 18 2 16.2 2 14V8ZM6 1V5M10 1V5M14 1V5',
  };

  const d = paths[stamp] || paths.clover;

  return (
    <div
      className="absolute bottom-4 right-4 z-20"
      style={{
        animation: 'stamp-in 0.6s ease-out forwards',
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter: `drop-shadow(0 1px 2px ${color}80)`,
          opacity: 0.9,
        }}
      >
        <path d={d} />
      </svg>
      <style>{`
        @keyframes stamp-in {
          0% { transform: scale(1.8) rotate(-12deg); opacity: 0; }
          60% { transform: scale(0.95) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}

export default PolaroidFrame;
