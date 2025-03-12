import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Hub from "./pages/Hub"; 
import Summon from "./pages/Summon"; 
import Battle from "./pages/Battle"; 
import Inventory from "./pages/Inventory";
import Dev from "./pages/Dev";
import Results from "./pages/SummonResults";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase"; // Import Firestore instance

function App() {
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

  return (
    <>
      {/* 🔥 Firestore Test Button (Temporary) */}
      <button onClick={testFirestoreWrite} style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
        Test Firestore Write
      </button>

      {/* 🔥 Router Setup */}
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<PrivateRoute><Hub /></PrivateRoute>} />
            <Route path="/summon" element={<PrivateRoute><Summon /></PrivateRoute>} />
            <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
            <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
          </Route>
          <Route path="/battle" element={<PrivateRoute><Battle /></PrivateRoute>} />
          <Route path="/dev" element={<PrivateRoute><Dev /></PrivateRoute>} />

          {/* Redirect all unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
