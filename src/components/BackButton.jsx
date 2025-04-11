import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useClickSFX } from "../hooks/useClickSFX";

function BackButton() {
  const playClick = useClickSFX();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname == "/summon") {
        navigate("/");
    } else if (location.pathname === "/stages") {
      navigate("/");
    }
    else {
        navigate(-1);
    }
  }

  return (
    <button className="back-button" onClick={() => {handleBack(); playClick();}}>⬅️</button>
  );
}

export default BackButton;
