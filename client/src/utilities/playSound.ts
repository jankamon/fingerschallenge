export default function playSound(sound: HTMLAudioElement | null) {
  if (sound) {
    sound.currentTime = 0; // Reset the audio to start
    sound.play().catch((error) => console.error("Error playing sound:", error));
  }
}
