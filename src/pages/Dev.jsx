import React, { useState } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import BackButton from "../components/BackButton";

function Dev() {
  const { gems, setGems } = usePlayerData(); // ✅ Get and update gems
  const [amount, setAmount] = useState(""); // ✅ Input value

  const addGems = () => {
    if (!isNaN(amount) && amount.trim() !== "") {
      setGems(gems + parseInt(amount, 10)); // ✅ Add gems
      setAmount(""); // ✅ Reset input
    }
  };

  return (
    <div className="dev-container">
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
