const SOUND_PATH = '/sounds/polaroid.wav';

export function playPolaroidSound() {
  try {
    const audio = new Audio(SOUND_PATH);
    audio.volume = 0.9;
    audio.play().catch(() => {
      // ignore autoplay errors
    });
  } catch {
    // ignore audio errors
  }
}
