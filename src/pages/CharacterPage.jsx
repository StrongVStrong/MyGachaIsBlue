import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import characterList from "../data/characters";
import BackButton from "../components/BackButton";
import { usePlayerData } from "../hooks/usePlayerData";
import "./CharacterPage.css";
import { rerollTrait } from "../utils/RerollTraits";

function CharacterPage() {
  const { id } = useParams();
  const charId = parseInt(id, 10);
  const character = characterList.find((char) => char.id === charId);
  const { characters, setCharacters } = usePlayerData();
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const [glowRarity, setGlowRarity] = useState(null);
  const rerollBtnRef = useRef(null);
  const godlyTraits = ["Ultra Instinct", "Enlightened"];


  if (!character) return <div>Character not found</div>;

  useEffect(() => {
    if (character) {
      document.title = character.name;
    }
  }, [character]);

  const charData = characters[charId];
  const isOwned = !!charData;

  const handleRerollTrait = () => {
    if (!isOwned) return;
    const currentTrait = charData.trait;

    if (godlyTraits.includes(currentTrait)) {
        const confirm = window.confirm(
        `⚠️ ${currentTrait} is a godly trait!\nAre you sure you want to reroll it?`
        );
        if (!confirm) return;
    }
    const { name, rarity } = rerollTrait(currentTrait);
  
    if (rerollBtnRef.current) {
        rerollBtnRef.current.classList.remove(`${glowRarity}-glow`);
        void rerollBtnRef.current.offsetWidth;
        rerollBtnRef.current.classList.add(`${rarity}-glow`);
      }
      
      setGlowRarity(rarity);
  
    setCharacters((prev) => ({
      ...prev,
      [charId]: {
        ...prev[charId],
        trait: name,
      },
    }));
  };
  

  const handleLimitBreak = () => {
    if (!isOwned || charData.count <= 1 || charData.limitBreak >= 5) return;
    setCharacters((prev) => ({
      ...prev,
      [charId]: {
        ...prev[charId],
        count: prev[charId].count - 1,
        limitBreak: prev[charId].limitBreak + 1,
      },
    }));
  };

  return (
    <div className={`character-page bg-${character.rarity}`}>
      
      <div className={`character-portrait-section bg-${character.rarity}`}>
      <BackButton />
      
      <img
        src={`../assets/characterPortraits/${character.id}.png`}
        alt={character.name}
        className={`${
            isOwned ? "" : "dimmed"
          } border-${character.type}`}
      />
      </div>

      <div className="character-details">
        
        <h1>{character.name}</h1>
        {isOwned ? (
            <>
                <p>Rarity: {capitalize(character.rarity)}</p>
                <p>Power: {character.power}</p>
                <p>Type: {capitalize(character.type)}</p>
                <p>⭐ Limit Break: {charData.limitBreak} / 5</p>
                <p>🎲 Trait: {charData.trait ?? "None"}</p>
                <p>📦 Dupes: {charData.count - 1}</p>
                <button
                ref={rerollBtnRef}
                onClick={handleRerollTrait}
                className={`reroll-button ${glowRarity ? `${glowRarity}-glow` : ""}`}
                >
                🔁 Reroll Trait
                </button>
                <button
                onClick={handleLimitBreak}
                disabled={charData.limitBreak >= 5 || charData.count <= 1}
                >
                ⭐ Limit Break
                </button>
            </>
            ) : (
            <>
                <div className="unowned-text">
                <p>Rarity: {capitalize(character.rarity)}</p>
                <p>Power: {character.power}</p>
                <p>Type: {capitalize(character.type)}</p>
                <p>⭐ Limit Break: 0 / 5</p>
                <p>🎲 Trait: None </p>
                <p>📦 Dupes: 0 </p>
                </div>
                <p className="locked-msg">You don't own this character yet!</p>
            </>
            )}
        </div>
    </div>
  );
}

export default CharacterPage;
