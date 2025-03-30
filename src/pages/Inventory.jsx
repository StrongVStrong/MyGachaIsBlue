import React, {useEffect, useRef, useState } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import "./Inventory.css";
import characterList from "../data/characters";
import { useSyncedAudio } from "../hooks/useSyncedAudio";
import { useClickSFX } from "../hooks/useClickSFX";

function Inventory() {
  const playClick = useClickSFX();
  const navigate = useNavigate();
  const { characters } = usePlayerData();
  const audioRef = useRef(null);
  const OST = `${import.meta.env.BASE_URL}assets/inventory.mp3`;
  useSyncedAudio(audioRef, OST);

  const ownedIds = new Set(Object.keys(characters).map(Number));

  const owned = characterList.filter((char) => ownedIds.has(char.id));
  const unowned = characterList.filter((char) => !ownedIds.has(char.id));
  const sortedList = [...owned, ...unowned];

  return (
    <div className="inventory-container">
      <title>Inventory</title>
      <BackButton />
      <h1 className = "inv-title">Characters</h1>

      <div className="character-grid">
        {sortedList.map((char) => {
          const isOwned = ownedIds.has(char.id);

          return (
            <div key={char.id} className={`portrait ${isOwned ? "owned" : "unowned"} type-${char.type}`}>
              <img src={`./assets/characterPortraits/${char.id}.png`} alt={char.name} onClick={() => {playClick(); navigate(`/character/${char.id}`)}}/>
            </div>
          );
        })}

        <audio ref={audioRef} loop autoPlay>
          <source src={OST} type="audio/mp3" />
        </audio>

      </div>
    </div>
  );
}

export default Inventory;
