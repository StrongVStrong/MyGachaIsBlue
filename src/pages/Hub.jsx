import React, {useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayerData } from "../hooks/usePlayerData";
import "./Hub.css";

function Hub() {
  const navigate = useNavigate();
  const { level, playerExp, progressPercent, expToNextLevel, expForNextLevel, displayName, gems } = usePlayerData();
  const audioRef = useRef(null);

  const [selectedAudio, setSelectedAudio] = useState("");

  useEffect(() => {
    const randomTrack = Math.random() < 0.5 ? "hub1.mp3" : "hub2.mp3";
    setSelectedAudio(`${import.meta.env.BASE_URL}assets/${randomTrack}`);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
      audioRef.current.play().catch((error) => {
        console.warn("Audio playback blocked:", error);
      });
    }
  }, [selectedAudio]);
  

  return (
    <div className = "hub-container">
      <title>My Gacha is Blue</title>
      <link rel="icon" href="./assets/icons/default.ico" />
      <div className ="hub-bg"></div>

      <div className="hub-content">
        <h1 className="hub-title">My Gacha is <span className="animated-word">Blue</span></h1>
        <p className="hub-subtitle"></p>
        <div className = "hub-bar-bottom">
          <div className = "hub-btns">
            <button onClick = {() => navigate("/summon")} className="summon-btn">✨ Summon</button>
            <button onClick = {() => navigate("/battle")} className="battle-btn">⚔️ Battle</button>
            <button onClick = {() => navigate("/inventory")} className="inventory-btn">📦 Inventory</button>
          </div>
        </div>
        <div className = "hub-bar-top">
          <div className="gems-head">
            <h2 className="gems">💎 Gems: {gems}</h2> {/* Gems visible */}
          </div>
          <button onClick = {() => navigate("/dev")} className="dev-btn">Dev</button>
          <button onClick = {() => navigate("/settings")} className="settings-btn">⚙️</button>

          <div 
          className="exp-bar"
          onClick={() => navigate("/userprofile")}
          style={{ cursor : "pointer" }}
          >
            <div className = "level">
              {level}
            </div>
            <div className="exp-right">
              <div className="exp-username">{displayName}</div>

              <div className="exp-progress-container">
                <progress value={progressPercent} max={100}></progress>
                <span className="exp-progress-label">
                  {expForNextLevel - expToNextLevel} / {expForNextLevel}
                </span>
              </div>
            </div>

          </div>
        </div>

        {selectedAudio && (
          <audio ref={audioRef} loop autoPlay>
            <source src={selectedAudio} type="audio/mp3" />
          </audio>
        )}

        


      </div>
    </div>
  );
}

export default Hub