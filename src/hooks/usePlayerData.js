import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function saveToGuest(key, value, loaded = true) {
  if (!loaded) return;
  const current = JSON.parse(localStorage.getItem("guestData")) || {};
  const updated = { ...current, [key]: value };
  localStorage.setItem("guestData", JSON.stringify(updated));
}

const defaultCharacterState = () => ({
  count: 1,
  trait: null,
  limitBreak: 0,
});

const defaultCurrencyState = () => ({
  gold: 0,
  traitRerolls: 0,
});

const defaultPreferences = () => ({
  volume: 0.5,
});

const defaultData = () => ({
  clearedStages: {}
});

export function usePlayerData() {

  const [gems, setGems] = useState(0);
  const [characters, setCharacters] = useState({});
  const [currency, setCurrency] = useState(defaultCurrencyState());
  const [userId, setUserId] = useState(null);
  const [playerExp, setPlayerExp] = useState(0);
  const [displayName, setDisplayName] = useState("Player");
  const [preferences, setPreferences] = useState(defaultPreferences());
  const [loadedGuestData, setLoadedGuestData] = useState(false);
  const [playerData, setPlayerData] = useState(defaultData());


  const isGuest = localStorage.getItem("guestMode") === "true";

  //Load Firestore data
  useEffect(() => {

    if (isGuest) {
      const guestData = JSON.parse(localStorage.getItem("guestData")) || {};
      setGems(guestData.gems ?? 500);
      setCharacters(guestData.characters ?? {});
      setCurrency(guestData.currency ?? defaultCurrencyState());
      setPlayerExp(guestData.exp ?? 0);
      setDisplayName(guestData.displayName ?? "Guest");
      setPreferences(guestData.preferences ?? defaultPreferences());
      setPlayerData(guestData.data ?? defaultData());
      setLoadedGuestData(true);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const userRef = doc(db, "users", user.uid);

        // Real time Firebase
        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setGems(userData.gems || 0);
            setCharacters(userData.characters || {});
            setCurrency(userData.currency || defaultCurrencyState());
            setPlayerExp(userData.exp || 0);
            setDisplayName(userData.displayName || "Loading");
            const prefs = userData.preferences || {};
            setPreferences({
              ...defaultPreferences(),
              ...prefs
            });
            setPlayerData(userData.data || defaultData);
          }
        });

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Save display name changes
  useEffect(() => {
    if (displayName === "Player" || displayName === "Guest") return;

    if (isGuest) {
      alert("⚠️ Create an account to change your display name.");
      return;
    }

    if (userId != null) {
      const userRef = doc(db, "users", userId);
      updateDoc(userRef, { displayName })
        .then(() => console.log("✅ Display name updated:", displayName))
        .catch((err) => console.error("❌ Error updating name:", err));
    }
  }, [displayName]);



  // Save gems when they change
  useEffect(() => {
    if (isGuest) {
      saveToGuest("gems", gems, loadedGuestData);
      return;
    }

    if (userId != null) {
      const userRef = doc(db, "users", userId);
      updateDoc(userRef, { gems });
      console.log("Gems updated", gems);
    }
  }, [gems]);

  // Save inventory when it changes
  useEffect(() => {
    if (isGuest) {
      saveToGuest("characters", characters, loadedGuestData);
      return;
    }

    if (userId != null) {
      const userRef = doc(db, "users", userId);
      updateDoc(userRef, { characters });
      console.log("Characters updated", characters)
    }
  }, [characters]);

  // Save currency
  useEffect(() => {
    if (isGuest) {
      saveToGuest("currency", currency, loadedGuestData);
      return;
    }
  
    if (userId != null) {
      const userRef = doc(db, "users", userId);
      updateDoc(userRef, { currency });
      console.log("Currency updated", currency);
    }
  }, [currency]);

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
    if (isGuest) {
      saveToGuest("exp", playerExp, loadedGuestData);
      return;
    }

    if (userId != null) {
      const userRef = doc(db, "users", userId);
      updateDoc(userRef, { exp: playerExp });
      console.log("EXP updated", playerExp);
    }
  }, [playerExp]);

  // Save player preferences
  useEffect(() => {
    if (isGuest) {
      saveToGuest("preferences", preferences, loadedGuestData);
      return;
    }

    if (userId != null) {
      const userRef = doc(db, "users", userId);
      updateDoc(userRef, { preferences });
      console.log("Preferences updated", preferences);
    }
  }, [preferences]);

  // Save player data
  useEffect(() => {
    if (isGuest) {
      saveToGuest("data", playerData, loadedGuestData);
      return;
    }
  
    if (userId != null) {
      const userRef = doc(db, "users", userId);
      updateDoc(userRef, { data: playerData });
      console.log("Data updated", playerData);
    }
  }, [playerData]);
  

  const addCharacter = (id) => {
    setCharacters((prev) => {
      const existing = prev[id];
      if (existing) {
        return { ...prev, [id]: { ...existing, count: existing.count + 1 } };
      } else {
        return { ...prev, [id]: defaultCharacterState() };
      }
    });
  };
  

  return { 
  gems, 
  setGems, 
  characters, 
  setCharacters,
  addCharacter,
  currency,
  setCurrency,
  playerExp, 
  setPlayerExp,
  playerData,
  setPlayerData,
  level: levelStats.level,
  expToNextLevel: levelStats.expToNextLevel,
  expForNextLevel: levelStats.expForNextLevel,
  progressPercent: levelStats.progressPercent,
  displayName,
  setDisplayName,
  preferences,
  setPreferences,
  isGuest
 };
}