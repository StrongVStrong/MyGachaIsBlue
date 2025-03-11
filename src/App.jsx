import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Hub from "./pages/Hub"; 
import Summon from "./pages/Summon"; 
import Battle from "./pages/Battle"; 
import Inventory from "./pages/Inventory";
import Dev from "./pages/Dev";
import Results from "./pages/SummonResults";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Hub />} />
          <Route path="/summon" element={<Summon />} />
          <Route path="/results" element={<Results />} />
          <Route path="/inventory" element={<Inventory />} />
        </Route>
        <Route path="/battle" element={<Battle />} />
        <Route path="/dev" element={<Dev />} />
      </Routes>
    </Router>
  );
}

export default App;
