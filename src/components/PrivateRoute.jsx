import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const PrivateRoute = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let storedUserData = localStorage.getItem("userData");
        
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        } else {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            console.log("✅ Loaded user data from Firestore:", userSnap.data());
            localStorage.setItem("userData", JSON.stringify(userSnap.data()));
            setUserData(userSnap.data());
          } else {
            console.warn("⚠️ No Firestore data found for user!");
          }
        }
      } else {
        localStorage.removeItem("userData");
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return userData ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
