import React, { useState } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import BackButton from "../components/BackButton";
import "./Dev.css";

function Dev() {
  const { gems, setGems, playerExp, setPlayerExp, currency, setCurrency } = usePlayerData();
  const [amount, setAmount] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [rerollAmount, setRerollAmount] = useState("");


  const addGems = () => {
    if (!isNaN(amount) && amount.trim() !== "") {
      setGems((prev) => prev + parseInt(amount, 10));
      setAmount("");
    }
  };

  const addExp = () => {
    if (!isNaN(expAmount) && expAmount.trim() !== "") {
      setPlayerExp(playerExp + parseInt(expAmount, 10));
      setExpAmount("");
    }
  };

  const addCurrency = (key, value) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setCurrency((prev) => ({
        ...prev,
        [key]: (prev[key] ?? 0) + num,
      }));
    }
  };
  
  

  return (
    
    <div className="dev-container">
      <title>Get out</title>
        <BackButton /> {/*Back button*/}
      <h1>Admin Dev Panel</h1>

      <p>💎 Current Gems: {gems}</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter gems amount"
      />
      <button onClick={addGems}>Add Gems</button>

      <p>🧪 Current EXP: {playerExp}</p>
      <input
        type="number"
        value={expAmount}
        onChange={(e) => setExpAmount(e.target.value)}
        placeholder="Enter EXP amount"
      />
      <button onClick={addExp}>Add EXP</button>

      <p>🎲 Trait Rerolls: {currency.traitRerolls}</p>
      <input
        type="number"
        value={rerollAmount}
        onChange={(e) => setRerollAmount(e.target.value)}
        placeholder="Enter reroll amount"
      />
      <button
        onClick={() => {
          addCurrency("traitRerolls", rerollAmount);
          setRerollAmount("");
        }}
      >
        Add Rerolls
      </button>

    </div>
  );
}

export default Dev;
