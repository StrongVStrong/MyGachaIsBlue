import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname == "/summon") {
        navigate("/");
    } else {
        navigate(-1);
    }
  }

  return (
    <button className="back-button" onClick={handleBack}>🔙 Back</button>
  );
}

export default BackButton;
