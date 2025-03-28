import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signIn, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure Firebase is ready before redirecting
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 🔥 Fetch Firestore Data
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          console.log("✅ User data loaded from Firestore:", userSnap.data());
          localStorage.setItem("userData", JSON.stringify(userSnap.data()));
        } else {
          console.warn("⚠️ No Firestore data found for user!");
        }

        navigate("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGuestMode = () => {
    localStorage.setItem("guestMode", "true");
    localStorage.setItem("guestData", JSON.stringify({
      gems: 500,
      characters: [],
      exp: 0,
      displayName: "Guest",
      preferences: { volume: 0.5 }
    }));

    navigate("/");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="login-container">
      <div className="login-bg"></div>
      <h1 className = "login-text">Welcome to the Greatest Gacha</h1>
      <button onClick={signIn} className="login-btn">Sign in with Google</button>
      <button onClick={handleGuestMode} className="guest-btn">
        Continue as Guest
      </button>
    </div>
  );
}

export default Login;
