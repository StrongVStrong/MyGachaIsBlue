import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";



export function usePlayerData() {

  const [gems, setGems] = useState(0);
  const [characters, setCharacters] = useState([]);
  const [userId, setUserId] = useState(null);

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
            console.log("🔄 Live Firestore Update:", userData);
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

  return { gems, setGems, characters, setCharacters };
}