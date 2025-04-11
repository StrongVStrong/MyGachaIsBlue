import React, { useState, useRef, useEffect } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import characterDetails from "../data/characterDetails";
import stages from "../data/stages";
import { performAttack } from "../logic/battleEngine";
import styles from './battleScene.module.css';
import { calculatePreAttackStats, calculateFinalStats } from "../logic/statCalculator";
import { characterMap } from "../data/characters";
import "./battleScene.css";

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
    return { multiplier: 0.5, label: "🛡️" };
  }

  if (isAdvantaged) return { multiplier: 1.5, label: "⬆️" };
  if (isDisadvantaged) return { multiplier: 0.5, label: "⬇️" };
  return { multiplier: 1.0, label: "➖" };
}


export default function BattleScene({ stageId = "1-1" }) {
  const { preferences } = usePlayerData();
  const stage = stages[stageId] || stages["1-1"];
  const leaderMultiplier = 5.4;
  const turnLogRef = useRef(null);
  const [isTurnInProgress, setIsTurnInProgress] = useState(false);
  const [superAttackCounts, setSuperAttackCounts] = useState({});
  const [hasUsedTurn, setHasUsedTurn] = useState(false);

  // Initialize player team state
  const [playerTeam, setPlayerTeam] = useState(() => {
    const defaultIds = [2, 1];
    return defaultIds.map(charId => {
      const unit = characterDetails[charId];
      if (!unit) {
        console.error(`Character ${charId} not found`);
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
  });

  // Update team when preferences change
  useEffect(() => {
    if (!preferences?.teams) return;
  
    const ids = preferences.teams[1] || [2, 1];
  
    const newTeam = ids.map(charId => {
      const unit = characterDetails[charId];
      if (!unit) {
        console.error(`Character ${charId} not found`);
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
  
    setPlayerTeam(newTeam);
    setActiveUnitIndex(0);
  
  }, [preferences]);
  
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);
  const [enemyPhaseIndex, setEnemyPhaseIndex] = useState(0);
  const [log, setLog] = useState({});
  const [turn, setTurn] = useState(1);
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);
  const [showForfeitPrompt, setShowForfeitPrompt] = useState(false);
  const [showYouLosePopup, setShowYouLosePopup] = useState(false);
  const [showEndButtons, setShowEndButtons] = useState(false);

  useEffect(() => {
    if (turnLogRef.current) {
      turnLogRef.current.scrollTop = turnLogRef.current.scrollHeight;
    }
  }, [log]);

  const [currentStage, setCurrentStage] = useState(() => {
    return structuredClone(stages[stageId] || stages["1-1"]);
  });

  const currentEnemy = currentStage.phases[enemyPhaseIndex];

  const [superEffects, setSuperEffects] = useState({});

  const [switchInTurnMap, setSwitchInTurnMap] = useState({});

  function getBattleContext() {
    return {
      turnNow: turn,
      switchInTurn: switchInTurnMap,
      turnEntered: Object.fromEntries(playerTeam.map(unit => [unit.id, 1])),
      evaded: Object.fromEntries(playerTeam.map(unit => [unit.id, false])),
      leaderAtkMultiplier: leaderMultiplier,
      leaderDefMultiplier: leaderMultiplier,
      superEffects,
      team: playerTeam,
      superAttackCounts
    };
  }

  const handleAttack = async (attackerId) => {
    if (hasUsedTurn || isTurnInProgress) return;
    setIsTurnInProgress(true);
    setHasUsedTurn(true);
    try {
      const attacker = playerTeam[activeUnitIndex];
    const activeUnit = playerTeam[activeUnitIndex];
    
    // Calculate initial defense
    let activeUnitStats = calculatePreAttackStats(activeUnit, getBattleContext(), activeUnit.id);
    
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
          (!p.condition || p.condition(getBattleContext(), activeUnit.id))
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

        getBattleContext().evaded[activeUnit.id] = true;

        continue; // Skip damage
      }

      const enemyWithId = { ...currentEnemy, id: -1 };
      const { multiplier: typeMultiplier, label: typeLabel } = getTypeAdvantageMultiplier(enemyWithId, activeUnit, getBattleContext());

      const rawDmg = isSuper ? currentEnemy.SAatk : currentEnemy.atk;
      let baseDamage = rawDmg * typeMultiplier;

      const dmgReduction = getPassiveValue(activeUnit, "damageReduction", getBattleContext(), activeUnit.id);
      const drLabel = (dmgReduction ?? 0) > 0 ? ` -${Math.round((dmgReduction ?? 0) * 100)}% DR ` : "";
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
          `[${rawDmg} ATK x ${typeMultiplier} ${typeLabel}${drLabel ? " " + drLabel : ""} - ${activeUnitStats.def} DEF = ${damage} damage] ` +
          `(before your action)`
        ]
      }));
      

      if (updatedTeam[activeUnitIndex].currentHp <= 0) break;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  
    // Player attack
    if (playerTeam[activeUnitIndex].currentHp > 0) {
      // OnAttack boosts for the attack
      const attackStats = calculateFinalStats(activeUnit, getBattleContext(), activeUnit.id);
      const attackerWithStats = {
        ...attacker,
        id: attacker.id,
        baseAtk: attackStats.atk,
        baseDef: attackStats.def
      };

      const enemyWithType = { ...currentEnemy, id: -1 };
      const result = performAttack(attackerWithStats, enemyWithType, getBattleContext(), attackerId, true);
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
      activeUnitStats = calculateFinalStats(playerTeam[activeUnitIndex], getBattleContext(), playerTeam[activeUnitIndex].id);
      
      setLog(prev => ({
        ...prev,
        [turn]: [...(prev[turn] ?? []), `🔹 ${result.description}`]
      }));

      // Additional attack check
      const extraAttackPassives = activeUnit.passives.filter(
        p => ["startOfTurn", "onAttack"].includes(p.type) && p.extraAttackChance !== undefined
      );
      
      for (const p of extraAttackPassives) {
        if (!p.condition || p.condition(getBattleContext(), activeUnit.id)) {
          const superChance = p.extraAttackChance;
          const isSuper = Math.random() < superChance;
      
          const addResult = performAttack(attackerWithStats, enemyWithType, getBattleContext(), attackerId, isSuper);
      
          if (isSuper) {
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
      
            setLog(prev => ({
              ...prev,
              [turn]: [...(prev[turn] ?? []), `🔁 Extra Super: ${addResult.description}`]
            }));
          } else {
            addResult.damage = Math.floor(addResult.damage / 10);
            addResult.description = `${attacker.name} did a normal additional for ${addResult.damage} damage`;
      
            setLog(prev => ({
              ...prev,
              [turn]: [...(prev[turn] ?? []), `🔁 Additional Attack: ${addResult.description}`]
            }));
          }
      
          currentEnemy.hp -= addResult.damage;
        }
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
          (!p.condition || p.condition(getBattleContext(), activeUnit.id))
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

        getBattleContext().evaded[activeUnit.id] = true;

        continue;
      }
      const enemyWithId = { ...currentEnemy, id: -1 };
      const { multiplier: typeMultiplier, label: typeLabel } = getTypeAdvantageMultiplier(enemyWithId, activeUnit, getBattleContext());
      
      const rawDmg = isSuper ? currentEnemy.SAatk : currentEnemy.atk;
      let baseDamage = rawDmg * typeMultiplier;
      
      const dmgReduction = getPassiveValue(activeUnit, "damageReduction", getBattleContext(), activeUnit.id);
      const drLabel = (dmgReduction ?? 0) > 0 ? ` -${Math.round((dmgReduction ?? 0) * 100)}% DR ` : "";
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
            `${rawDmg} ATK x ${typeMultiplier} ${typeLabel}${drLabel ? " " + drLabel : ""} - ${activeUnitStats.def} DEF = ${damage} dmg] (after your action)`
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
        const outgoingUnit = playerTeam[activeUnitIndex];
        const incomingUnit = playerTeam[nextAliveIndex];

        const swapBuffs = outgoingUnit.passives?.filter(p => p.type === "onDeath") ?? [];

        setSuperEffects(prev => {
          const existing = prev[incomingUnit.id] ?? [];
          const newBuffs = swapBuffs.map(p => ({
            atkBoost: p.atkBoost ?? 0,
            defBoost: p.defBoost ?? 0,
            expiresOn: turn + (p.turns ?? 1) - 1
          }));
          return {
            ...prev,
            [incomingUnit.id]: [...existing, ...newBuffs]
          };
        });

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
        new Audio("/assets/sfx/failure.mp3").play();
        setShowYouLosePopup(true);
        setTimeout(() => setShowEndButtons(true), 1000);
      }
    }
  
    // Check for phase transition or battle end
    if (currentEnemy.hp <= 0) {
      if (enemyPhaseIndex < currentStage.phases.length - 1) {
        setLog(prev => ({
          ...prev,
          [turn]: [...(prev[turn] ?? []), `⚔️ Phase changed to ${currentStage.phases[enemyPhaseIndex + 1].name}`]
        }));
        setEnemyPhaseIndex(prev => prev + 1);
      } else {
        setLog(prev => ({
          ...prev,
          [turn]: [...(prev[turn] ?? []), "🎉 Battle Cleared!"]
        }));
        onVictory?.();
      }
    }
  
    endTurnCleanup();
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

  function endTurnCleanup() {
    setTurn(prev => prev + 1);
    setHasUsedTurn(false);
    setIsTurnInProgress(false);
  
    setSuperEffects(prev => {
      const updated = {};
      for (const id in prev) {
        updated[id] = prev[id].filter(buff => turn + 1 <= buff.expiresOn);
      }
      return updated;
    });
  }  

  return (
    <div className="battle-container">
      <h2 className="text-xl mb-4">{currentStage.name}</h2>

      {playerTeam.every(unit => unit.currentHp <= 0) && (
        <div className="text-red-500 text-2xl font-bold mb-4">
          ☠️ Game Over - All units defeated!
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
        <h3 className="text-lg font-bold">Active Unit:</h3>
        <div className="p-3 bg-zinc-800 rounded mb-2">
          <p className="text-xl font-semibold">{activeTypeIcon} {activeChar.name || 'Loading...'}</p>
          <p>❤️ HP: {playerTeam[activeUnitIndex]?.currentHp || 0} / {playerTeam[activeUnitIndex]?.maxHp || 0}</p>
          <button
            onClick={async () => {
              setShowSwitchMenu(false);
              await handleAttack(playerTeam[activeUnitIndex].id);
            }}
            className="attack-button"
            disabled={playerTeam[activeUnitIndex]?.currentHp <= 0 || playerTeam.every(unit => unit.currentHp <= 0) || isTurnInProgress }
          >
            {playerTeam[activeUnitIndex]?.currentHp <= 0 ? "Unit Defeated" : isTurnInProgress ? "Processing" : "Attack"}
          </button>
          <button
            className="switch-button"
            disabled={hasUsedTurn || isTurnInProgress}
            onClick={() => setShowSwitchMenu(prev => !prev)}
          >
            {showSwitchMenu ? "Switch" : "Switch"}
          </button>

          <button
            className="switch-button"
            onClick={() => setShowForfeitPrompt(true)}
          >
            Forfeit
          </button>
        </div>

        <h4 className="text-md font-bold mt-4">🔁 Switch Character:</h4>
        {showSwitchMenu && (
        <div className="character-switch-row">
        {playerTeam.map((unit, idx) => {
          const charData = characterMap[unit.id] || {};
          const typeIcon = typeEmojis[charData.type] || "❓";
          const name = charData.name || unit.name;

          return (
            idx !== activeUnitIndex && (
              <button
                key={unit.id}
                onClick={async () => {
                  if (hasUsedTurn || isTurnInProgress) return;
                  setShowSwitchMenu(false);
                  const outgoingUnit = playerTeam[activeUnitIndex];
                  const incomingUnit = playerTeam[idx];
                  const swapBuffs = outgoingUnit.passives?.filter(p => p.type === "onSwitchOut") ?? [];
                
                  setHasUsedTurn(true);
                  setIsTurnInProgress(true);

                  const newBuffs = swapBuffs.map(p => ({
                    atkBoost: p.atkBoost ?? 0,
                    defBoost: p.defBoost ?? 0,
                    expiresOn: turn + (p.turns ?? 1) - 1
                  }));
                  
                  // Immediately apply buffs to context
                  const simulatedEffects = {
                    ...superEffects,
                    [incomingUnit.id]: [...(superEffects[incomingUnit.id] ?? []), ...newBuffs]
                  };
                  
                  const simulatedCtx = {
                    ...getBattleContext(),
                    superEffects: simulatedEffects
                  };
                  
                  let activeUnitStats = calculatePreAttackStats(incomingUnit, simulatedCtx, incomingUnit.id);
                  
                  // Commit the buff to state
                  setSuperEffects(simulatedEffects);
              
                  setActiveUnitIndex(idx);

                  setSwitchInTurnMap(prev => ({
                    ...prev,
                    [incomingUnit.id]: turn
                  }));
                
                  const logMessages = [`🔁 Switched to ${incomingUnit.name}`];
                  if (swapBuffs.length > 0) {
                    const effectDescriptions = swapBuffs.map(p => p.description || `+${(p.defBoost ?? 0) * 100}% DEF`).join(", ");
                    logMessages.push(`✨ Gained Buffs: ${effectDescriptions}`);
                  }
                
                  setLog(prev => ({
                    ...prev,
                    [turn]: [...(prev[turn] ?? []), ...logMessages]
                  }));
                
                  // simulate enemy phase after switch
                  const currentEnemy = currentStage.phases[enemyPhaseIndex];
                  const activeUnit = incomingUnit;
                  const attacksThisTurn = currentEnemy.attacks || 1;
                
                  for (let i = 0; i < attacksThisTurn; i++) {
                    const isSuper = Math.random() < (currentEnemy.SA ?? 0) / 100;
                    const evadeChance = (activeUnit.passives ?? []).reduce((total, p) => {
                      if ((p.type === "startOfTurn" || p.type === "onAttack") && (!p.condition || p.condition(getBattleContext(), activeUnit.id))) {
                        return total + (p.evadeChance ?? 0);
                      }
                      return total;
                    }, 0);
                
                    const evaded = Math.random() < evadeChance;
                    if (evaded) {
                      setLog(prev => ({
                        ...prev,
                        [turn]: [...(prev[turn] ?? []), `💨 ${activeUnit.name} dodged ${currentEnemy.name}'s ${isSuper ? "Super Attack" : "attack"}!`]
                      }));
                      continue;
                    }
                
                    const { multiplier: typeMultiplier, label: typeLabel } = getTypeAdvantageMultiplier(currentEnemy, activeUnit, getBattleContext());
                    const rawDmg = isSuper ? currentEnemy.SAatk : currentEnemy.atk;
                    let baseDamage = rawDmg * typeMultiplier;
                    const dmgReduction = getPassiveValue(activeUnit, "damageReduction", getBattleContext(), activeUnit.id);
                    const drLabel = (dmgReduction ?? 0) > 0 ? ` -${Math.round((dmgReduction ?? 0) * 100)}% DR ` : "";
                    baseDamage *= 1 - (dmgReduction ?? 0);
                    const reduced = Math.max(0, baseDamage - activeUnitStats.def);
                    const variance = 0.99 + Math.random() * 0.01;
                    const damage = Math.floor(reduced * variance);
                
                    const updatedTeam = [...playerTeam];
                    updatedTeam[idx].currentHp = Math.max(0, updatedTeam[idx].currentHp - damage);
                    setPlayerTeam(updatedTeam);
                
                    setLog(prev => ({
                      ...prev,
                      [turn]: [
                        ...(prev[turn] ?? []),
                        `${isSuper ? "💥 Super Attack! " : "🛡️"}${currentEnemy.name} attacked ${activeUnit.name} ` +
                        `[${rawDmg} ATK x ${typeMultiplier} ${typeLabel}${drLabel ? " " + drLabel : ""} - ${activeUnitStats.def} DEF = ${damage} damage] (after switch)`
                      ]
                    }));
                    await new Promise(resolve => setTimeout(resolve, 500));
                  }
                
                  // End turn after switch
                  endTurnCleanup();

                }}                
                
                className="switch-button"
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
        )}
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

      {(showForfeitPrompt || showYouLosePopup) && <div className="backdrop-dim" />}

      {showForfeitPrompt && (
        <div className="forfeit-popup">
          <h2>Are you sure you want to give up?</h2>
          <div className="forfeit-actions">
            <button onClick={() => {
              new Audio("/.assets/sfx/failure.mp3").play();
              setShowForfeitPrompt(false);
              setShowYouLosePopup(true);
              setTimeout(() => setShowEndButtons(true), 1000);
            }}>Yes</button>
            <button onClick={() => setShowForfeitPrompt(false)}>No</button>
          </div>
        </div>
      )}

      {showYouLosePopup && (
        <div className="forfeit-popup">
          <h1 className="you-lose-text">☠️ YOU LOSE ☠️</h1>
          {showEndButtons && (
            <div className="forfeit-actions">
              <button onClick={() => window.location.href = "/#/stages"}>Return</button>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}