const BASE_URL = import.meta.env.BASE_URL || '/';
const SOUND_PATH = `${BASE_URL}sounds/polaroid.wav`;

let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;

export async function playPolaroidSound() {
  try {
    // AudioContext 생성 (없으면)
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // iOS/Android에서 suspended 상태면 반드시 resume (await!)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // 오디오 버퍼가 없으면 fetch & decode
    if (!audioBuffer) {
      const response = await fetch(SOUND_PATH);
      if (!response.ok) {
        console.warn('Sound file not found:', SOUND_PATH);
        return;
      }
      const arrayBuffer = await response.arrayBuffer();
      audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    }

    // 재생
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.9;

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);
  } catch (err) {
    console.warn('Web Audio failed:', err);

    // 최후의 fallback: HTML5 Audio 태그
    try {
      const audio = new Audio(SOUND_PATH);
      audio.volume = 0.9;
      await audio.play();
    } catch {
      // ignore
    }
  }
}
