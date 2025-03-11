import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const { summonedCharacters } = location.state || { summonedCharacters: [] }; // ✅ Get summoned characters

  return (
    <div className="results-container">
      <h1>🎉 Summon Results 🎉</h1>
      {summonedCharacters.length > 0 ? (
        <ul>
          {summonedCharacters.map((char, index) => (
            <li key={index}>{char.name} (Power: {char.power})</li>
          ))}
        </ul>
      ) : (
        <p>No summons found. Try summoning again!</p> // ✅ Prevents blank results
      )}
      <button onClick={() => navigate("/summon")}>Return to Summon</button>
    </div>
  );
}

export default Results;
