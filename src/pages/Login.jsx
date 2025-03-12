import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signIn } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure Firebase is ready before redirecting
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="login-container">
      <h1>Login</h1>
      <button onClick={signIn} className="login-btn">Sign in with Google</button>
    </div>
  );
}

export default Login;
