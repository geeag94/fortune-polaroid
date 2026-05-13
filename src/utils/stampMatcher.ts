import type { Fortune } from '../types';

const STAMPS = [
  'clover',    // 행운, 기회
  'star',      // 꿈, 희망
  'moon',      // 직관, 신비
  'sun',       // 활력, 긍정
  'key',       // 해결, 열림
  'diamond',   // 가치, 보석
  'heart',     // 사랑, 정서
  'lightning', // 변화, 에너지
  'book',      // 지혜, 학습
  'coffee',    // 여유, 대화
];

const STAMP_COLORS = [
  '#c0392b', // 빨강
  '#2980b9', // 파랑
  '#27ae60', // 초록
  '#f39c12', // 금색
  '#8e44ad', // 복숭아
  '#d35400', // 주황
  '#16a085', // 청록
  '#2c3e50', // 남색
  '#e74c3c', // 선홍
  '#9b59b6', // 복숭아
];

export function getStampForFortune(fortune: Fortune): { stamp: string; color: string } {
  // 카테고리에 따른 기본 스탬프 인덱스
  const categoryIndex: Record<Fortune['category'], number> = {
    love: 6,     // heart
    luck: 0,     // clover
    work: 8,     // book
    health: 3,   // sun
  };

  let index = categoryIndex[fortune.category];

  // luckLevel에 따라 오프셋 (더 높은 운세 = 더 빛나는 스탬프)
  index = (index + fortune.luckLevel) % STAMPS.length;

  // luckyColor 해시값으로 색상 결정 (일관성 있게)
  const colorIndex = fortune.luckyColor.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % STAMP_COLORS.length;

  return {
    stamp: STAMPS[index],
    color: STAMP_COLORS[colorIndex],
  };
}
