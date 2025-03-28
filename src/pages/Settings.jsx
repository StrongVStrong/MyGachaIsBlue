import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useAudio } from "../context/AudioContext";
import BackButton from "../components/BackButton";
import { usePlayerData } from "../hooks/usePlayerData";

function Settings() {
  const { preferences, setPreferences } = usePlayerData();
  const { setVolume } = useAudio();

  const [tempVolume, setTempVolume] = useState(null);

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

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem("guestMode");
    localStorage.removeItem("guestData");
    localStorage.removeItem("userData");
    window.location.href = "/login";
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

    <button onClick={handleLogout} className="logout-btn">
    🔓 Log Out
    </button>
    </div>
  );
}

export default Settings;
