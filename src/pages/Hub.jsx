import React, {useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayerData } from "../hooks/usePlayerData";
import "./Hub.css";
import { useSyncedAudio } from "../hooks/useSyncedAudio";
import { useClickSFX } from "../hooks/useClickSFX";

function Hub() {
  const playClick = useClickSFX();
  const navigate = useNavigate();
  const { level, playerExp, progressPercent, expToNextLevel, expForNextLevel, displayName, gems } = usePlayerData();
  const audioRef = useRef(null);

  const [selectedAudio, setSelectedAudio] = useState("");

  useEffect(() => {
    const randomTrack = Math.random() < 0.5 ? "hub1.mp3" : "hub2.mp3";
    setSelectedAudio(`${import.meta.env.BASE_URL}assets/${randomTrack}`);
  }, []);

  useSyncedAudio(audioRef, selectedAudio);
  

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
            <button onClick = {() => {navigate("/summon"); playClick();}} className="summon-btn">✨ Summon</button>
            <button onClick = {() => {navigate("/stages"); playClick();}} className="battle-btn">⚔️ Play</button>
            <button onClick = {() => {navigate("/inventory"); playClick();}} className="inventory-btn">🧙 Characters</button>
            <button onClick={() => {navigate("/teams"); playClick();}} className="team-btn">📁 Teams</button>
          </div>
        </div>
        <div className = "hub-bar-top">
          <div className="gems-head">
            <h2 className="gems">💎 Gems: {gems}</h2>
          </div>
          <button onClick = {() => {navigate("/dev"); playClick();}} className="dev-btn">Dev</button>
          <button onClick = {() => {navigate("/settings"); playClick();}} className="settings-btn">⚙️</button>

          <div 
          className="exp-bar"
          onClick={() => {playClick(); navigate("/userprofile");}}
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