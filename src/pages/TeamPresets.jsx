import React, { useState } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import characters from "../data/characters";
import { useNavigate } from "react-router-dom";
import { useClickSFX } from "../hooks/useClickSFX";
import styles from "./TeamPresets.module.css";
import BackButton from "../components/BackButton";

function TeamPresets() {
    const { preferences, setPreferences, characters: ownedCharacters } = usePlayerData();
    const playClick = useClickSFX();
    const navigate = useNavigate();
  
    const [selectedTeamId, setSelectedTeamId] = useState(1);
    const [activeSlot, setActiveSlot] = useState(null);
    const teams = preferences.teams ?? { 1: [], 2: [], 3: [], 4: [], 5: [] };
    const currentTeam = teams[selectedTeamId] ?? [];
  
    const handleCharacterSelect = (charId) => {
        if (activeSlot === null) return;
        
        const updatedTeam = [...currentTeam];
        const existingIndex = updatedTeam.findIndex(id => id === charId);
        
        if (updatedTeam[activeSlot] === charId) {
          updatedTeam[activeSlot] = null;
        } 

        else if (existingIndex >= 0) {
          const temp = updatedTeam[activeSlot];
          updatedTeam[activeSlot] = charId;
          updatedTeam[existingIndex] = temp;
        }

        else {
          updatedTeam[activeSlot] = charId;
        }

        const filteredTeam = updatedTeam.filter(Boolean).slice(0, 6);
        
        setPreferences(prev => ({
          ...prev,
          teams: { ...teams, [selectedTeamId]: filteredTeam }
        }));
        
        setActiveSlot(null);
        playClick();
    };

    const getOwnedCharacters = () => {
      return Object.keys(ownedCharacters).map(charId => {
        const id = Number(charId);
        return characters.find(c => c.id === id);
      }).filter(Boolean);
    };
  
    return (
      <div className={styles["team-presets-page"]}>
        <BackButton />
        <h1 className={styles["team-presets-title"]}>🛠️ Team Presets</h1>
  
        <div className={styles["team-button-row"]}>
          {[1, 2, 3, 4, 5].map(num => (
            <button
              key={num}
              onClick={() => {
                setSelectedTeamId(num);
                setActiveSlot(null);
              }}
              className={selectedTeamId === num ? 'active' : ''}
            >
              Team {num}
            </button>
          ))}
        </div>
  
        <h2 className={styles["section-title"]}>📋 Current Team:</h2>
        <div className={styles["team-row"]}>
          {[...Array(6)].map((_, idx) => {
            const charId = currentTeam[idx];
            const char = characters.find(c => c.id === charId);
            const slotStyle = {
              '--outline-color': char ? getTypeColor(char.type) : '#ffffff'
            };

            return (
              <div
                key={charId ? `${idx}-${charId}` : `empty-${idx}`}
                className={`${styles["portrait-slot"]} ${activeSlot === idx ? styles["active-slot"] : ""}`}
                onClick={() => {
                  if (activeSlot === idx) {
                    setActiveSlot(null);
                  } else {
                    setActiveSlot(idx);
                  }
                }}
                style={slotStyle}
              >
                {charId ? (
                  <img
                    src={`/assets/characterPortraits/${charId}.png`}
                    alt={char?.name}
                    className={`${styles["portrait-image"]} border-${char?.type ?? "neutral"}`}
                  />
                ) : (
                  <div className={styles["empty-slot"]}>+</div>
                )}
              </div>
            );
          })}
        </div>

        {activeSlot !== null && (
          <div className={styles["character-selector"]}>
            <h3 className={styles["selector-title"]}>Select Character</h3>
            <div className={styles["character-grid"]}>
              {getOwnedCharacters().map(char => (
                <img
                  key={char.id}
                  src={`/assets/characterPortraits/${char.id}.png`}
                  alt={char.name}
                  onClick={() => handleCharacterSelect(char.id)}
                  className={styles["selector-icon"]}
                  style={{
                    '--hover-color': getTypeColor(char.type),
                    borderColor: `var(--border-${char.type})`
                  }}
                  type={char.type}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
}

function getTypeColor(type) {
    const colors = {
      fire: '#ff4444',
      water: '#4488ff',
      grass: '#44ff44',
    };
    return colors[type] || colors.default;
}

export default TeamPresets;