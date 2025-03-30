import { useCallback } from "react";

const clickSound = new Audio("./assets/sfx/click.mp3");

export function useClickSFX() {
  return useCallback(() => {
    clickSound.currentTime = 0;
    clickSound.play();
  }, []);
}
