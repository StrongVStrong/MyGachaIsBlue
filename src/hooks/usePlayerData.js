import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";



export function usePlayerData() {

  const [gems, setGems] = useState(0);
  const [characters, setCharacters] = useState([]);
  const [userId, setUserId] = useState(null);
  const [playerExp, setPlayerExp] = useState(0);
  const [displayName, setDisplayName] = useState("Player");


  //Load Firestore data
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const userRef = doc(db, "users", user.uid);

        // Real time Firebase
        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setGems(userData.gems || 0);
            setCharacters(userData.characters || []);
            setPlayerExp(userData.exp || 0);
            setDisplayName(userData.displayName || "Player");
            console.log("Firestore Update:", userData);
          }
        });

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribeAuth();
  }, []);


  // Save gems when they change
  useEffect(() => {
    if (userId != null) {
      const userRef = doc(db, "users", userId);
      updateDoc(userRef, { gems });
      console.log("Gems updated", gems);
    }
  }, [gems]);

  // Save inventory when it changes
  useEffect(() => {
    if (userId != null) {
      const userRef = doc(db, "users", userId);
      updateDoc(userRef, { characters });
      console.log("Characters updated", characters)
    }
  }, [characters]);

  function calculateLevelStats(totalExp) {
    let level = 1;
    let expRemaining = totalExp;
    let required = 100;
  
    while (expRemaining >= required) {
      expRemaining -= required;
      level++;
      required = Math.floor(required * 1.15);
    }
  
    const expForNextLevel = required;
    const expToNextLevel = required - expRemaining;
    const progressPercent = Math.floor((expRemaining / required) * 100);
  
    return {
      level,
      expForNextLevel,
      expToNextLevel,
      progressPercent
    };
  }

  const levelStats = calculateLevelStats(playerExp);

  // Save player exp when it changes
  useEffect(() => {
    if (userId != null) {
      const userRef = doc(db, "users", userId);
      updateDoc(userRef, { exp: playerExp });
      console.log("EXP updated", playerExp);
    }
  }, [playerExp]);
  

  return { 
  gems, 
  setGems, 
  characters, 
  setCharacters, 
  playerExp, 
  setPlayerExp, 
  level: levelStats.level,
  expToNextLevel: levelStats.expToNextLevel,
  expForNextLevel: levelStats.expForNextLevel,
  progressPercent: levelStats.progressPercent,
  displayName
 };
}