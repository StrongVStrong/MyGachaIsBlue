import React, { useState, useRef, useEffect } from "react";
import { usePlayerData } from "../hooks/usePlayerData";
import characterDetails from "../data/characterDetails";
import stages from "../data/stages";
import { performAttack } from "../logic/battleEngine";
import styles from './battleScene.module.css';
import { calculatePreAttackStats, calculateFinalStats } from "../logic/statCalculator";
import { characterMap } from "../data/characters";
import { useLocation } from "react-router-dom";
import { useSyncedAudio } from "../hooks/useSyncedAudio";
import { useClickSFX } from "../hooks/useClickSFX";
import { traitEffects } from "../utils/RerollTraits";
import "./battleScene.css";

export function hasPassive(unit, key, ctx, id, allowedTypes = ["startOfTurn", "onAttack"]) {
  return (unit.passives ?? []).some(p =>
    allowedTypes.includes(p.type) &&
    (!p.condition || p.condition(ctx, id)) &&
    p[key] === true
  );
}

export function getPassiveValue(unit, key, ctx, id, allowedTypes = ["startOfTurn", "onAttack"]) {
  return (unit.passives ?? []).reduce((total, p) => {
    if (
      allowedTypes.includes(p.type) &&
      (!p.condition || p.condition(ctx, id)) &&
      p[key] != null
    ) {
      total += p[key];
    }
    return total;
  }, 0);
}


function getValueFromTrait(unitId, key, characters) {
  const traitName = characters?.[unitId]?.trait;
  return traitName && traitEffects[traitName]?.[key] || 0;
}

const typeEmojis = {
  fire: "🔥",
  water: "💧",
  grass: "🌿"
};

export function getTypeAdvantageMultiplier(attacker, defender, ctx, characters, timing = "both") {
  const attackerType = characterMap[attacker.id]?.type ?? attacker.type;
  const defenderType = characterMap[defender.id]?.type ?? defender.type;
  const guardsStart = hasPassive(defender, "guardsAll", ctx, defender.id, ["startOfTurn"]);
  const guardsAttack = hasPassive(defender, "guardsAll", ctx, defender.id, ["onAttack"]);

  const beats = {
    fire: "grass",
    grass: "water",
    water: "fire"
  };

  const isAdvantaged = beats[attackerType] === defenderType;
  const isDisadvantaged = beats[defenderType] === attackerType;

  let guardActive = false;
  if (timing === "startOfTurn") guardActive = guardsStart;
  else if (timing === "onAttack") guardActive = guardsAttack;
  else guardActive = guardsStart || guardsAttack;

  const traitGuardChance = getValueFromTrait(defender.id, "guardsAll", characters);
  const traitGuards = typeof traitGuardChance === "number" && Math.random() < traitGuardChance;
  guardActive ||= traitGuards;

  if (guardActive && !isDisadvantaged) {
    return { multiplier: 0.5, label: "🛡️" };
  }

  if (isAdvantaged) return { multiplier: 1.5, label: "⬆️" };
  if (isDisadvantaged) return { multiplier: 0.5, label: "⬇️" };
  return { multiplier: 1.0, label: "➖" };
}


export default function BattleScene({ stageId = "1-1" }) {
  const {
    preferences,
    characters,
    setGems,
    setPlayerExp,
    setCurrency,
    setPlayerData,
    playerData
  } = usePlayerData();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const storedTeamId = Number(localStorage.getItem("selectedTeamId"));
  const selectedTeamId = Number(params.get("team")) || storedTeamId || 1;
  const stage = stages[stageId] || stages["1-1"];
  const leaderMultiplier = 5.4;
  const turnLogRef = useRef(null);
  const [isTurnInProgress, setIsTurnInProgress] = useState(false);
  const [superAttackCounts, setSuperAttackCounts] = useState({});
  const [hasUsedTurn, setHasUsedTurn] = useState(false);
  const playClick = useClickSFX();

  // Initialize player team state
  const [playerTeam, setPlayerTeam] = useState(() => {
    const defaultIds = [1];
    return defaultIds.map(charId => {
      const unit = characterDetails[charId];
      if (!unit) {
        console.error(`Character ${charId} not found`);
        return null;
      }
      const limitBreakLevel = characters?.[charId]?.limitBreak || 0;
      // Calculate stats with limit break bonuses
      const maxHp = Math.floor((unit.baseHp + (limitBreakLevel * 500)) * leaderMultiplier);
      const baseAtk = unit.baseAtk + (limitBreakLevel * 500);
      const baseDef = unit.baseDef + (limitBreakLevel * 500);
      return {
        id: charId,
        ...unit,
        maxHp,
        currentHp: maxHp,
        baseAtk,
        baseDef
      };
    }).filter(Boolean);
  });

  // Update team when preferences change
  useEffect(() => {
    if (!preferences?.teams) return;
  
    const ids = preferences.teams[selectedTeamId] || [1];
  
    const newTeam = ids.map(charId => {
      const unit = characterDetails[charId];
      if (!unit) {
        console.error(`Character ${charId} not found`);
        return null;
      }
      const limitBreakLevel = characters?.[charId]?.limitBreak || 0;
      // Calculate stats with limit break bonuses
      const maxHp = Math.floor((unit.baseHp + (limitBreakLevel * 500)) * leaderMultiplier);
      const baseAtk = unit.baseAtk + (limitBreakLevel * 500);
      const baseDef = unit.baseDef + (limitBreakLevel * 500);
      return {
        id: charId,
        ...unit,
        maxHp,
        currentHp: maxHp,
        baseAtk,
        baseDef
      };
    }).filter(Boolean);
  
    setPlayerTeam(newTeam);
    setActiveUnitIndex(0);

  }, [preferences, selectedTeamId, characters]);
  
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);
  const [enemyPhaseIndex, setEnemyPhaseIndex] = useState(0);
  const [log, setLog] = useState({});
  const [turn, setTurn] = useState(1);
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);
  const [showForfeitPrompt, setShowForfeitPrompt] = useState(false);
  const [showYouLosePopup, setShowYouLosePopup] = useState(false);
  const [showEndButtons, setShowEndButtons] = useState(false);
  const [showVictoryPopup, setShowVictoryPopup] = useState(false);
  const [earnedRewards, setEarnedRewards] = useState(null);

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

  const audioRef = useRef(null);
  const bgm = currentEnemy.bgm || "/assets/OSTs/default.mp3";
  useSyncedAudio(audioRef, bgm);

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
    let activeUnitStats = calculatePreAttackStats(activeUnit, getBattleContext(), activeUnit.id, characters);
    
    const attacksThisTurn = currentEnemy.attacks || 1;
    let superAttackUsed = false;
  
    // Process pre-attacks using pre-attack stats
    const preAttackCount = Math.floor(attacksThisTurn / 2);
    for (let i = 0; i < preAttackCount; i++) {
      const isSuper = !superAttackUsed && Math.random() < (currentEnemy.SA ?? 0) / 100;
      // Evasion logic
      const evadeChance = (activeUnit.passives ?? []).reduce((total, p) => {
        if (
          p.type === "startOfTurn" &&
          (!p.condition || p.condition(getBattleContext(), activeUnit.id))
        ) {
          return total + (p.evadeChance ?? 0);
        }
        return total;
      }, 0);

      let evaded = Math.random() < evadeChance;

      if (!evaded) {
        evaded = Math.random() < getValueFromTrait(activeUnit.id, "evadeChance", characters);
      }

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
      const { multiplier: typeMultiplier, label: typeLabel } = getTypeAdvantageMultiplier(enemyWithId, activeUnit, getBattleContext(), characters, "startOfTurn");

      const rawDmg = isSuper ? currentEnemy.SAatk : currentEnemy.atk;
      let baseDamage = rawDmg * typeMultiplier;

      let drBefore = getPassiveValue(activeUnit, "damageReduction", getBattleContext(), activeUnit.id, ["startOfTurn"]);
      const traitDR = getValueFromTrait(activeUnit.id, "damageReduction", characters);
      drBefore += traitDR;
      const drLabel = (drBefore ?? 0) > 0 ? ` -${Math.round((drBefore ?? 0) * 100)}% DR ` : "";
      baseDamage *= 1 - (drBefore ?? 0);

      const traitDefBoost = getValueFromTrait(activeUnit.id, "defBoost", characters);
      const boostedDef = activeUnitStats.def * (1 + traitDefBoost);
      const reduced = Math.max(0, baseDamage - boostedDef);
      const variance = 0.99 + Math.random() * 0.01;
      let damage = Math.floor(reduced * variance);
      if (damage === 0) {
        damage = Math.floor(Math.random() * 96) + 5;
      }

      const updatedTeam = [...playerTeam];
      updatedTeam[activeUnitIndex].currentHp = Math.max(0, activeUnit.currentHp - damage);
      setPlayerTeam(updatedTeam);
      
      if (isSuper) superAttackUsed = true;

      setLog(prev => ({
        ...prev,
        [turn]: [
          ...(prev[turn] ?? []),
          `${isSuper ? "💥 Super Attack! " : "🛡️"}${currentEnemy.name} attacked ${activeUnit.name} ` +
          `[${rawDmg} ATK x ${typeMultiplier} ${typeLabel}${drLabel ? " " + drLabel : ""} - ${Math.floor(boostedDef)} DEF = ${damage} damage] ` +
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
      const result = performAttack(attackerWithStats, enemyWithType, getBattleContext(), attackerId, true, characters, traitEffects);
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

      const updatedCtx = {
        ...getBattleContext(),
        superEffects: {
          ...superEffects,
          [activeUnit.id]: [
            ...(superEffects[activeUnit.id] ?? []),
            ...superPassives.map(p => ({
              atkBoost: p.atkBoost ?? 0,
              defBoost: p.defBoost ?? 0,
              expiresOn: turn + (p.turns ?? 1)
            }))
          ]
        }
      };
      
      currentEnemy.hp = Math.max(0, currentEnemy.hp - result.damage);
      
      // Update activeUnitStats for post-attack defense
      activeUnitStats = calculateFinalStats(playerTeam[activeUnitIndex], updatedCtx, playerTeam[activeUnitIndex].id);

      let extraMsg = "";
      if (result.traitCrit) extraMsg = " 💠 (Trait Activated)";
      setLog(prev => ({
        ...prev,
        [turn]: [...(prev[turn] ?? []), `🔹 ${result.description}${extraMsg}`]
      }));

      // Additional attack check
      const extraAttackPassives = activeUnit.passives.filter(
        p => ["startOfTurn", "onAttack"].includes(p.type) && p.extraAttackChance !== undefined
      );
      
      for (const p of extraAttackPassives) {
        if (!p.condition || p.condition(getBattleContext(), activeUnit.id)) {
          const superChance = p.extraAttackChance;
          const isSuper = Math.random() < superChance;
      
          const addResult = performAttack(attackerWithStats, enemyWithType, getBattleContext(), attackerId, isSuper, characters, traitEffects);
      
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
      
          currentEnemy.hp = Math.max(0, currentEnemy.hp - result.damage);
        }
      }
      
      const traitExtraChance = getValueFromTrait(activeUnit.id, "extraAttackChance", characters);
      if (Math.random() < traitExtraChance) {
        const addResult = performAttack(attackerWithStats, enemyWithType, getBattleContext(), attackerId, true, characters, traitEffects);

        setSuperAttackCounts(prev => ({
          ...prev,
          [activeUnit.id]: (prev[activeUnit.id] ?? 0) + 1
        }));

        setLog(prev => ({
          ...prev,
          [turn]: [...(prev[turn] ?? []), `💠 Trait Extra Super: ${addResult.description}`]
        }));

        currentEnemy.hp = Math.max(0, currentEnemy.hp - addResult.damage);
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
          p.type === "onAttack" &&
          (!p.condition || p.condition(getBattleContext(), activeUnit.id))
        ) {
          return total + (p.evadeChance ?? 0);
        }
        return total;
      }, 0);

      let evaded = Math.random() < evadeChance;

      if (!evaded) {
        evaded = Math.random() < getValueFromTrait(activeUnit.id, "evadeChance", characters);
      }

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
      const { multiplier: typeMultiplier, label: typeLabel } = getTypeAdvantageMultiplier(enemyWithId, activeUnit, getBattleContext(), characters, "onAttack");
      
      const rawDmg = isSuper ? currentEnemy.SAatk : currentEnemy.atk;
      let baseDamage = rawDmg * typeMultiplier;
      
      let dmgReduction = getPassiveValue(activeUnit, "damageReduction", getBattleContext(), activeUnit.id);
      const traitDR = getValueFromTrait(activeUnit.id, "damageReduction", characters);
      dmgReduction += traitDR;
      const drLabel = (dmgReduction ?? 0) > 0 ? ` -${Math.round((dmgReduction ?? 0) * 100)}% DR ` : "";
      baseDamage *= 1 - (dmgReduction ?? 0);
      
      const traitDefBoost = getValueFromTrait(activeUnit.id, "defBoost", characters);
      const boostedDef = activeUnitStats.def * (1 + traitDefBoost);
      const reduced = Math.max(0, baseDamage - boostedDef);
      const variance = 0.99 + Math.random() * 0.01;
      let damage = Math.floor(reduced * variance);
      if (damage === 0) {
        damage = Math.floor(Math.random() * 96) + 5;
      }
      

        const updatedTeam = [...playerTeam];
        updatedTeam[activeUnitIndex].currentHp = Math.max(0, playerTeam[activeUnitIndex].currentHp - damage);
        setPlayerTeam(updatedTeam);
        
        if (isSuper) superAttackUsed = true;

        setLog(prev => ({
          ...prev,
          [turn]: [
            ...(prev[turn] ?? []),
            `${isSuper ? "💥 Super Attack! " : "🛡️"}${currentEnemy.name} attacked ${activeUnit.name} ` +
            `${rawDmg} ATK x ${typeMultiplier} ${typeLabel}${drLabel ? " " + drLabel : ""} - ${Math.floor(boostedDef)} DEF = ${damage} dmg] (after your action)`
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
      const stageCleared = playerData?.clearedStages?.[stageId];
      const rewards = stageCleared ? currentStage.repeatRewards : currentStage.rewards;
      const earned = { gems: 0, exp: 0 };
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
        if (rewards?.gems) {
          setGems(prev => prev + rewards.gems);
          earned.gems = rewards.gems;
        }
        if (rewards?.exp) {
          setPlayerExp(prev => prev + rewards.exp);
          earned.exp = rewards.exp;
        }
        if (rewards?.gold) {
          setCurrency(prev => ({ ...prev, gold: (prev.gold || 0) + rewards.gold }));
          earned.gold = rewards.gold;
        }
        if (rewards?.traitRerolls) {
          setCurrency(prev => ({ ...prev, traitRerolls: (prev.traitRerolls || 0) + rewards.traitRerolls }));
          earned.traitRerolls = rewards.traitRerolls;
        }
      
        if (!stageCleared) {
          setPlayerData(prev => ({
            ...prev,
            clearedStages: {
              ...prev.clearedStages,
              [stageId]: true
            }
          }));
        }
      
        setEarnedRewards({
          ...rewards,
          type: stageCleared ? "Replay" : "First-Time"
        });
        setShowVictoryPopup(true);        
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

  function handleNextStage() {
    const [chapter, stageNum] = stageId.split("-").map(Number);
    let nextStageId;
  
    if (chapter === 5 && stageNum === 5) {
      localStorage.removeItem("selectedTeamId");
      window.location.href = "/#/stages";
    } else if (stageNum === 5) {
      nextStageId = `${chapter + 1}-1`;
    } else {
      nextStageId = `${chapter}-${stageNum + 1}`;
    }
    window.location.href = `/#/battle/${nextStageId}`;
    setTimeout(() => window.location.reload(), 100);
  }
  

  return (
    <div className="battle-container">
      <h5 className="text-xl mb-4">{currentStage.name}</h5>

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
          <h3>Actions</h3>
          <div className="action-button-group">
            <button
              onClick={async () => {
                playClick();
                setShowSwitchMenu(false);
                await handleAttack(playerTeam[activeUnitIndex].id);
              }}
              className="attack-button"
              disabled={playerTeam[activeUnitIndex]?.currentHp <= 0 || playerTeam.every(unit => unit.currentHp <= 0) || isTurnInProgress || showVictoryPopup }
            >
              {playerTeam[activeUnitIndex]?.currentHp <= 0 ? "Unit Defeated" : isTurnInProgress ? "Processing" : "Attack"}
            </button>
            <button
              className="switch-button"
              disabled={hasUsedTurn || isTurnInProgress || showVictoryPopup}
              onClick={() => {
                if (playerTeam.length <= 1) {
                  new Audio("./assets/sfx/failure.mp3").play();
                  return;
                }
                playClick();
                setShowSwitchMenu(prev => !prev)
              }
              }
            >
              {showSwitchMenu ? "Switch" : "Switch"}
            </button>

            <button
              className="switch-button"
              disabled={hasUsedTurn || isTurnInProgress || showVictoryPopup}
              onClick={() => {
                playClick();
                setShowForfeitPrompt(true)
              }
              }
            >
              Forfeit
            </button>
          </div>
        </div>

        
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
                  playClick();
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
                      if ((p.type === "startOfTurn") && (!p.condition || p.condition(getBattleContext(), activeUnit.id))) {
                        return total + (p.evadeChance ?? 0);
                      }
                      return total;
                    }, 0);
                
                    let evaded = Math.random() < evadeChance;
                    if (!evaded) {
                      evaded = Math.random() < getValueFromTrait(activeUnit.id, "evadeChance", characters);
                    }
                    if (evaded) {
                      setLog(prev => ({
                        ...prev,
                        [turn]: [...(prev[turn] ?? []), `💨 ${activeUnit.name} dodged ${currentEnemy.name}'s ${isSuper ? "Super Attack" : "attack"}!`]
                      }));
                      continue;
                    }
                
                    const { multiplier: typeMultiplier, label: typeLabel } = getTypeAdvantageMultiplier(currentEnemy, activeUnit, getBattleContext(), characters, "startOfTurn");
                    const rawDmg = isSuper ? currentEnemy.SAatk : currentEnemy.atk;
                    let baseDamage = rawDmg * typeMultiplier;
                    const dmgReduction = getPassiveValue(activeUnit, "damageReduction", getBattleContext(), activeUnit.id);
                    const drLabel = (dmgReduction ?? 0) > 0 ? ` -${Math.round((dmgReduction ?? 0) * 100)}% DR ` : "";
                    baseDamage *= 1 - (dmgReduction ?? 0);
                    const traitDefBoost = getValueFromTrait(activeUnit.id, "defBoost", characters);
                    const boostedDef = activeUnitStats.def * (1 + traitDefBoost);
                    const reduced = Math.max(0, baseDamage - boostedDef);
                    const variance = 0.99 + Math.random() * 0.01;
                    let damage = Math.floor(reduced * variance);
                    if (damage === 0) {
                      damage = Math.floor(Math.random() * 96) + 5;
                    }
                    const updatedTeam = [...playerTeam];
                    updatedTeam[idx].currentHp = Math.max(0, updatedTeam[idx].currentHp - damage);
                    setPlayerTeam(updatedTeam);
                
                    setLog(prev => ({
                      ...prev,
                      [turn]: [
                        ...(prev[turn] ?? []),
                        `${isSuper ? "💥 Super Attack! " : "🛡️"}${currentEnemy.name} attacked ${activeUnit.name} ` +
                        `[${rawDmg} ATK x ${typeMultiplier} ${typeLabel}${drLabel ? " " + drLabel : ""} - ${Math.floor(boostedDef)} DEF = ${damage} damage] (after switch)`
                      ]
                    }));
                    await new Promise(resolve => setTimeout(resolve, 500));
                  }
                
                  // End turn after switch
                  endTurnCleanup();

                }}                
                
                className="switch-button"
                disabled={unit.currentHp <= 0 || isTurnInProgress || showVictoryPopup}
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
      
      {Object.keys(log).length > 0 && (
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
      )}

      {showVictoryPopup && (
        <div className="forfeit-popup">
          <h1 className="you-lose-text">🎉 VICTORY 🎉</h1>
          {earnedRewards && (
            <div className="reward-summary">
              <p>🎁 <strong>{earnedRewards.type} Rewards:</strong></p>
              <div className="reward-lines">
                {Object.entries(earnedRewards)
                  .filter(([key]) => key !== "type")
                  .map(([key, val]) => (
                    <div key={key}>+{val} {key}</div>
                ))}
              </div>
            </div>
          )}

          <div className="forfeit-actions">
            <button onClick={() => { playClick(); handleNextStage(); }}>Next Stage</button>
            <button onClick={() => { playClick(); window.location.reload(); }}>Retry</button>
            <button onClick={() => {
              playClick();
              localStorage.removeItem("selectedTeamId");
              window.location.href = "/#/stages";
            }}>Return</button>
          </div>
        </div>
      )}

      {(showForfeitPrompt || showYouLosePopup || showVictoryPopup) && <div className="backdrop-dim" />}

      {showForfeitPrompt && (
        <div className="forfeit-popup">
          <h5>Are you sure you want to give up?</h5>
          <div className="forfeit-actions">
            <button onClick={() => {
              new Audio("./assets/sfx/failure.mp3").play();
              setShowForfeitPrompt(false);
              setShowYouLosePopup(true);
              setTimeout(() => setShowEndButtons(true), 1000);
            }}>Yes</button>
            <button onClick={() => { playClick(); setShowForfeitPrompt(false); }}>No</button>
          </div>
        </div>
      )}

      {showYouLosePopup && (
        <div className="forfeit-popup">
          <h1 className="you-lose-text">☠️ YOU LOSE ☠️</h1>
          {showEndButtons && (
            <div className="forfeit-actions">
              <button onClick={() => { playClick(); window.location.href = "/#/stages"; }}>Return</button>
              <button onClick={() => { playClick(); window.location.reload(); }}>Retry</button>
            </div>
          )}
        </div>
      )}
      <audio ref={audioRef} className={showYouLosePopup ? "muffled-audio" : ""} loop autoPlay>
        <source src={bgm} type="audio/mpeg" />
      </audio>
    </div>
  );
}