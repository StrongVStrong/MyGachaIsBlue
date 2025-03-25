import React, {useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hub.css";

function Hub() {
  const navigate = useNavigate();
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
        <div className = "hub-btns">
          <button onClick = {() => navigate("/summon")} className="summon-btn">Summon</button>
          <button onClick = {() => navigate("/battle")} className="battle-btn">Battle</button>
          <button onClick = {() => navigate("/inventory")} className="inventory-btn">Inventory</button>
          <button onClick = {() => navigate("/dev")} className="dev-btn">Dev</button>
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