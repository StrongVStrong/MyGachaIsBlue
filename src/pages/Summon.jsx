import React, { useState, useEffect, useRef } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import BackButton from "../components/BackButton";
import { useNavigate, useLocation } from "react-router-dom";
import characterList from "../data/characters";
import { useSyncedAudio } from "../hooks/useSyncedAudio";
import { useClickSFX } from "../hooks/useClickSFX";
import SummonAnimation from "../components/SummonAnimation";
import "./Summon.css";

const banners = {
  "Saiyan Day": {
    type: "Limited",
    characters: [
      { id: 1, name: "Super Saiyan Goku" },
      { id: 2, name: "Super Vegeta" },
      { id: 3, name: "Full Power SSJ Broly" },
      { id: 4, name: "Super Vegito" },
      { id: 5, name: "Super Gogeta" },
      { id: 11, name: "UI Goku" },
    ],
  },
  "Daima": {
    type: "Limited",
    characters: [
      { id: 6, name: "Super Saiyan 4 Goku (Daima)" },
      { id: 7, name: "Super Saiyan Goku (Daima)" },
      { id: 8, name: "Super Saiyan 3 Vegeta (Daima)" },
      { id: 9, name: "Glorio" },
      { id: 10, name: "Goma" },
      { id: 12, name: "SSJ4 Goku" },
    ],
  },
  "Dragon Ball Super": {
    type: "Limited",
    characters: [
      { id: 1, name: "Super Saiyan Goku" },
      { id: 2, name: "Super Vegeta" },
      { id: 13, name: "Super Saiyan 3 Goku" },
      { id: 14, name: "Super Saiyan Blue Goku" },
      { id: 15, name: "Super Saiyan Blue Kaioken Goku" },
      { id: 16, name: "Vegito Blue" },
      { id: 17, name: "Gogeta Blue" },
      { id: 11, name: "UI Goku" },
    ],
  },
  "Hunter X Hunter": {
    type: "Limited",
    characters: [
      { id: 1, name: "Super Saiyan Goku" },
      { id: 3, name: "Full Power SSJ Broly" },
      { id: 18, name: "Kurapika" },
      { id: 19, name: "Killua" },
      { id: 20, name: "Gon" },
      { id: 21, name: "Leoreo" },
    ],
  },
  "Other": {
    type: "2x",
    characters: [
      { id: 22, name: "Jotaro" },
      { id: 23, name: "Dio" },
      { id: 24, name: "Giorno" },
      { id: 25, name: "Isagi" },
      { id: 26, name: "Rafal" },
      { id: 27, name: "Sung Jin Woo" },
      { id: 28, name: "Lelouch" },
      { id: 29, name: "Ash" },
      { id: 30, name: "Gary" },
    ],
  },
};


  const bannerLabel = {
    "Saiyan Day": "Saiyan Day",
    "Daima": "Daima",
    "Dragon Ball Super": "DB Super",
    "Hunter X Hunter": "Hunters",
    "Other": "Other",
  };

  const bannerLabels = {
    "Saiyan Day": "Limited!",
    "Daima": "Limited!",
    "Dragon Ball Super": "Limited!",
    "Hunter X Hunter": "Limited!",
    "Other": "2x rates",
  };
  
  const rarityRates = {
    Default: {
      Common: 0.5,
      Rare: 0.3,
      Ultra: 0.15,
      Legendary: 0.045,
      Godly: 0.005,
    },
    Limited: {
      Common: 0.5,
      Rare: 0.3,
      Ultra: 0.15,
      Legendary: 0.045,
      Godly: 0.005,
    },
    "2x": {
      Common: 0.4,
      Rare: 0.3,
      Ultra: 0.2,
      Legendary: 0.09,
      Godly: 0.01,
    },
  };

  const renderGlowingText = (text) =>
    text.split("").map((char, i) => (
      <span key={i}>{char}</span>
  ));

  const BannerInfoPopup = ({ banner, onClose }) => {
    const rates = rarityRates[banner.type || "Default"];
    const characters = banners[banner.name].characters.map(({ id }) =>
      characterList.find(c => c.id === id)
    );
  
    // Group characters by rarity
    const grouped = characters.reduce((acc, char) => {
      const rarity = char.rarity || "Common";
      if (!acc[rarity]) acc[rarity] = [];
      acc[rarity].push(char);
      return acc;
    }, {});
  
    const rarityOrder = ["Common", "Rare", "Ultra", "Legendary", "Godly"];
  
    return (
      <div className="info-popup-overlay" onClick={onClose}>
        <div className="info-popup summon-info-popup" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={onClose}>✖</button>
          <h3>{banner.name} Rate-Ups</h3>
          <hr className="banner-divider" />
          {rarityOrder.map((rarity) => {
            const chars = grouped[rarity];
            const rate = rates[rarity];
            if (!chars || chars.length === 0 || rate == null) return null;
  
            const perCharRate = (rate / chars.length * 100).toFixed(2);
            return (
              <div key={rarity} className="rarity-section">
                <h4 className={rarity.toLowerCase()}>
                  {rarity} – {(rate * 100).toFixed(2)}% Total
                </h4>
                <div className="character-grid">
                  {chars.map((char) => (
                    <div key={char.id} className="char-entry">
                      <img
                        src={`./assets/characterPortraits/${char.id}.png`}
                        alt={char.name}
                        className={`char-icon border-type-${char.type}`}
                      />
                      <div className="char-info">
                        <strong>{char.name}</strong>
                        <span>{perCharRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <hr />
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  

  function Summon() {
    const playClick = useClickSFX();
    const { gems, setGems, isGuest, addCharacter } = usePlayerData();
    const location = useLocation();
    const bannerNames = Object.keys(banners);
    const audioRef = useRef(null);
    const OST = `${import.meta.env.BASE_URL}assets/summon.mp3`;
    useSyncedAudio(audioRef, OST);
    const failSFX = new Audio("./assets/sfx/failure.mp3");
    const [showBannerInfo, setShowBannerInfo] = useState(false);
    const [isSummoning, setIsSummoning] = useState(false);
    const [animationData, setAnimationData] = useState(null);
    const [pendingResults, setPendingResults] = useState(null);

    const startingBanner = location.state?.selectedBanner;
    const defaultIndex = startingBanner && bannerNames.includes(startingBanner)
      ? bannerNames.indexOf(startingBanner)
      : 0;

    const [bannerIndex, setBannerIndex] = useState(defaultIndex);

    const selectedBanner = bannerNames[bannerIndex];
    const bannerImages = {
      "Saiyan Day": "./assets/banners/saiyanday.jpg",
      "Daima": "./assets/banners/daima.jpg",
      "Dragon Ball Super": "./assets/banners/dragonballsuper.gif",
      "Hunter X Hunter": "./assets/banners/hxh.gif",
      "Other": "./assets/banners/other.gif",
    }

    const resummon = location.state?.resummon;
    const resummonAmount = location.state?.amountSummoned;

    const navigate = useNavigate();
    const singleCost = 100;
    const multiCost = 1000;
  
    const buildWeightedPool = (ids, bannerType) => {
      const pool = [];
      const filtered = characterList.filter((char) => ids.includes(char.id));
  
      const grouped = filtered.reduce((acc, char) => {
        const rarity = char.rarity || "Common";
        if (!acc[rarity]) acc[rarity] = [];
        acc[rarity].push(char);
        return acc;
      }, {});

      const currentRates = rarityRates[bannerType] || rarityRates["Default"];
  
      for (const [rarity, chars] of Object.entries(grouped)) {
        const rate = currentRates[rarity] || 0;
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
        failSFX.volume = 1;
        failSFX.play();
        alert("Not enough gems to summon!");
        return;
      }
      
      setGems((prev) => prev - cost);
      const bannerData = banners[selectedBanner];
      const bannerType = bannerData.type || "Default";
      const bannerIds = bannerData.characters.map((char) => char.id);
      const summonPool = buildWeightedPool(bannerIds, bannerType);
  
      const newCharacters = [];
      for (let i = 0; i < amount; i++) {
        const chosen = summonPool[Math.floor(Math.random() * summonPool.length)];
        newCharacters.push(chosen);
      }
  
      // Add new characters to inventory
      setPendingResults({
        newCharacters,
        selectedBanner,
        amount,
      });

      const pulledRarities = newCharacters.map(c => c.rarity || "Common");

      // Determine highest rarity
      const rarityOrder = ["Common", "Rare", "Ultra", "Legendary", "Godly"];
      const highestRarity = rarityOrder.reduce((prev, curr) =>
        pulledRarities.includes(curr) ? curr : prev
      );

      setAnimationData({ highestRarity });
      setIsSummoning(true);

      
      
    };

    useEffect(() => {
      if (resummon && resummonAmount && gems >= (resummonAmount === 1 ? 100 : 1000)) {
        const timeout = setTimeout(() => {
          handleSummon(resummonAmount);
    
          // 🚫 Remove resummon flag so it doesn’t re-trigger
          navigate("/summon", { state: { selectedBanner } }); 
        }, 10); // Short delay is fine
    
        return () => clearTimeout(timeout);
      }
    }, [resummon, resummonAmount, gems, selectedBanner, navigate]);
    
    
  
    return (
      <div className="summon-container">
        <title>Summon</title>
        <BackButton /> {/*Back button*/}
        <h1 className = "head">Summon Characters</h1>
        
        <div className = "banner">
          

          <div className = "banner-display">

            <button
            className = "banner-arrow left"
            onClick={() => {playClick(); setBannerIndex((i) => i - 1);}}
            disabled = {bannerIndex === 0 }
            > ← </button>

            <button
              className="corner-info-button"
              onClick={() => setShowBannerInfo(true)}
              title="View Summon Info"
            >
              ℹ️
            </button>


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
            onClick={() => {playClick(); setBannerIndex((i) => i + 1);}}
            disabled={bannerIndex === bannerNames.length - 1}
            > → </button>

          </div>

          

        </div>
        
        <button
          className="single-summon"
          onClick={() => {
            playClick();
            if (isGuest) sessionStorage.removeItem("guestRefreshed");
            handleSummon(1);
          }}
        >
          💎 Single Summon (100 Gems)
        </button>

        <button
          className="multi-summon"
          onClick={() => {
            playClick();
            if (isGuest) sessionStorage.removeItem("guestRefreshed");
            handleSummon(10);
          }}
        >
          💎 Multi Summon (1000 Gems)
        </button>


        <audio ref={audioRef} loop autoPlay>
          <source src={OST} type="audio/mp3" />
        </audio>
        
        {showBannerInfo && (
          <BannerInfoPopup
            banner={{ name: selectedBanner, ...banners[selectedBanner] }}
            onClose={() => setShowBannerInfo(false)}
          />
        )}

        {isSummoning && animationData && pendingResults && (
          <SummonAnimation
            highestRarity={animationData.highestRarity}
            pulledRarities={pendingResults.newCharacters.map(c => c.rarity || "Common")}
            audioRef={audioRef}
            onComplete={() => {
              pendingResults.newCharacters.forEach((char) => addCharacter(char.id));
              setIsSummoning(false);
              setAnimationData(null);
              setPendingResults(null);  
              navigate("/results", {
                state: {
                  amountSummoned: pendingResults.amount,
                  summonedCharacters: pendingResults.newCharacters.map((char) => char.id),
                  selectedBanner: pendingResults.selectedBanner,
                },
              });
            }}
          />
        )}

      </div>
      
    );

    
  }
  
  export default Summon;
  