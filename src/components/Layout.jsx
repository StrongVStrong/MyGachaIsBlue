import React from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import { Outlet } from "react-router-dom";

function Layout() {
  const { gems } = usePlayerData(); // Get gems

  return (
    <div className="layout">
      <header className="top-header">
        <h2 className="gems-display">💎 Gems: {gems}</h2> {/* Gems visible */}
      </header>
      <main>
        <Outlet /> {/* All pages will render here */}
      </main>
    </div>
  );
}

export default Layout;
