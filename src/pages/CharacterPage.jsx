import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import characterList from "../data/characters";
import BackButton from "../components/BackButton";
import { usePlayerData } from "../hooks/usePlayerData";
import characterDetails from "../data/characterDetails"
import "./CharacterPage.css";
import { rerollTrait, traitPool, traitEffects } from "../utils/RerollTraits";
import { useClickSFX } from "../hooks/useClickSFX";

const TraitsPopup = ({ onClose }) => {
  
  const allTraits = Object.entries(traitPool).flatMap(([rarity, traits]) => {

    if (rarity === 'godly') {
      return traits.map(traitObj => ({
        name: traitObj.name,
        rarity,
        ...traitEffects[traitObj.name]
      }));
    }

    return traits.map(traitName => ({
      name: traitName,
      rarity,
      ...traitEffects[traitName]
    }));
  });

  return (
    <div className="info-popup-overlay" onClick={onClose}>
      <div className="info-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>✖</button>
        <h3>All Traits</h3>
        <div className="trait-grid">
          {allTraits.map((trait, index) => (
            <div key={index} className={`trait-box ${trait.rarity}`}>
              <strong>{trait.name}</strong>
              <p>{trait.description}</p>
              <div className="trait-stats">
                <span>
                  {(() => {
                    const rarityPercent = {
                      common: 50,
                      rare: 40,
                      legendary: 9,
                      godly: 1,
                    };

                    if (trait.rarity !== "godly") {
                      const count = traitPool[trait.rarity]?.length ?? 1;
                      return (rarityPercent[trait.rarity] / count).toFixed(2) + "%";
                    }

                    const godlyTrait = traitPool.godly.find(t => t.name === trait.name);
                    if (godlyTrait?.rate != null) {
                      return (godlyTrait.rate * rarityPercent.godly).toFixed(2) + "%";
                    }

                    const dynamicCount = traitPool.godly.filter(t => t.rate === null).length;
                    const fixedSum = traitPool.godly
                      .filter(t => t.rate !== null)
                      .reduce((sum, t) => sum + t.rate, 0);
                    const leftover = 1 - fixedSum;
                    const dynamicRate = leftover / dynamicCount;
                    return (dynamicRate * rarityPercent.godly).toFixed(2) + "%";
                  })()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
function CharacterPage() {
  const playClick = useClickSFX();
  const { id } = useParams();
  const charId = parseInt(id, 10);
  const character = characterList.find((char) => char.id === charId);
  const { characters, setCharacters, currency, setCurrency, preferences } = usePlayerData();
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const [glowRarity, setGlowRarity] = useState(null);
  const rerollBtnRef = useRef(null);
  const godlyTraits = ["Ultra Instinct", "Enlightened", "Beast", "Divine"];
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

  const InfoPopup = ({ title, text, onClose }) => {
    const [showTraits, setShowTraits] = useState(false);
    const playClick = useClickSFX();
  
    return (
      <>
        <div className="info-popup-overlay" onClick={onClose}>
          <div className="info-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={onClose}>✖</button>
            {title === "Trait" && (
              <button 
                className="info-button left" 
                onClick={(e) => {
                  e.stopPropagation();
                  playClick();
                  setShowTraits(true);
                }}
                title="View All Traits"
              >
                ℹ️
              </button>
            )}
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </div>
        
        {showTraits && <TraitsPopup onClose={() => setShowTraits(false)} />}
      </>
    );
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
          ℹ️
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
                  <p>
                    <button className="emoji-btn" onClick={() => setActiveInfo("details")}>💫</button> {character.details}
                  </p>
                  <p>
                    <button className="emoji-btn" onClick={() => setActiveInfo("super")}>☄️</button> {character.super}
                  </p>
                  <p>
                    <button className="emoji-btn" onClick={() => setActiveInfo("limit")}>⭐</button> Limit Break: 0 / 5
                  </p>
                  <p>
                    <button className="emoji-btn" onClick={() => setActiveInfo("trait")}>🎲</button> Trait: None
                  </p>
                  <p>
                    <button className="emoji-btn" onClick={() => setActiveInfo("dupes")}>📦</button> Dupes: 0
                  </p>
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
                  {isOwned ? (
                    <>
                      <p>
                        <strong>HP:</strong>{" "}
                        {(characterDetails[charId]?.baseHp + charData.limitBreak * 500).toLocaleString()}{" "}
                        {charData.limitBreak > 0 && (
                          <span style={{ color: "limegreen" }}>
                            (+{(charData.limitBreak * 500).toLocaleString()})
                          </span>
                        )}
                      </p>
                      <p>
                        <strong>ATK:</strong>{" "}
                        {(characterDetails[charId]?.baseAtk + charData.limitBreak * 500).toLocaleString()}{" "}
                        {charData.limitBreak > 0 && (
                          <span style={{ color: "limegreen" }}>
                            (+{(charData.limitBreak * 500).toLocaleString()})
                          </span>
                        )}
                      </p>
                      <p>
                        <strong>DEF:</strong>{" "}
                        {(characterDetails[charId]?.baseDef + charData.limitBreak * 500).toLocaleString()}{" "}
                        {charData.limitBreak > 0 && (
                          <span style={{ color: "limegreen" }}>
                            (+{(charData.limitBreak * 500).toLocaleString()})
                          </span>
                        )}
                      </p>
                    </>
                  ) : (
                    // Unowned characters
                    <>
                      <p><strong>HP:</strong> {characterDetails[charId]?.baseHp.toLocaleString()}</p>
                      <p><strong>ATK:</strong> {characterDetails[charId]?.baseAtk.toLocaleString()}</p>
                      <p><strong>DEF:</strong> {characterDetails[charId]?.baseDef.toLocaleString()}</p>
                    </>
                  )}
                </div>
              </div>
            )}
            {activeInfo && (
              <InfoPopup
                title={
                  activeInfo === "details" ? "Passive Skill"
                  : activeInfo === "super" ? "Super Attack"
                  : activeInfo === "limit" ? "Limit Break"
                  : activeInfo === "trait" ? "Trait"
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
                    ? "Limit Break increases stats by consuming duplicates (500 per dupe)."
                    : activeInfo === "trait"
                    ? charData?.trait
                    ? traitEffects[charData.trait]?.description || "No description available for this trait."
                    : "Traits can massively power up your units through attack, crit, evade, and other buffs!"
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
