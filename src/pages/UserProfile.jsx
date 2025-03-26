import React, { useState } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import BackButton from "../components/BackButton";

function Dev() {
  const { gems, setGems, playerExp, setPlayerExp } = usePlayerData();
  const [amount, setAmount] = useState("");
  const [expAmount, setExpAmount] = useState("");


  const addGems = () => {
    if (!isNaN(amount) && amount.trim() !== "") {
      setGems(gems + parseInt(amount, 10));
      setAmount("");
    }
  };

  const addExp = () => {
    if (!isNaN(expAmount) && expAmount.trim() !== "") {
      setPlayerExp(playerExp + parseInt(expAmount, 10));
      setExpAmount("");
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


    </div>
  );
}

export default Dev;
