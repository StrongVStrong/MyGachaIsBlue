import { useEffect } from "react";
import { useAudio } from "../context/AudioContext";

export const useSyncedAudio = (audioRef, source) => {
  const { volume } = useAudio();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !source) return;

    audio.volume = volume;
    audio.play().catch((error) => {
      console.warn("Audio playback blocked:", error);
    });
  }, [audioRef, source, volume]);
};
