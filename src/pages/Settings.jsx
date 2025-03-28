import React, { useState, useEffect } from "react";
import { useAudio } from "../context/AudioContext";
import BackButton from "../components/BackButton";
import { usePlayerData } from "../hooks/usePlayerData";

function Settings() {
  const { preferences, setPreferences } = usePlayerData();
  const { setVolume } = useAudio();

  const [tempVolume, setTempVolume] = useState(preferences.volume ?? 0.5);

  useEffect(() => {
    if (preferences?.volume !== undefined) {
      setTempVolume(preferences.volume);
    }
  }, [preferences.volume]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setTempVolume(newVolume);
    setVolume(newVolume);
  };

  const commitVolume = () => {
    setPreferences((prev) => ({
      ...prev,
      volume: tempVolume,
    }));
  };

  return (
    <div className="settings-page">
      <BackButton />
      <h2>Settings</h2>

      <label htmlFor="volume">Volume: {Math.round(tempVolume * 100)}%</label>
      <input
        id="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={tempVolume}
        onChange={handleVolumeChange}
        onMouseUp={commitVolume}
        onTouchEnd={commitVolume}
      />
    </div>
  );
}

export default Settings;
