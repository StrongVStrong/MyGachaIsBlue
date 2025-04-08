import React, { useState, useRef, useEffect } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import characterDetails from "../data/characterDetails";
import stages from "../data/stages";
import { performAttack } from "../logic/battleEngine";
import styles from './battleScene.module.css';
import { calculatePreAttackStats, calculateFinalStats } from "../logic/statCalculator";
import { characterMap } from "../data/characters";

export function hasPassive(unit, key, ctx, id) {
  return (unit.passives ?? []).some(p =>
    (["startOfTurn", "onAttack"].includes(p.type)) &&
    (!p.condition || p.condition(ctx, id)) &&
    p[key] === true
  );
}

export function getPassiveValue(unit, key, ctx, id) {
  return (unit.passives ?? []).reduce((total, p) => {
    if (
      ["startOfTurn", "onAttack"].includes(p.type) &&
      (!p.condition || p.condition(ctx, id)) &&
      p[key] != null
    ) {
      total += p[key];
    }
    return total;
  }, 0);
}

const typeEmojis = {
  fire: "🔥",
  water: "💧",
  grass: "🌿"
};

export function getTypeAdvantageMultiplier(attacker, defender, ctx) {
  const attackerType = characterMap[attacker.id]?.type ?? attacker.type;
  const defenderType = characterMap[defender.id]?.type ?? defender.type;
  const defenderGuards = hasPassive(defender, "guardsAll", ctx, defender.id);

  const beats = {
    fire: "grass",
    grass: "water",
    water: "fire"
  };

  const isAdvantaged = beats[attackerType] === defenderType;
  const isDisadvantaged = beats[defenderType] === attackerType;

  if (defenderGuards && !isDisadvantaged) {
    return { multiplier: 0.5, label: "🛡️ Guard Activated" };
  }

  if (isAdvantaged) return { multiplier: 1.5, label: "⬆️" };
  if (isDisadvantaged) return { multiplier: 0.5, label: "⬇️" };
  return { multiplier: 1.0, label: "—" };
}


export default function BattleScene() {
  const { preferences } = usePlayerData();
  const stage = stages["1-1"];
  const leaderMultiplier = 5.4;
  const turnLogRef = useRef(null);
  const [isTurnInProgress, setIsTurnInProgress] = useState(false);
  const [superAttackCounts, setSuperAttackCounts] = useState({});

  // Get team 1 from preferences or use default
  const teamIds = preferences?.teams?.[1] || [2, 1];

  // Initialize player team state
  const [playerTeam, setPlayerTeam] = useState(() => {
    return teamIds.map(charId => {
      const unit = characterDetails[charId];
      const type = unit?.type;
      if (!unit) {
        console.error(`Character ${charId} not found in characterDetails`);
        return null;
      }
      const maxHp = Math.floor(unit.baseHp * leaderMultiplier);
      return {
        id: charId,
        ...unit,
        type,
        maxHp,
        currentHp: maxHp
      };
    }).filter(Boolean); // Remove any null entries from invalid character IDs
  });

  // Update team when preferences change
  useEffect(() => {
    const newTeam = teamIds.map(charId => {
      const unit = characterDetails[charId];
      if (!unit) {
        console.error(`Character ${charId} not found in characterDetails`);
        return null;
      }
      const maxHp = Math.floor(unit.baseHp * leaderMultiplier);
      return {
        id: charId,
        ...unit,
        maxHp,
        currentHp: maxHp
      };
    }).filter(Boolean);

    if (newTeam.length > 0) {
      setPlayerTeam(newTeam);
      setActiveUnitIndex(0); // Reset to first unit when team changes
    } else {
      // Fallback if no valid characters found
      const defaultTeam = [1, 2].map(id => {
        const unit = characterDetails[id];
        const maxHp = Math.floor(unit.baseHp * leaderMultiplier);
        return {
          id: charId,
          ...unit,
          maxHp,
          currentHp: maxHp
        };
      });
      setPlayerTeam(defaultTeam);
    }
  }, [teamIds]);

  const [activeUnitIndex, setActiveUnitIndex] = useState(0);
  const [enemyPhaseIndex, setEnemyPhaseIndex] = useState(0);
  const [log, setLog] = useState({});
  const [turn, setTurn] = useState(1);

  useEffect(() => {
    if (turnLogRef.current) {
      turnLogRef.current.scrollTop = turnLogRef.current.scrollHeight;
    }
  }, [log]);

  const currentEnemy = stage.phases[enemyPhaseIndex];

  const [superEffects, setSuperEffects] = useState({});

  const battleContext = {
    turnNow: turn,
    turnEntered: Object.fromEntries(playerTeam.map((_, idx) => [idx + 1, 1])),
    evaded: Object.fromEntries(playerTeam.map((_, idx) => [idx + 1, false])),
    leaderAtkMultiplier: leaderMultiplier,
    leaderDefMultiplier: leaderMultiplier,
    superEffects,
    team: playerTeam,
    superAttackCounts,
  };

  const handleAttack = async (attackerId) => {
    setIsTurnInProgress(true);
    try {
      const attacker = playerTeam[activeUnitIndex];
    const activeUnit = playerTeam[activeUnitIndex];
    
    // Calculate initial defense
    let activeUnitStats = calculatePreAttackStats(activeUnit, battleContext, activeUnit.id);
    
    const attacksThisTurn = currentEnemy.attacks || 1;
    let superAttackUsed = false;
  
    // Process pre-attacks using pre-attack stats
    const preAttackCount = Math.floor(attacksThisTurn / 2);
    for (let i = 0; i < preAttackCount; i++) {
      const isSuper = !superAttackUsed && Math.random() < (currentEnemy.SA ?? 0) / 100;
      // Evasion logic
      const evadeChance = (activeUnit.passives ?? []).reduce((total, p) => {
        if (
          (p.type === "startOfTurn" || p.type === "onAttack") &&
          (!p.condition || p.condition(battleContext, activeUnit.id))
        ) {
          return total + (p.evadeChance ?? 0);
        }
        return total;
      }, 0);

      const evaded = Math.random() < evadeChance;

      if (evaded) {
        setLog(prev => ({
          ...prev,
          [turn]: [
            ...(prev[turn] ?? []),
            `💨 ${activeUnit.name} dodged ${currentEnemy.name}'s ${isSuper ? "Super Attack" : "attack"}!`
          ]
        }));

        battleContext.evaded[activeUnit.id] = true;

        continue; // Skip damage
      }

      const enemyWithId = { ...currentEnemy, id: -1 };
      const { multiplier: typeMultiplier, label: typeLabel } = getTypeAdvantageMultiplier(enemyWithId, activeUnit, battleContext);

      const rawDmg = isSuper ? currentEnemy.SAatk : currentEnemy.atk;
      let baseDamage = rawDmg * typeMultiplier;

      const dmgReduction = getPassiveValue(activeUnit, "damageReduction", battleContext, activeUnit.id);
      baseDamage *= 1 - (dmgReduction ?? 0);

      const reduced = Math.max(0, baseDamage - activeUnitStats.def);
      const variance = 0.99 + Math.random() * 0.01;
      const damage = Math.floor(reduced * variance);

      const updatedTeam = [...playerTeam];
      updatedTeam[activeUnitIndex].currentHp = Math.max(0, activeUnit.currentHp - damage);
      setPlayerTeam(updatedTeam);
      
      if (isSuper) superAttackUsed = true;

      setLog(prev => ({
        ...prev,
        [turn]: [
          ...(prev[turn] ?? []),
          `${isSuper ? "💥 Super Attack! " : "🛡️"}${currentEnemy.name} attacked ${activeUnit.name} ` +
          `[${rawDmg} ATK x ${typeMultiplier} ${typeLabel} - ${activeUnitStats.def} DEF = ${damage} damage] ` +
          `(before your action)`
        ]
      }));
      

      if (updatedTeam[activeUnitIndex].currentHp <= 0) break;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  
    // Player attack
    if (playerTeam[activeUnitIndex].currentHp > 0) {
      // OnAttack boosts for the attack
      const attackStats = calculateFinalStats(activeUnit, battleContext, activeUnit.id);
      const attackerWithStats = {
        ...attacker,
        id: attacker.id,
        baseAtk: attackStats.atk,
        baseDef: attackStats.def
      };

      const enemyWithType = { ...currentEnemy, id: -1 };
      const result = performAttack(attackerWithStats, enemyWithType, battleContext, attackerId);
      setSuperAttackCounts(prev => ({
        ...prev,
        [activeUnit.id]: (prev[activeUnit.id] ?? 0) + 1
      }));
      const superPassives = activeUnit.passives.filter(p => p.type === "superAttack");
    
      setSuperEffects(prev => {
        const existing = prev[activeUnit.id] ?? [];
        const newBuffs = superPassives.map(p => ({
          atkBoost: p.atkBoost ?? 0,
          defBoost: p.defBoost ?? 0,
          expiresOn: turn + (p.turns ?? 1)
        }));
        return {
          ...prev,
          [activeUnit.id]: [...existing, ...newBuffs]
        };
      });
      
      currentEnemy.hp -= result.damage;
      
      // Update activeUnitStats for post-attack defense
      activeUnitStats = calculateFinalStats(playerTeam[activeUnitIndex], battleContext, playerTeam[activeUnitIndex].id);
      
      setLog(prev => ({
        ...prev,
        [turn]: [...(prev[turn] ?? []), `🔹 ${result.description}`]
      }));

      // Additional attack check
      const hasAdditionalAttackPassive = activeUnit.passives.some(p => p.extraAttackChance !== undefined);
      const shouldDoNormalAdditional = hasAdditionalAttackPassive && (!result.guaranteedSuper && !result.extraAttackChance);
      if (hasAdditionalAttackPassive && (result.extraAttackChance || result.guaranteedSuper || shouldDoNormalAdditional)) {
        const addResult = performAttack(attackerWithStats, enemyWithType, battleContext, attackerId, !shouldDoNormalAdditional);
        
        if (!addResult.isNormalAdditional) {
          setSuperAttackCounts(prev => ({
            ...prev,
            [activeUnit.id]: (prev[activeUnit.id] ?? 0) + 1
          }));
          const superPassives = activeUnit.passives.filter(p => p.type === "superAttack");
        
          setSuperEffects(prev => {
            const existing = prev[activeUnit.id] ?? [];
            const newBuffs = superPassives.map(p => ({
              atkBoost: p.atkBoost ?? 0,
              defBoost: p.defBoost ?? 0,
              expiresOn: turn + (p.turns ?? 1)
            }));
            return {
              ...prev,
              [activeUnit.id]: [...existing, ...newBuffs]
            };
          });
        }
        
        if (shouldDoNormalAdditional) {
          addResult.damage = Math.floor(addResult.damage / 10);
          addResult.description = `${attacker.name} did a normal additional for ${addResult.damage} damage`;
        }
        currentEnemy.hp -= addResult.damage;
        setLog(prev => ({
          ...prev,
          [turn]: [...(prev[turn] ?? []), `🔁 Additional Attack: ${addResult.description}`]
        }));
      }

    }
  
    // Process post-attack enemy attacks post super
    if (playerTeam[activeUnitIndex].currentHp > 0) {
      const postAttackCount = attacksThisTurn - preAttackCount;
      for (let i = 0; i < postAttackCount; i++) {
        const isSuper = !superAttackUsed && Math.random() < (currentEnemy.SA ?? 0) / 100;
        // Evasion logic
      const evadeChance = (activeUnit.passives ?? []).reduce((total, p) => {
        if (
          (p.type === "startOfTurn" || p.type === "onAttack") &&
          (!p.condition || p.condition(battleContext, activeUnit.id))
        ) {
          return total + (p.evadeChance ?? 0);
        }
        return total;
      }, 0);

      const evaded = Math.random() < evadeChance;

      if (evaded) {
        setLog(prev => ({
          ...prev,
          [turn]: [
            ...(prev[turn] ?? []),
            `💨 ${activeUnit.name} dodged ${currentEnemy.name}'s ${isSuper ? "Super Attack" : "attack"}!`
          ]
        }));

        battleContext.evaded[activeUnit.id] = true;

        continue;
      }
      const enemyWithId = { ...currentEnemy, id: -1 };
      const { multiplier: typeMultiplier, label: typeLabel } = getTypeAdvantageMultiplier(enemyWithId, activeUnit, battleContext);
      
      const rawDmg = isSuper ? currentEnemy.SAatk : currentEnemy.atk;
      let baseDamage = rawDmg * typeMultiplier;
      
      const dmgReduction = getPassiveValue(activeUnit, "damageReduction", battleContext, activeUnit.id);
      baseDamage *= 1 - (dmgReduction ?? 0);
      
      const reduced = Math.max(0, baseDamage - activeUnitStats.def);
      const variance = 0.99 + Math.random() * 0.01;
      const damage = Math.floor(reduced * variance);
      

        const updatedTeam = [...playerTeam];
        updatedTeam[activeUnitIndex].currentHp = Math.max(0, playerTeam[activeUnitIndex].currentHp - damage);
        setPlayerTeam(updatedTeam);
        
        if (isSuper) superAttackUsed = true;

        setLog(prev => ({
          ...prev,
          [turn]: [
            ...(prev[turn] ?? []),
            `${isSuper ? "💥 Super Attack! " : "🛡️"}${currentEnemy.name} attacked ${activeUnit.name} ` +
            `[${rawDmg} ATK x ${typeMultiplier} ${typeLabel} - ${activeUnitStats.def} DEF = ${damage} dmg] (after your action)`
          ]
        }));
        

        if (updatedTeam[activeUnitIndex].currentHp <= 0) break;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  
    // Handle unit death and switching
    if (playerTeam[activeUnitIndex].currentHp <= 0) {
      // Find next alive unit
      const nextAliveIndex = playerTeam.findIndex((unit, idx) => 
        idx !== activeUnitIndex && unit.currentHp > 0
      );
  
      if (nextAliveIndex >= 0) {
        setActiveUnitIndex(nextAliveIndex);
        setLog(prev => ({
          ...prev,
          [turn]: [
            ...(prev[turn] ?? []),
            `🔄 Switched to ${playerTeam[nextAliveIndex].name}`
          ]
        }));
      } else if (playerTeam.every(unit => unit.currentHp <= 0)) {
        setLog(prev => ({
          ...prev,
          [turn]: [
            ...(prev[turn] ?? []),
            "☠️ All units defeated! You lose!"
          ]
        }));
      }
    }
  
    // Check for phase transition or battle end
    if (currentEnemy.hp <= 0) {
      if (enemyPhaseIndex < stage.phases.length - 1) {
        setLog(prev => ({
          ...prev,
          [turn]: [...(prev[turn] ?? []), `⚔️ Phase changed to ${stage.phases[enemyPhaseIndex + 1].name}`]
        }));
        setEnemyPhaseIndex(prev => prev + 1);
      } else {
        setLog(prev => ({
          ...prev,
          [turn]: [...(prev[turn] ?? []), "🎉 Battle Cleared!"]
        }));
      }
    }
  
    setTurn(prev => prev + 1);
    } finally {
      setIsTurnInProgress(false);
    }

    setSuperEffects(prev => {
      const updated = {};
      for (const id in prev) {
        updated[id] = prev[id].filter(buff => turn + 1 <= buff.expiresOn);
      }
      return updated;
    });
    
    
  };

  const activeChar = characterMap[playerTeam[activeUnitIndex]?.id] || {};
  const activeTypeIcon = typeEmojis[activeChar.type] || "❓";

  return (
    <div className="p-6 bg-zinc-900 text-white rounded-xl">
      <h2 className="text-xl mb-4">{stage.name}</h2>

      {playerTeam.every(unit => unit.currentHp <= 0) && (
        <div className="text-red-500 text-2xl font-bold mb-4">
          ☠️ GAME OVER - All units defeated!
        </div>
      )}

      <div className="mb-4">
        <h3>{typeEmojis[currentEnemy.type] || "❓"}{" "} Enemy: {currentEnemy.name}</h3>
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
          <p className="text-xl font-semibold">{activeTypeIcon} {activeChar.name || 'Loading...'}</p>
          <p>❤️ HP: {playerTeam[activeUnitIndex]?.currentHp || 0} / {playerTeam[activeUnitIndex]?.maxHp || 0}</p>
          <button
            onClick={async () => await handleAttack(playerTeam[activeUnitIndex].id)}
            className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
            disabled={playerTeam[activeUnitIndex]?.currentHp <= 0 || playerTeam.every(unit => unit.currentHp <= 0) || isTurnInProgress }
          >
            {playerTeam[activeUnitIndex]?.currentHp <= 0 ? "Unit Defeated" : isTurnInProgress ? "Processing" : "Attack"}
          </button>
        </div>

        <h4 className="text-md font-bold mt-4">🔁 Switch Character:</h4>
        <div className="flex flex-wrap gap-2 mt-2">
        {playerTeam.map((unit, idx) => {
          const charData = characterMap[unit.id] || {};
          const typeIcon = typeEmojis[charData.type] || "❓";
          const name = charData.name || unit.name;

          return (
            idx !== activeUnitIndex && (
              <button
                key={unit.id}
                onClick={() => setActiveUnitIndex(idx)}
                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded"
                disabled={unit.currentHp <= 0 || isTurnInProgress}
              >
                {unit.currentHp <= 0
                  ? `💀 ${name}`
                  : isTurnInProgress
                  ? "Wait for turn"
                  : `${typeIcon} ${name}`}
              </button>
            )
          );
        })}
        </div>
      </div>
      
      <div ref={turnLogRef} className={styles["turn-log-container"]}>
        <h3 className="text-lg font-bold mb-2">📜 Turn Log</h3>
        {Object.entries(log).map(([turnNum, entries]) => (
          <div key={turnNum} className={styles["turn-log-turn"]}>
            <p className={styles["turn-log-turn-title"]}>🔄 Turn {turnNum}</p>
            <ul>
              {entries.map((entry, idx) => (
                <li key={idx} className={styles["turn-log-entry"]}>{entry}</li>
              ))}
            </ul>
            <hr className="my-2" />
          </div>
        ))}
      </div>
    </div>
  );
}