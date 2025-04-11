import React, { useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SummonResults.css";
import characterList from "../data/characters";
import { usePlayerData } from "../hooks/usePlayerData";
import { useSyncedAudio } from "../hooks/useSyncedAudio";
import { useClickSFX } from "../hooks/useClickSFX";

function Results() {
  const playClick = useClickSFX();
  const { gems, isGuest } = usePlayerData();
  const navigate = useNavigate();
  const location = useLocation();
  const { summonedCharacters = [], selectedBanner, amountSummoned } = location.state || {};
  const audioRef = useRef(null);
  const OST = `${import.meta.env.BASE_URL}assets/results.mp3`;
  useSyncedAudio(audioRef, OST);
  const failSFX = new Audio("./assets/sfx/failure.mp3");

  useEffect(() => {
    if (isGuest && !sessionStorage.getItem("guestRefreshed")) {
      sessionStorage.setItem("guestRefreshed", "true");
      window.location.reload();
    }
  }, []);

  const isMulti = summonedCharacters.length > 1;

  // Lookup map from characterList
  const characterMap = characterList.reduce((acc, char) => {
    acc[char.id] = char;
    return acc;
  }, {});

  return (
    <div className="results-container">
      <h1 className="results-title">🎉 Summon Results 🎉</h1>

      {summonedCharacters.length > 0 ? (
        <div className={`results-grid ${isMulti ? "multi" : "single"}`}>
          {summonedCharacters.map((id, index) => {
            const char = characterMap[id];

            if (!char) return null; 

            return (
              <div key={index} className={`results-portrait rarity-${char.rarity || "Common"}`}>
                <img
                  src={`./assets/characterPortraits/${char.id}.png`}
                  alt={char.name}
                  className={`portrait-image type-${char.type}`}
                />
                <p className="char-name">{char.name}</p>
                <p className="char-power">{char.rarity}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="no-summons">No summons found. Try summoning again!</p>
      )}

      <button className="return-button" onClick={() => {playClick(); navigate("/summon", { state: { selectedBanner }});}}>
        Return to Summon
      </button>

      <button
        className="summon-again-button"
        onClick={() => {
          playClick();
          if (isGuest) sessionStorage.removeItem("guestRefreshed");
          const cost = amountSummoned === 1 ? 100 : 1000;
          if (gems < cost) {
            failSFX.volume = 1;
            failSFX.play();
            alert("Not enough gems to summon again!");
            return;
          }

          navigate("/summon", {
            state: {
              selectedBanner,
              amountSummoned,
              resummon: true
            },
          });
        }}
      >
        Summon Again ({amountSummoned === 10 ? "1000" : "100"} Gems)
      </button>

      <audio ref={audioRef} loop autoPlay>
        <source src={OST} type="audio/mp3" />
      </audio>
    </div>
  );
}

export default Results;
