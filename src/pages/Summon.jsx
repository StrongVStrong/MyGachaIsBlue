import React, { useState } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";

const banners = {
    "Saiyan Day": [
      { id: 1, name: "Super Saiyan Goku", power: 9000 },
      { id: 2, name: "Super Vegeta", power: 8500 },
      { id: 3, name: "Full Power SSJ Broly", power: 9500 },
      { id: 4, name: "Super Vegito", power: 10500 },
      { id: 5, name: "Super Gogeta", power: 10500 },
    ],
    "Daima": [
      { id: 6, name: "Super Saiyan 4 Goku (Daima)", power: 11000 },
      { id: 7, name: "Super Saiyan Goku (Daima)", power: 8000 },
      { id: 8, name: "Super Saiyan 3 Vegeta (Daima)", power: 8400 },
      { id: 9, name: "Glorio", power: 7800 },
      { id: 10, name: "Goma", power: 10000 },
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
      setGems((prevGems) => prevGems - cost);
  
      // Get banner pool
      const summonPool = banners[selectedBanner];
      
      // Summon characters
      const newCharacters = [];
      for (let i = 0; i < amount; i++) {
        const newCharacter = summonPool[Math.floor(Math.random() * summonPool.length)];
        newCharacters.push(newCharacter);
      }
  
      // Add new characters to inventory
      setCharacters((prevCharacters) => [...prevCharacters, ...newCharacters.map(char => char.id)]);
      
      navigate("/results", { state: { amountSummoned: amount, summonedCharacters: newCharacters } });
      
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

        <audio loop autoPlay>
          <source src={`${import.meta.env.BASE_URL}assets/summon.mp3`} type="audio/mp3" />
        </audio>
        
        
      </div>
    );
  }
  
  export default Summon;
  