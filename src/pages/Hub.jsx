import React from "react";
import { useNavigate } from "react-router-dom";
import { usePlayerData } from "../hooks/usePlayerData";

function Hub() {
  const navigate = useNavigate();
  const { gems } = usePlayerData();

  return (
    <div className = "hub-container">
      <h1>My Gacha is Blue</h1>
      <p>Lobby</p>
      <div className = "hub-btns">
        <button onClick = {() => navigate("/summon")}>Summon</button>
        <button onClick = {() => navigate("/battle")}>Battle</button>
        <button onClick = {() => navigate("/inventory")}>Inventory</button>
        <button onClick = {() => navigate("/dev")}>Dev</button>
      </div>
    </div>
  );
}

export default Hub