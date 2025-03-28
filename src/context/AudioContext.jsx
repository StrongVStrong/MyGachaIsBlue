import React, { createContext, useContext, useState, useEffect } from "react";
import { usePlayerData } from "../hooks/usePlayerData";

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const { preferences } = usePlayerData();
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        if (preferences?.volume !== undefined) {
          setVolume(preferences.volume);
        }
      }, [preferences]);

  return (
    <AudioContext.Provider value={{ volume, setVolume }}>
      {children}
    </AudioContext.Provider>
  );
};