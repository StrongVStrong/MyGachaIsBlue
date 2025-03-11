import React from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import BackButton from "../components/BackButton";

function Inventory() {
  const { characters } = usePlayerData(); // ✅ Get inventory

  // ✅ Count duplicate characters
  const characterCount = characters.reduce((acc, char) => {
    const key = `${char.name} (Power: ${char.power})`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="inventory-container">
      <BackButton />
      <h1>📦 Your Inventory 📦</h1>

      {characters.length > 0 ? (
        <ul className="character-list">
          {Object.entries(characterCount).map(([charName, count], index) => (
            <li key={index} className="character-item">
              <span>{charName} {count > 1 ? `x${count}` : ""}</span> {/* ✅ Show count */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No characters in inventory. Try summoning!</p> // ✅ Prevents blank inventory
      )}
    </div>
  );
}

export default Inventory;
