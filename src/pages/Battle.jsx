import React, { useRef } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import BackButton from "../components/BackButton";
import { useSyncedAudio } from "../hooks/useSyncedAudio";
import BattleScene from "../battle/battleScene";

function Battle() {
    const audioRef = useRef(null);
    const OST = `${import.meta.env.BASE_URL}assets/battle.mp3`;
    useSyncedAudio(audioRef, OST);

    return (
    <div>
      <BackButton /> {/*Back button*/}
      Welcome to the Battle Page! (wip)
      <title>Battle</title>

      <div className="min-h-screen bg-black text-white">
        <BattleScene />
      </div>
      
      <audio ref={audioRef} loop autoPlay>
        <source src={OST} type="audio/mp3" />
      </audio>
      
    </div>
    
    );
  }
  export default Battle;