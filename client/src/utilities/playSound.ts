export function playSound(sound: HTMLAudioElement | null, volume: number = 1) {
  if (sound) {
    sound.currentTime = 0; // Reset the audio to start
    sound.volume = volume; // Set the volume
    sound.play().catch((error) => console.error("Error playing sound:", error));
  }
}

export function playDelayedSound(
  sound: HTMLAudioElement | null,
  delayMs: number,
  volume: number = 1
) {
  setTimeout(() => playSound(sound, volume), delayMs);
}
