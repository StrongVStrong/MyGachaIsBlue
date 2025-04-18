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
      const value = typeof p[key] === "function" ? p[key](ctx, id) : p[key];
      total += value;
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
  const guardsAttack = hasPassive(defender, "guardsAll", ctx, defender.id, ["onAttack", "startOfTurn"]);

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

function shouldEnemySuper({ currentEnemy, isPrePhase, superUsed, attackIndex, attackSplit }) {
  const totalAttacks = currentEnemy.attacks || 1;
  const saChance = (currentEnemy.SA ?? 0) / 100;
  const saCount = currentEnemy.saCount ?? Infinity;
  const guaranteedFallback = currentEnemy.guaranteedSuper !== false;
  const isPre = currentEnemy.preSuper === true;
  const isPost = currentEnemy.postSuper === true;

  const validTiming =
    (!isPre && !isPost) ||
    (isPre && isPrePhase) ||
    (isPost && !isPrePhase);

  if (!validTiming) return false;
  if (superUsed >= saCount) return false;

  const { pre: preCount, post: postCount } = attackSplit;

  const isLastAttack = isPrePhase
    ? attackIndex === preCount - 1
    : attackIndex === postCount - 1;

  if (Math.random() < saChance) return true;
  if (isLastAttack && guaranteedFallback && superUsed < saCount) return true;

  return false;
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
  const [animationInProgress, setAnimationInProgress] = useState(false);
  const playClick = useClickSFX();

  // Initialize player team state
  const [playerTeam, setPlayerTeam] = useState(() => {
    const defaultIds = preferences?.teams?.[selectedTeamId] || [1];
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
    setSwitchInTurnMap(prev => {
      const updated = { ...prev };
      newTeam.forEach(unit => {
        if (!(unit.id in updated)) {
          updated[unit.id] = turn;
        }
      });
      return updated;
    });
    switchInTurnRef.current = {
      ...switchInTurnRef.current,
      ...newTeam.reduce((acc, unit) => {
        if (!(unit.id in switchInTurnRef.current)) {
          acc[unit.id] = turn;
        }
        return acc;
      }, {})
    };
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
  const [preAttackCount, setPreAttackCount] = useState(0);
  const [attackSplit, setAttackSplit] = useState({ pre: 0, post: 0 });

  useEffect(() => {
    if (turnLogRef.current) {
      turnLogRef.current.scrollTop = turnLogRef.current.scrollHeight;
    }
  }, [log]);

  const [currentStage, setCurrentStage] = useState(() => {
    const cloned = structuredClone(stages[stageId] || stages["1-1"]);
    cloned.phases.forEach(p => {
      if (!p.maxHp) p.maxHp = p.hp;
    });
    return cloned;
  });
  

  const currentEnemy = currentStage.phases[enemyPhaseIndex];

  const [superEffects, setSuperEffects] = useState({});

  const [switchInTurnMap, setSwitchInTurnMap] = useState({});
  const switchInTurnRef = useRef({});


  const audioRef = useRef(null);
  const bgm = currentEnemy.bgm || "./assets/OSTs/default.mp3";
  useSyncedAudio(audioRef, bgm);

  function getBarColor(index, total) {
    const colors = [
      '#b30000',
      '#cc5200',
      '#ffcc00',
      '#66cc66',
      '#007f00'
    ];    
    return colors[index % colors.length];
  }

  function playAttackAnimation(type = "enemy", isSuper = false, videoSrc = null) {
    return new Promise(resolve => {
      setAnimationInProgress(true);
  
      if (isSuper && videoSrc) {
        const video = document.createElement("video");
        video.src = videoSrc;
        video.autoplay = true;
        video.onended = () => {
          video.remove();
          setAnimationInProgress(false);
          resolve();
        };
        video.className = "super-attack-video";
        const wrapper = document.querySelector(".portrait-combo-wrapper");
        if (!wrapper) return resolve();
        wrapper.appendChild(video);
      } else {
        const el = document.querySelector(type === "enemy" ? ".enemy-portrait-wrapper" : ".active-unit-portrait");
        if (!el) return resolve();
        el.classList.remove(`${type}-attack-anim`);
        void el.offsetWidth;

        el.classList.add(`${type}-attack-anim`);
        setTimeout(() => {
          el.classList.remove(`${type}-attack-anim`);
          setAnimationInProgress(false);
          resolve();
        }, 600);
      }
    });
  }

  function HealthBar({ bars }) {
    return (
      <div className="enemy-health-container">
        <div className="health-bars-wrapper">
          {bars.map((bar, index) => (
            <div
              key={index}
              className={`health-bar ${bar.active ? 'active' : ''}`}
              style={{
                backgroundColor: bar.color,
                width: `${(bar.hp / bar.maxHp) * 100}%`,
                display: bar.hp > 0 ? 'block' : 'none',
                opacity: bar.active ? 1 : 0.7
              }}
            >
              <div className="health-bar-fill" style={{ width: '100%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  const totalBars = 5;

  const getEnemyHealthBars = () => {
    const maxHp = currentEnemy.maxHp;
    const currentHp = currentEnemy.hp;
    const barHp = Math.floor(maxHp / totalBars);
    const bars = [];

    for (let i = 0; i < totalBars; i++) {
      const start = i * barHp;
      const end = start + barHp;
      const barMax = (i === totalBars - 1) ? maxHp - (barHp * (totalBars - 1)) : barHp;

      const remainingInBar = Math.max(0, Math.min(barHp, currentHp - start));
      bars.push({
        hp: remainingInBar,
        maxHp: barMax,
        color: getBarColor(i, totalBars),
        active: currentHp >= start && currentHp < end
      });
    }

    return bars;
  };


  function getBattleContext() {
    return {
      turnNow: turn,
      switchInTurn: switchInTurnRef.current,
      turnEntered: {
        ...playerTeam.reduce((acc, unit) => {
          acc[unit.id] = switchInTurnRef.current[unit.id] ?? 1;
          return acc;
        }, {})
      },
      evaded: Object.fromEntries(playerTeam.map(unit => [unit.id, false])),
      leaderAtkMultiplier: leaderMultiplier,
      leaderDefMultiplier: leaderMultiplier,
      superEffects,
      team: playerTeam,
      superAttackCounts
    };
  }


  function getUpdatedContextWithSuperBuffs(unit, superPassives, turn, superEffects) {
    const newBuffs = superPassives.map(p => ({
      atkBoost: p.atkBoost ?? 0,
      defBoost: p.defBoost ?? 0,
      expiresOn: turn + (p.turns ?? 1) - 1
    }));
  
    const updatedEffects = {
      ...superEffects,
      [unit.id]: [
        ...(superEffects[unit.id] ?? []),
        ...newBuffs
      ]
    };
  
    const ctx = {
      ...getBattleContext(),
      superEffects: updatedEffects
    };
  
    return { updatedEffects, ctx };
  }
  
  function formatAndColorDamage(text) {
    const isCrit = /CRIT!?/i.test(text);
    const isDisadvantage = /⬇️/.test(text);
    const isNeutral = /⬆️|➖/.test(text);
  
    return text.split(/(\d{3,})/g).map((part, idx) => {
      if (/^\d{3,}$/.test(part)) {
        const className = isCrit
          ? "crit-damage"
          : isDisadvantage
          ? "damage-disadvantage"
          : isNeutral
          ? "damage-neutral"
          : "damage-regular";
        return (
          <strong key={idx} className={className}>
            {Number(part).toLocaleString()}
          </strong>
        );
      }
      return part;
    });
  }  

  const handleAttack = async (attackerId) => {
    if (hasUsedTurn || isTurnInProgress) return;
    setIsTurnInProgress(true);
    setHasUsedTurn(true);
    const isEnemyDefeated = () => currentEnemy.hp <= 0;
    try {
      const attacker = playerTeam[activeUnitIndex];
    const activeUnit = playerTeam[activeUnitIndex];
    
    // Calculate initial defense
    let activeUnitStats = calculatePreAttackStats(activeUnit, getBattleContext(), activeUnit.id, characters);
    
    const attacksThisTurn = currentEnemy.attacks || 1;
  
    // Process pre-attacks using pre-attack stats
    const randomPreCount = Math.floor(Math.random() * (attacksThisTurn + 1));
    setPreAttackCount(randomPreCount);
    const preCount = randomPreCount;
    const postCount = attacksThisTurn - preCount;
    setAttackSplit({ pre: preCount, post: postCount });
    let superUsedCount = 0;
    for (let i = 0; i < preCount; i++) {
      if (isEnemyDefeated()) break;
      const isSuper = shouldEnemySuper({ currentEnemy, isPrePhase: true, superUsed: superUsedCount, attackIndex: i, attackSplit: { pre: preCount, post: postCount } });
      if (isSuper) superUsedCount++;
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
      await playAttackAnimation("enemy", isSuper, currentEnemy.super);
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
    if (!isEnemyDefeated() && playerTeam[activeUnitIndex].currentHp > 0) {
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
      const { updatedEffects, ctx } = getUpdatedContextWithSuperBuffs(activeUnit, superPassives, turn, superEffects);
      setSuperEffects(updatedEffects);

      const updatedCtx = {
        ...getBattleContext(),
        superEffects: {
          ...superEffects,
          [activeUnit.id]: [
            ...(superEffects[activeUnit.id] ?? []),
            ...superPassives.map(p => ({
              atkBoost: p.atkBoost ?? 0,
              defBoost: p.defBoost ?? 0,
              expiresOn: turn + (p.turns ?? 1) - 1
            }))
          ]
        }
      };
      await playAttackAnimation("player", true, characterDetails[attacker.id].super);
      currentEnemy.hp = Math.max(0, currentEnemy.hp - result.damage);
      setCurrentStage(prev => {
        const updated = structuredClone(prev);
        updated.phases[enemyPhaseIndex].hp = currentEnemy.hp;
        return updated;
      });

      // Update activeUnitStats for post-attack defense
      activeUnitStats = calculateFinalStats(playerTeam[activeUnitIndex], updatedCtx, playerTeam[activeUnitIndex].id);

      let extraMsg = "";
      if (result.traitCrit) extraMsg = " 💠 (Trait Activated)";
      await new Promise(resolve => setTimeout(resolve, 200));
      setLog(prev => ({
        ...prev,
        [turn]: [...(prev[turn] ?? []), `🔹 ${result.description}${extraMsg}`]
      }));

      if (isEnemyDefeated()) {
        // Handle phase transition immediately
        handlePhaseTransition();
        endTurnCleanup();
        return;
      }

      // Additional attack check
      const extraAttackPassives = activeUnit.passives.filter(
        p => ["startOfTurn", "onAttack"].includes(p.type) && p.extraAttackChance !== undefined
      );
      
      let chainedSuperEffects = { ...superEffects }; // Start from current state

      for (const p of extraAttackPassives) {
        if (isEnemyDefeated()) break;
        if (!p.condition || p.condition(getBattleContext(), activeUnit.id)) {
          const superChance = p.extraAttackChance;
          const isSuper = Math.random() < superChance;

          if (isSuper) {
            const superPassives = activeUnit.passives.filter(p => p.type === "superAttack");

            // Stack onto latest effects
            const { updatedEffects, ctx } = getUpdatedContextWithSuperBuffs(activeUnit, superPassives, turn, chainedSuperEffects);
            chainedSuperEffects = updatedEffects;
            setSuperEffects(updatedEffects);

            setSuperAttackCounts(prev => ({
              ...prev,
              [activeUnit.id]: (prev[activeUnit.id] ?? 0) + 1
            }));

            const updatedStats = calculateFinalStats(activeUnit, ctx, activeUnit.id);
            const attackerWithBuffs = {
              ...attacker,
              baseAtk: updatedStats.atk,
              baseDef: updatedStats.def
            };

            const addResult = performAttack(attackerWithBuffs, enemyWithType, ctx, attackerId, true, characters, traitEffects);

            let extraMsg = "";
            if (addResult.traitCrit) extraMsg = " 💠 (Trait Activated)";
            const char = characterDetails[attacker.id];
            const videoToPlay = char.additional || char.super;
            await playAttackAnimation("player", true, videoToPlay);
            await new Promise(resolve => setTimeout(resolve, 100));
            setLog(prev => ({
              ...prev,
              [turn]: [...(prev[turn] ?? []), `🔁 Extra Super: ${addResult.description}${extraMsg}`]
            }));

            currentEnemy.hp = Math.max(0, currentEnemy.hp - addResult.damage);
            setCurrentStage(prev => {
              const updated = structuredClone(prev);
              updated.phases[enemyPhaseIndex].hp = currentEnemy.hp;
              return updated;
            });
            
          } else {
            const normalResult = performAttack(attackerWithStats, enemyWithType, getBattleContext(), attackerId, false, characters, traitEffects);
            normalResult.damage = Math.floor(normalResult.damage / 10);
            normalResult.description = `${attacker.name} did a normal additional for ${normalResult.damage} damage`;
            await playAttackAnimation("player", false, characterDetails[attacker.id].super);
            await new Promise(resolve => setTimeout(resolve, 500));
            setLog(prev => ({
              ...prev,
              [turn]: [...(prev[turn] ?? []), `🔁 Additional Attack: ${normalResult.description}`]
            }));

            currentEnemy.hp = Math.max(0, currentEnemy.hp - normalResult.damage);
            if (currentEnemy.hp <= 0) {
              handlePhaseTransition();
              endTurnCleanup();
              return;
            }
          }
        }
      }

      
      const traitExtraChance = getValueFromTrait(activeUnit.id, "extraAttackChance", characters);
      if (!isEnemyDefeated() && Math.random() < traitExtraChance) {
        const addResult = performAttack(attackerWithStats, enemyWithType, getBattleContext(), attackerId, true, characters, traitEffects);

        setSuperAttackCounts(prev => ({
          ...prev,
          [activeUnit.id]: (prev[activeUnit.id] ?? 0) + 1
        }));

        let extraMsg = "";
        if (addResult.traitCrit) extraMsg = " 💠 (Trait Activated)";
        setLog(prev => ({
          ...prev,
          [turn]: [...(prev[turn] ?? []), `💠 Trait Extra Super: ${addResult.description}${extraMsg}`]
        }));

        currentEnemy.hp = Math.max(0, currentEnemy.hp - addResult.damage);
        setCurrentStage(prev => {
          const updated = structuredClone(prev);
          updated.phases[enemyPhaseIndex].hp = currentEnemy.hp;
          return updated;
        });
        if (currentEnemy.hp <= 0) {
          handlePhaseTransition();
          endTurnCleanup();
          return;
        }
      }
    }
  
    // Process post-attack enemy attacks post super
    if (!isEnemyDefeated() && playerTeam[activeUnitIndex].currentHp > 0) {
      let superUsedCount = 0;
      for (let i = 0; i < postCount; i++) {
        if (isEnemyDefeated()) break;
        const isSuper = shouldEnemySuper({ currentEnemy, isPrePhase: false, superUsed: superUsedCount, attackIndex: i, attackSplit: { pre: preCount, post: postCount } });
        if (isSuper) superUsedCount++;
        // Evasion logic
        const evadeChance = (activeUnit.passives ?? []).reduce((total, p) => {
          if (
            (p.type === "onAttack" || p.type === "startOfTurn") &&
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
        await playAttackAnimation("enemy", isSuper, currentEnemy.super);
        setLog(prev => ({
          ...prev,
          [turn]: [
            ...(prev[turn] ?? []),
            `${isSuper ? "💥 Super Attack! " : "🛡️"}${currentEnemy.name} attacked ${activeUnit.name} ` +
            `${rawDmg} ATK x ${typeMultiplier} ${typeLabel}${drLabel ? " " + drLabel : ""} - ${Math.floor(boostedDef)} DEF = ${damage} dmg] (after your action)`
          ]
        }));

        if (isEnemyDefeated()) {
          handlePhaseTransition();
        }

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
        if (!(incomingUnit.id in switchInTurnRef.current)) {
          switchInTurnRef.current[incomingUnit.id] = turn;
          setSwitchInTurnMap(prev => ({
            ...prev,
            [incomingUnit.id]: turn
          }));
        }
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
        new Audio("./assets/sfx/failure.mp3").play();
        setShowYouLosePopup(true);
        setTimeout(() => setShowEndButtons(true), 1000);
      }
    }
  
    // Phase transition or battle end
    if (isEnemyDefeated()) {
      handlePhaseTransition();
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

  const handlePhaseTransition = () => {
    const stageCleared = playerData?.clearedStages?.[stageId];
    const rewards = stageCleared ? currentStage.repeatRewards : currentStage.rewards;
    const earned = { gems: 0, exp: 0 };
    
    if (enemyPhaseIndex < currentStage.phases.length - 1) {
      setLog(prev => ({
        ...prev,
        [turn]: [...(prev[turn] ?? []), `⚔️ ${currentStage.phases[enemyPhaseIndex + 1].name} appeared!`]
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
      <div className="mb-4">
      <h3>
        {typeEmojis[currentEnemy.type] || "❓"} Enemy: {currentEnemy.name} (HP: {currentEnemy.hp.toLocaleString()})
      </h3>
        <HealthBar bars={getEnemyHealthBars()} />
      </div>
      <div className="portrait-combo-wrapper">
        <div className="enemy-portrait-wrapper">
          <div className="portrait-health-overlay">
            {getEnemyHealthBars().map((bar, idx) => (
              <div
                key={idx}
                className="portrait-health-segment"
                style={{
                  backgroundColor: bar.hp > 0 ? bar.color : "transparent",
                  opacity: bar.hp > 0 ? 1 : 0.3
                }}
              />
            ))}
          </div>
            <img
              src={currentEnemy.portrait || "./assets/characterPortraits/1.png"}
              alt={currentEnemy.name}
              className={`portrait-img ${currentEnemy.hp <= 0 ? "dimmed-portrait" : ""}`}
            />
          </div>
          <div className="active-unit-wrapper">
            <div className="active-unit-portrait">
              <img
                src={`./assets/characterPortraits/${playerTeam[activeUnitIndex]?.id}.png`}
                alt={activeChar.name || "Character"}
                className={`portrait-img ${playerTeam[activeUnitIndex]?.currentHp <= 0 ? "dimmed-portrait" : ""}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "./assets/fallback.png";
                }}
              />
            </div>
            <div className="player-health-bar">
              <div
                className="player-health-fill"
                style={{
                  width: `${Math.max(
                    0,
                    (playerTeam[activeUnitIndex]?.currentHp / playerTeam[activeUnitIndex]?.maxHp) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
      </div>

      <div className="mb-6">
        <div className="p-3 bg-zinc-800 rounded mb-2">
          <p>{playerTeam[activeUnitIndex].name}: {playerTeam[activeUnitIndex]?.currentHp.toLocaleString() || 0} / {playerTeam[activeUnitIndex]?.maxHp.toLocaleString() || 0} ❤️</p>
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
              {playerTeam[activeUnitIndex]?.currentHp <= 0 ? "Unit Defeated" : isTurnInProgress ? "Attacking" : "Attack"}
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

                  if (!(incomingUnit.id in switchInTurnRef.current)) {
                    switchInTurnRef.current[incomingUnit.id] = turn;
                    setSwitchInTurnMap(prev => ({
                      ...prev,
                      [incomingUnit.id]: turn
                    }));
                  }
                
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

                  let superUsed = 0;
                  for (let i = 0; i < attacksThisTurn; i++) {
                    const { pre: preCount, post: postCount } = attackSplit;
                    const isSuper = shouldEnemySuper({
                      currentEnemy,
                      isPrePhase: false,
                      superUsed,
                      attackIndex: i,
                      attackSplit: { pre: preCount, post: postCount }
                    });
                    if (isSuper) superUsed++;
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
                    const dmgReduction = getPassiveValue(activeUnit, "damageReduction", getBattleContext(), activeUnit.id, ["startOfTurn"]);
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
                    await playAttackAnimation("enemy", isSuper, currentEnemy.super);
                    setLog(prev => ({
                      ...prev,
                      [turn]: [
                        ...(prev[turn] ?? []),
                        `${isSuper ? "💥 Super Attack! " : "🛡️"}${currentEnemy.name} attacked ${activeUnit.name} ` +
                        `[${rawDmg} ATK x ${typeMultiplier} ${typeLabel}${drLabel ? " " + drLabel : ""} - ${Math.floor(boostedDef)} DEF = ${damage} damage] (after switch)`
                      ]
                    }));
                    if (updatedTeam[idx].currentHp <= 0) {
                      setLog(prev => ({
                        ...prev,
                        [turn]: [
                          ...(prev[turn] ?? []),
                          `💀 ${activeUnit.name} died.`
                        ]
                      }));
                      break;
                    }
                    await new Promise(resolve => setTimeout(resolve, 500));
                  }
                
                  // End turn after switch
                  endTurnCleanup();

                }}                
                
                className="switch-button"
                disabled={unit.currentHp <= 0 || isTurnInProgress || showVictoryPopup}
              >
                <div className="portrait-wrapper">
                  <img
                    src={`./assets/characterPortraits/${unit.id}.png`}
                    alt={name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "./assets/fallback.png";
                    }}
                  />
                  <span className="status-icon">
                    {unit.currentHp <= 0
                      ? "💀"
                      : isTurnInProgress
                      ? "⌛"
                      : typeIcon}
                  </span>
                </div>
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
                <li key={idx} className={styles["turn-log-entry"]}>
                  {formatAndColorDamage(entry)}
                </li>
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
          <h6>Are you sure you want to give up?</h6>
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
      <audio ref={audioRef} src={bgm} className={showYouLosePopup ? "muffled-audio" : ""} loop autoPlay>
        <source src={bgm} type="audio/mpeg" />
      </audio>
    </div>
  );
}