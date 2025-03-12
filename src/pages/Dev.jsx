import React, { useState } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import BackButton from "../components/BackButton";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Import Firestore instance

function Dev() {
  const { gems, setGems } = usePlayerData(); // ✅ Get and update gems
  const [amount, setAmount] = useState(""); // ✅ Input value

  // 🔹 Firestore Test Function
  const testFirestoreWrite = async () => {
    try {
      const testRef = doc(db, "users", "testUser123");
      await setDoc(testRef, { name: "Test User", gems: 1000 });
      console.log("✅ Firestore write successful!");
    } catch (error) {
      console.error("❌ Firestore write failed:", error);
    }
  };

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

      {/* 🔥 Firestore Test Button (Temporary) */}
      <button onClick={testFirestoreWrite} style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
        Test Firestore Write
      </button>
    </div>
  );
}

export default Dev;
