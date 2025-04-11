import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import characterList from "../data/characters";
import BackButton from "../components/BackButton";
import { usePlayerData } from "../hooks/usePlayerData";
import characterDetails from "../data/characterDetails"
import "./CharacterPage.css";
import { rerollTrait } from "../utils/RerollTraits";
import { useClickSFX } from "../hooks/useClickSFX";

function CharacterPage() {
  const playClick = useClickSFX();
  const { id } = useParams();
  const charId = parseInt(id, 10);
  const character = characterList.find((char) => char.id === charId);
  const { characters, setCharacters, currency, setCurrency, preferences } = usePlayerData();
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const [glowRarity, setGlowRarity] = useState(null);
  const rerollBtnRef = useRef(null);
  const godlyTraits = ["Ultra Instinct", "Enlightened"];
  const audioRef = useRef(null);
  const [showInfo, setShowInfo] = useState(false);
  const [activeInfo, setActiveInfo] = useState(null);

  if (!character) return <div>Character not found</div>;

  useEffect(() => {
    if (character) {
      document.title = character.name;
    }
  }, [character]);

  useEffect(() => {
    if (!character) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }
  
    const isDev = import.meta.env.DEV;
    const timestamp = isDev ? `?v=${Date.now()}` : "";
    const track = (character.music || `./assets/OSTs/${character.id}.mp3`) + timestamp;

    const newAudio = new Audio(track);
    audioRef.current = newAudio;
    newAudio.loop = true;
    newAudio.volume = preferences.volume ?? 0.5;
    newAudio.play();

    return () => {
      newAudio.pause();
      newAudio.currentTime = 0;
    };
  }, [character, preferences.volume]);

  const charData = characters[charId];
  const isOwned = !!charData;
  const failSFX = new Audio("./assets/sfx/failure.mp3");

  const handleRerollTrait = () => {
    if (!isOwned) return;

    if (currency.traitRerolls <= 0) {
      failSFX.volume = 1;
      failSFX.play();
      alert("❌ You don't have any Trait Reroll tokens!");
      return;
    }

    const currentTrait = charData.trait;

    if (godlyTraits.includes(currentTrait)) {
        const confirm = window.confirm(
        `⚠️ ${currentTrait} is a godly trait!\nAre you sure you want to reroll it?`
        );
        if (!confirm) return;
    }
    const { name, rarity } = rerollTrait(currentTrait);

    const rerollSFX = new Audio(
      rarity === "godly" 
        ? "./assets/sfx/godly.mp3" 
        : "./assets/sfx/reroll.mp3"
    );
    rerollSFX.volume = 1;
    rerollSFX.play();
  
    if (rerollBtnRef.current) {
        rerollBtnRef.current.classList.remove(`${glowRarity}-glow`);
        void rerollBtnRef.current.offsetWidth;
        rerollBtnRef.current.classList.add(`${rarity}-glow`);
      }
      
    setGlowRarity(rarity);

    setCurrency((prev) => ({
      ...prev,
      traitRerolls: prev.traitRerolls - 1,
    }));
  
    setCharacters((prev) => ({
      ...prev,
      [charId]: {
        ...prev[charId],
        trait: name,
      },
    }));
  };
  

  const handleLimitBreak = () => {
    if (!isOwned) return;

    if (charData.count <= 1) {
      failSFX.volume = 1;
      failSFX.play();
      alert("📦 You need a dupe to Limit Break!");
      return;
    }
    
    setCharacters((prev) => ({
      ...prev,
      [charId]: {
        ...prev[charId],
        count: prev[charId].count - 1,
        limitBreak: prev[charId].limitBreak + 1,
      },
    }));
  };

  const InfoPopup = ({ title, text, onClose }) => (
    <div className="info-popup-overlay" onClick={onClose}>
      <div className="info-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>✖</button>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );  

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
        
      <div className="name-row">
        <h1>{character.name}</h1>
        <button
          className="info-button"
          onClick={() => {
            playClick();
            setShowInfo(true);
          }}
          title="Character Info"
        >
          ⓘ
        </button>
      </div>

        {isOwned ? (
            <>
                <p>
                  <button className="emoji-btn" onClick={() => setActiveInfo("details")}>💫</button> {character.details}
                </p>
                <p>
                  <button className="emoji-btn" onClick={() => setActiveInfo("super")}>☄️</button> {character.super}
                </p>
                <p>
                  <button className="emoji-btn" onClick={() => setActiveInfo("limit")}>⭐</button> Limit Break: {charData.limitBreak} / 5
                </p>
                <p>
                  <button className="emoji-btn" onClick={() => setActiveInfo("trait")}>🎲</button> Trait: {charData.trait ?? "None"}
                </p>
                <p>
                  <button className="emoji-btn" onClick={() => setActiveInfo("dupes")}>📦</button> Dupes: {charData.count - 1}
                </p>

                <button
                ref={rerollBtnRef}
                onClick={() => {handleRerollTrait();}}
                className={`reroll-button ${glowRarity ? `${glowRarity}-glow` : ""}`}
                >
                🔁 Reroll Trait ({currency.traitRerolls})
                </button>
                <button
                onClick={handleLimitBreak}
                disabled={charData.limitBreak >= 5}
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
            {showInfo && (
              <div className="info-popup-overlay" onClick={() => setShowInfo(false)}>
                <div className="info-popup" onClick={(e) => e.stopPropagation()}>
                  <button className="close-button" onClick={() => setShowInfo(false)}>✖</button>
                  <p><strong>Rarity:</strong> {capitalize(character.rarity)}</p>
                  <p><strong>Type:</strong> {capitalize(character.type)}</p>
                  <p><strong>HP:</strong> {characterDetails[charId]?.baseHp.toLocaleString()}</p>
                  <p><strong>ATK:</strong> {characterDetails[charId]?.baseAtk.toLocaleString()}</p>
                  <p><strong>DEF:</strong> {characterDetails[charId]?.baseDef.toLocaleString()}</p>
                </div>
              </div>
            )}
            {activeInfo && (
              <InfoPopup
                title={
                  activeInfo === "details" ? "Passive Skill"
                  : activeInfo === "super" ? "Super Attack"
                  : activeInfo === "limit" ? "Limit Break"
                  : activeInfo === "trait" ? "Traits"
                  : "Dupes"
                }
                text={
                  activeInfo === "details"
                    ? characterDetails[charId]?.passives
                        ?.map(p => p.description)
                        .filter(Boolean)
                        .join("\n")
                    : activeInfo === "super"
                    ? `${character.super.split(" - ")[0]} deals damage and ${character.super.split(" - ")[1]}.`
                    : activeInfo === "limit"
                    ? "Limit Break increases a character's power by consuming duplicates."
                    : activeInfo === "trait"
                    ? "Traits grant special bonuses like evasion, critical chance, or boosts."
                    : "Dupes are extra copies of a character. You can use them for Limit Breaks."
                }
                onClose={() => setActiveInfo(null)}
              />
            )}
        </div>
    </div>
  );
}

export default CharacterPage;
