import React from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import { Outlet } from "react-router-dom";

function Layout() {
  const { gems } = usePlayerData(); // Get gems

  return (
    <div className="layout">
      <header className="top-header">
        <h2 className="gems-display">💎 Gems: {gems}</h2> {/* Gems will always be visible */}
      </header>
      <main>
        <Outlet /> {/* This is where the pages will render */}
      </main>
    </div>
  );
}

export default Layout;
