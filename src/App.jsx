import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Hub from "./pages/Hub"; 
import Summon from "./pages/Summon"; 
import Battle from "./pages/Battle";
import Stages from "./pages/Stages";
import Inventory from "./pages/Inventory";
import Dev from "./pages/Dev";
import Results from "./pages/SummonResults";
import Login from "./pages/Login";
import Settings from "./pages/Settings"
import UserProfile from "./pages/UserProfile"
import PrivateRoute from "./components/PrivateRoute";
import CharacterPage from "./pages/CharacterPage";
import TeamPresets from "./pages/TeamPresets";


function App() {

  return (
    <>
      {/* 🔥 Router Setup */}
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<Layout />}>
            
            <Route path="/summon" element={<PrivateRoute><Summon /></PrivateRoute>} />
            <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
            <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />

          </Route>
          
          <Route path="/userprofile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><Hub /></PrivateRoute>} />
          <Route path="/character/:id" element={<PrivateRoute><CharacterPage /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/stages" element={<PrivateRoute><Stages /></PrivateRoute>} />
          <Route path="/battle/:stageId" element={<PrivateRoute><Battle /></PrivateRoute>} />
          <Route path="/dev" element={<PrivateRoute><Dev /></PrivateRoute>} />
          <Route path="/teams" element={<PrivateRoute><TeamPresets /></PrivateRoute>} />

          {/* Redirect all unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
