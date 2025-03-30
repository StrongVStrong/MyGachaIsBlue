import React, { useState, useEffect, useRef } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import BackButton from "../components/BackButton";
import characterList from "../data/characters";
import "./UserProfile.css";

function UserProfile() {
  const {
    displayName,
    preferences,
    setPreferences,
    isGuest,
    setDisplayName,
    characters
  } = usePlayerData();
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    if (displayName) {
      setNameInput(displayName);
    }
  }, [displayName]);


  const handleNameChange = () => {
    if (isGuest) {
      alert("⚠️ You must be logged in to change your name!");
      return;
    }
    setDisplayName(nameInput);
  };

  const handleSelectFavorite = (charId) => {
    if (isGuest) {
      alert("⚠️ You must be logged in to select a favorite character!");
      return;
    }
    setPreferences((prev) => ({
      ...prev,
      favorite: charId,
    }));
  };

  const favoriteCharacter = characterList.find(
    (char) => char.id === preferences?.favorite
  );

  useEffect(() => {
    if (!favoriteCharacter) return;
  
    const isDev = import.meta.env.DEV;
    const timestamp = isDev ? `?v=${Date.now()}` : "";
    const track = (favoriteCharacter.music || `./assets/OSTs/${favoriteCharacter.id}.mp3`) + timestamp;
  
    if (audioRef.current) {
      audioRef.current.pause();
    }
  
    const newAudio = new Audio(track);
    audioRef.current = newAudio;
    newAudio.loop = true;
    newAudio.volume = preferences.volume ?? 0.5;
    newAudio.play();
  
    return () => {
      newAudio.pause();
      newAudio.currentTime = 0;
    };
  }, [favoriteCharacter, preferences.volume]);  

  return (
    <div className="profile-page">
      <BackButton />

      <div className="profile-left">
        <h2>Player Info</h2>
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Enter display name"
        />
        <button onClick={handleNameChange}>💾 Save Name</button>
      </div>

      <div className="profile-right">
        <div
        className={`favorite-portrait ${selectorVisible ? "selector-open" : ""}`}
        onClick={() => {
          if (isGuest) {
            alert("⚠️ You must be logged in to change your favorite character!");
            return;
          }
          setSelectorVisible(prev => !prev);
        }}
        style={{ cursor: "pointer" }}
        >
          {favoriteCharacter ? (
            <img
              src={`./assets/characterPortraits/${favoriteCharacter.id}.png`}
              alt={favoriteCharacter.name}
              className={`border-${favoriteCharacter.type}`}
            />
          ) : (
            <div className="empty-slot">+</div>
          )}
        </div>

        {selectorVisible && (
        <div className="favorite-selector">
          {Object.keys(characters).map((charId) => {
            const char = characterList.find((c) => c.id === Number(charId));
            if (!char) return null;
            return (
              <img
                key={char.id}
                src={`./assets/characterPortraits/${char.id}.png`}
                alt={char.name}
                onClick={() => {
                  handleSelectFavorite(char.id);
                  setSelectorVisible(false); // hide after selection
                }}
                className={`tiny-icon border-${char.type}`}
              />
            );
          })}
        </div>
      )}

      </div>
    </div>
  );
}

export default UserProfile;
