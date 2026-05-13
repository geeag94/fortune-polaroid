import { useCallback, useRef } from 'react';
import html2canvas from 'html2canvas';

export function usePolaroidCapture() {
  const captureRef = useRef<HTMLDivElement>(null);

  const capture = useCallback(async () => {
    if (!captureRef.current) return;
    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `fortune-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Capture failed', e);
    }
  }, []);

  return { captureRef, capture };
}
