import React from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import BackButton from "../components/BackButton";
import "./Inventory.css";
import characterList from "../data/characters";

function Inventory() {
  const { characters } = usePlayerData();

  // Dupes
  const ownedCount = characters.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  const ownedIds = new Set(characters);

  const owned = characterList.filter((char) => ownedIds.has(char.id));
  const unowned = characterList.filter((char) => !ownedIds.has(char.id));
  const sortedList = [...owned, ...unowned];

  return (
    <div className="inventory-container">
      <BackButton />
      <h1 className = "inv-title">Characters</h1>

      <div className="character-grid">
        {sortedList.map((char) => {
          const count = ownedCount[char.id] || 0;
          const isOwned = count > 0;

          return (
            <div key={char.id} className={`portrait ${isOwned ? "owned" : "unowned"} type-${char.type}`}>
              <img src={`./assets/characterPortraits/${char.id}.png`} alt={char.name} />
            </div>
          );
        })}

        <audio loop autoPlay>
          <source src={`${import.meta.env.BASE_URL}assets/inventory.mp3`} type="audio/mp3" />
        </audio>

      </div>
    </div>
  );
}

export default Inventory;
