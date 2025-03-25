import React, { useState } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import characterList from "../data/characters";
import "./Summon.css";

const banners = {
    "Saiyan Day": [
      { id: 1, name: "Super Saiyan Goku" },
      { id: 2, name: "Super Vegeta" },
      { id: 3, name: "Full Power SSJ Broly" },
      { id: 4, name: "Super Vegito" },
      { id: 5, name: "Super Gogeta" },
    ],
    "Daima": [
      { id: 6, name: "Super Saiyan 4 Goku (Daima)" },
      { id: 7, name: "Super Saiyan Goku (Daima)" },
      { id: 8, name: "Super Saiyan 3 Vegeta (Daima)" },
      { id: 9, name: "Glorio" },
      { id: 10, name: "Goma" },
    ],
  };

  const bannerLabel = {
    "Saiyan Day": "Saiyan Day",
    "Daima": "Daima",
  };

  const bannerLabels = {
    "Saiyan Day": "Limited!",
    "Daima": "Limited!",
  };

  const rarityRates = {
    common: 0.5,
    rare: 0.3,
    ultra: 0.15,
    legendary: 0.05,
  };

  const renderGlowingText = (text) =>
    text.split("").map((char, i) => (
      <span key={i}>{char}</span>
  ));

  function Summon() {
    const { gems, setGems, characters, setCharacters } = usePlayerData();
    const bannerNames = Object.keys(banners);
    const [bannerIndex, setBannerIndex] = useState(0);
    const selectedBanner = bannerNames[bannerIndex];
    const bannerImages = {
      "Saiyan Day": "./assets/banners/saiyanday.jpg",
      "Daima": "./assets/banners/daima.jpg"
    }
    const navigate = useNavigate();
    const singleCost = 100;
    const multiCost = 1000;
  
    const buildWeightedPool = (ids) => {
      const pool = [];
      const filtered = characterList.filter((char) => ids.includes(char.id));
  
      const grouped = filtered.reduce((acc, char) => {
        const rarity = char.rarity || "common";
        if (!acc[rarity]) acc[rarity] = [];
        acc[rarity].push(char);
        return acc;
      }, {});
  
      for (const [rarity, chars] of Object.entries(grouped)) {
        const rate = rarityRates[rarity] || 0;
        const perCharRate = rate / chars.length;
  
        for (const char of chars) {
          const entries = Math.floor(perCharRate * 10000);
          pool.push(...Array(entries).fill(char));
        }
      }
  
      return pool;
    };
  
    const handleSummon = (amount) => {
      const cost = amount === 1 ? singleCost : multiCost;
      if (gems < cost) {
        alert("Not enough gems to summon!");
        return;
      }
  
      setGems((prev) => prev - cost);
      const bannerIds = banners[selectedBanner].map((char) => char.id);
      const summonPool = buildWeightedPool(bannerIds);
  
      const newCharacters = [];
      for (let i = 0; i < amount; i++) {
        const chosen = summonPool[Math.floor(Math.random() * summonPool.length)];
        newCharacters.push(chosen);
      }
  
      // Add new characters to inventory
      setCharacters((prev) => [...prev, ...newCharacters.map((char) => char.id)]);
      navigate("/results", {
        state: { amountSummoned: amount, summonedCharacters: newCharacters.map((char) => char.id) },
      });
      
    };
  
    return (
      <div className="summon-container">
        <BackButton /> {/*Back button*/}
        <h1 className = "head">Summon Characters</h1>
        
        <div className = "banner">
          

          <div className = "banner-display">

            <button
            className = "banner-arrow left"
            onClick={() => setBannerIndex((i) => i - 1)}
            disabled = {bannerIndex === 0 }
            > ← </button>

            <img
            src={bannerImages[selectedBanner]}
            alt = {selectedBanner}
            className = "banner-image"
            />
            <div className = "banner-overlay2">
              {(bannerLabel[selectedBanner])}
            </div>
            <div className="banner-overlay animated-glow">
              {renderGlowingText(bannerLabels[selectedBanner] || "")}
            </div>

            <button
            className = "banner-arrow right"
            onClick={() => setBannerIndex((i) => i + 1)}
            disabled={bannerIndex === bannerNames.length - 1}
            > → </button>

          </div>

          

        </div>
        
        <button className = "single-summon" onClick={() => handleSummon(1)}>Single Summon (100 Gems)</button>
        <button className = "multi-summon" onClick={() => handleSummon(10)}>Multi Summon (1000 Gems)</button>

        <audio loop autoPlay>
          <source src={`${import.meta.env.BASE_URL}assets/summon.mp3`} type="audio/mp3" />
        </audio>
        
        
      </div>
    );
  }
  
  export default Summon;
  