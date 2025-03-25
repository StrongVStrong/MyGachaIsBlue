import React, { useState } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import BackButton from "../components/BackButton";

function Dev() {
  const { gems, setGems } = usePlayerData();
  const [amount, setAmount] = useState("");

  const addGems = () => {
    if (!isNaN(amount) && amount.trim() !== "") {
      setGems(gems + parseInt(amount, 10));
      setAmount("");
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

    </div>
  );
}

export default Dev;
