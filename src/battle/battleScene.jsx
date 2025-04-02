import React, { useState } from "react";
import characterDetails from "../data/characterDetails";
import stages from "../data/stages";
import { performAttack } from "../logic/battleEngine";

export default function BattleScene() {
  const stage = stages["1-1"];
  const leaderMultiplier = 5.4;

    const playerTeam = [
    { id: 1, ...characterDetails[1] },
    { id: 2, ...characterDetails[2] }
    ].map(unit => {
    const maxHp = Math.floor(unit.baseHp * leaderMultiplier);
    return {
        ...unit,
        maxHp,
        currentHp: maxHp
    };
    });
    const [activeUnitIndex, setActiveUnitIndex] = useState(0);


  const [enemyPhaseIndex, setEnemyPhaseIndex] = useState(0);
  const [log, setLog] = useState([]);
  const [turn, setTurn] = useState(1);


  const currentEnemy = stage.phases[enemyPhaseIndex];

  const battleContext = {
    turnNow: turn,
    turnEntered: { 1: 1, 2: 1 },
    evaded: { 1: false, 2: false },
    leaderAtkMultiplier: 5.4,
    leaderDefMultiplier: 5.4,
    team: playerTeam
  };

  const handleAttack = (attackerId) => {
    const attacker = characterDetails[attackerId];
    const result = performAttack(attacker, currentEnemy, battleContext, attackerId);
    console.log("Attacker ID:", attackerId);
    console.log("Attacker:", attacker);


    setLog(prev => [
      ...prev,
      `🔹 ${attacker.name} dealt ${result.damage} damage!`
    ]);

    // Apply damage to enemy HP
    currentEnemy.hp -= result.damage;

    // Advance to next phase if HP ≤ 0
    if (currentEnemy.hp <= 0) {
      if (enemyPhaseIndex < stage.phases.length - 1) {
        setEnemyPhaseIndex(prev => prev + 1);
        setLog(prev => [...prev, `⚔️ Phase changed to ${stage.phases[enemyPhaseIndex + 1].name}`]);
      } else {
        setLog(prev => [...prev, "🎉 Battle Cleared!"]);
      }
    }

    setTurn(prev => prev + 1);
  };

  return (
    <div className="p-6 bg-zinc-900 text-white rounded-xl">
      <h2 className="text-xl mb-4">{stage.name}</h2>

      <div className="mb-4">
        <h3>🧟 Enemy: {currentEnemy.name}</h3>
        <p>HP: {currentEnemy.hp}</p>
        <p>ATK: {currentEnemy.atk}</p>
        <p>DEF: {currentEnemy.def}</p>
      </div>

    <h3 className="text-lg font-bold text-green-400 animate-pulse">
    🔄 Turn: {turn}
    </h3>

    <div className="mb-6">
        <h3 className="text-lg font-bold">🧍 Active Unit:</h3>
            <div className="p-3 bg-zinc-800 rounded mb-2">
                <p className="text-xl font-semibold">{playerTeam[activeUnitIndex].name}</p>
                <p>❤️ HP: {playerTeam[activeUnitIndex].currentHp} / {playerTeam[activeUnitIndex].maxHp}</p>
                <button
                onClick={() => handleAttack(playerTeam[activeUnitIndex].id)}
                className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                >
                Attack
                </button>
            </div>

            <h4 className="text-md font-bold mt-4">🔁 Switch Character:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
                {playerTeam.map((unit, idx) => (
                idx !== activeUnitIndex && (
                    <button
                    key={unit.id}
                    onClick={() => setActiveUnitIndex(idx)}
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded"
                    >
                    Switch to {unit.name}
                    </button>
                )
                ))}
            </div>
    </div>

      <div className="bg-black/40 p-4 rounded border border-zinc-700">
        <h3 className="text-lg font-bold mb-2">📜 Turn Log</h3>
        <ul className="text-sm space-y-1">
          {log.map((entry, idx) => <li key={idx}>{entry}</li>)}
        </ul>
      </div>
    </div>
  );
}
