import React, { useState, useRef } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import characters from "../data/characters";
import { useNavigate } from "react-router-dom";
import { useClickSFX } from "../hooks/useClickSFX";
import styles from "./TeamPresets.module.css";
import BackButton from "../components/BackButton";
import { useSyncedAudio } from "../hooks/useSyncedAudio";
import { useLocation } from "react-router-dom";

function TeamPresets() {
    const { preferences, setPreferences, characters: ownedCharacters } = usePlayerData();
    const playClick = useClickSFX();
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const OST = `${import.meta.env.BASE_URL}assets/teams.mp3`;
    useSyncedAudio(audioRef, OST);

    const [selectedTeamId, setSelectedTeamId] = useState(1);
    const [activeSlot, setActiveSlot] = useState(null);
    const teams = preferences.teams ?? { 1: [], 2: [], 3: [], 4: [], 5: [] };
    const currentTeam = teams[selectedTeamId] ?? [];
    const [draggedSlot, setDraggedSlot] = useState(null);
    const [draggedCharId, setDraggedCharId] = useState(null);
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const returnToBattle = params.get("returnTo") === "battle";
    const stageId = params.get("stageId");
    const [showEmptyTeamPopup, setShowEmptyTeamPopup] = useState(false);
  
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

    const owned = getOwnedCharacters();
    const failSFX = new Audio("./assets/sfx/failure.mp3");
  
    return (
      <div className={styles["team-presets-page"]}>
        <BackButton />
        <h1 className={styles["team-presets-title"]}>🛠️ Teams</h1>
  
        <div className={styles["team-button-row"]}>
          {[1, 2, 3, 4, 5].map(num => (
            <button
              key={num}
              onClick={() => {
                playClick();
                setSelectedTeamId(num);
                localStorage.setItem("selectedTeamId", num);
                setActiveSlot(null);
              }}
              className={`${styles["team-button"]} ${selectedTeamId === num ? styles["active"] : ""}`}
            >
              Team {num}
            </button>
          ))}
        </div>

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
              draggable={charId !== undefined}
              onDragStart={(e) => {
                setDraggedSlot(idx);
                setDraggedCharId(charId);
                e.dataTransfer.setDragImage(new Image(), 0, 0); // disable default ghost image
              }}
              onDrag={(e) => {
                setDragPosition({ x: e.clientX, y: e.clientY });
              }}
              onDragEnd={() => {
                setDraggedSlot(null);
                setDraggedCharId(null);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedSlot === null || draggedSlot === idx) return;
                const newTeam = [...currentTeam];
                const temp = newTeam[draggedSlot];
                newTeam[draggedSlot] = newTeam[idx];
                newTeam[idx] = temp;
                const filteredTeam = newTeam.filter(Boolean).slice(0, 6);
                setPreferences(prev => ({
                  ...prev,
                  teams: { ...teams, [selectedTeamId]: filteredTeam }
                }));
                playClick();
                setDraggedSlot(null);
                setActiveSlot(null);
              }}
              onClick={() => {
                playClick();
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
          <button
            className={styles["close-button"]}
            onClick={() => {
              playClick();
              setActiveSlot(null);
            }}
          >
            ✖
          </button>
          <h3 className={styles["selector-title"]}>Select Character</h3>

          {getOwnedCharacters().length === 0 ? (
            <div className={styles["empty-message"]}>
              <p>No characters! 🎲 Summon to get characters!</p>
              <button
                onClick={() => {
                  playClick();
                  navigate("/summon");
                }}
                className={styles["summon-button"]}
              >
                ➕ Go to Summon
              </button>
            </div>
          ) : (
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
          )}
        </div>
      )}

      <audio ref={audioRef} loop autoPlay>
        <source src={OST} type="audio/mp3" />
      </audio>
      {returnToBattle && (
        <button
          className={styles["play-button"]}
          onClick={() => {
            if ((teams[selectedTeamId] ?? []).filter(Boolean).length === 0) {
              failSFX.volume = 1;
              failSFX.play();
              setShowEmptyTeamPopup(true);
              return;
            }
            playClick();
            localStorage.setItem("selectedTeamId", selectedTeamId);
            navigate(`/battle/${stageId}?team=${selectedTeamId}`);
          }}
        >
          ▶
        </button>
      )}
      {showEmptyTeamPopup && (
        <div className={styles["team-popup-overlay"]}>
          <div className={styles["team-popup-box"]}>
            <h2>⚠️ Team Empty</h2>
            <p>Please add at least one character before continuing.</p>
            <button
              className={styles["team-popup-ok-button"]}
              onClick={() => {
                playClick();
                setShowEmptyTeamPopup(false);
              }}
            >
              OK
            </button>
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