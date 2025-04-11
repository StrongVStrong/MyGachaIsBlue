import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSyncedAudio } from "../hooks/useSyncedAudio";
import BackButton from "../components/BackButton";
import BattleScene from "../battle/battleScene";

function Battle() {
  const { stageId } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const OST = `${import.meta.env.BASE_URL}assets/battle.mp3`;
  useSyncedAudio(audioRef, OST);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <BackButton />
      <title>Battle</title>

      <BattleScene
        stageId={stageId}
        onVictory={() => {
          setTimeout(() => navigate("/battle-select"), 10000);
        }}
      />

      <audio ref={audioRef} loop autoPlay>
        <source src={OST} type="audio/mp3" />
      </audio>
    </div>
  );
}

export default Battle;
