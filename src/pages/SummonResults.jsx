import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SummonResults.css";
import characterList from "../data/characters";

function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const { summonedCharacters = [] } = location.state || {};

  const isMulti = summonedCharacters.length > 1;

  // Create a lookup map from characterList
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
              <div key={index} className={`results-portrait rarity-${char.rarity || "common"}`}>
                <img
                  src={`./assets/characterPortraits/${char.id}.png`}
                  alt={char.name}
                  className={`portrait-image type-${char.type}`}
                />
                <p className="char-name">{char.name}</p>
                <p className="char-power">Power: {char.power}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="no-summons">No summons found. Try summoning again!</p>
      )}

      <button className="return-button" onClick={() => navigate("/summon")}>
        Return to Summon
      </button>

      <audio loop autoPlay>
        <source
          src={`${import.meta.env.BASE_URL}assets/results.mp3` } 
          type="audio/mp3"
        />
      </audio>
    </div>
  );
}

export default Results;
