import React, { useState } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";

const banners = {
    "Saiyan Warriors": [
      { name: "Super Saiyan Goku", power: 9000 },
      { name: "Vegeta", power: 8500 },
      { name: "Broly", power: 9500 },
      { name: "Raditz", power: 7000 },
      { name: "Nappa", power: 7500 },
    ],
    "Galactic Tyrants": [
      { name: "Frieza", power: 9200 },
      { name: "Cooler", power: 8800 },
      { name: "Ginyu", power: 8200 },
      { name: "Zarbon", power: 7800 },
      { name: "Dodoria", power: 7600 },
    ],
  };

  function Summon() {
    const { gems, setGems, characters, setCharacters } = usePlayerData();
    const [selectedBanner, setSelectedBanner] = useState(Object.keys(banners)[0]);
    const navigate = useNavigate();
    const singleCost = 100;
    const multiCost = 1000;
  
    const handleSummon = (amount) => {
      const cost = amount === 1 ? singleCost : multiCost;
      if (gems < cost) {
        alert("Not enough gems to summon!");
        return;
      }
  
      // Deduct gems
      setGems(gems - cost);
  
      // Get banner pool
      const summonPool = banners[selectedBanner];
      
      // Summon characters
      const newCharacters = [];
      for (let i = 0; i < amount; i++) {
        const newCharacter = summonPool[Math.floor(Math.random() * summonPool.length)];
        newCharacters.push(newCharacter);
      }
  
      // Add new characters to inventory
      setCharacters([...characters, ...newCharacters]);
      
      

      navigate("/results", { state: { amountSummoned: amount, summonedCharacters: newCharacters } });
      window.location.reload();
    };
  
    return (
      <div className="summon-container">
        <BackButton /> {/*Back button*/}
        <h1>Summon Characters</h1>
        <p>💎 Gems: {gems}</p>
        
        <label>Select Banner:</label>
        <select value={selectedBanner} onChange={(e) => setSelectedBanner(e.target.value)}>
          {Object.keys(banners).map((banner) => (
            <option key={banner} value={banner}>{banner}</option>
          ))}
        </select>
        
        <button onClick={() => handleSummon(1)}>Single Summon (100 Gems)</button>
        <button onClick={() => handleSummon(10)}>Multi Summon (1000 Gems)</button>
        
        
      </div>
    );
  }
  
  export default Summon;
  