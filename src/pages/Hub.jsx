import React, {useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import "./Hub.css";

function Hub() {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
      audioRef.current.play().catch((error) => {
        console.warn("Blocked", error);
      });
    }
  }, []);

  return (
    <div className = "hub-container">
      <div className ="hub-bg"></div>

      <div className="hub-content">
        <h1 className="hub-title">My Gacha is Blue</h1>
        <p className="hub-subtitle"></p>
        <div className = "hub-btns">
          <button onClick = {() => navigate("/summon")} className="summon-btn">Summon</button>
          <button onClick = {() => navigate("/battle")} className="battle-btn">Battle</button>
          <button onClick = {() => navigate("/inventory")} className="inventory-btn">Inventory</button>
          <button onClick = {() => navigate("/dev")} className="dev-btn">Dev</button>
        </div>

        <audio loop autoPlay>
          <source src={`${import.meta.env.BASE_URL}assets/bgm.mp3`} type="audio/mp3" />
        </audio>


      </div>
    </div>
  );
}

export default Hub