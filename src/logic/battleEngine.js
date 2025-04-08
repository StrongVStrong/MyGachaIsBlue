import { calculateFinalStats } from "./statCalculator";
import { characterMap } from "../data/characters";

export function performAttack(attacker, defender, ctx, id, isSuper = false) {
  const attackerStats = calculateFinalStats(attacker, ctx, id);
  const dr = defender.dr ?? 0;
  const def = defender.def ?? 0;

  const attackerPassives = attacker.passives ?? [];
  const defenderPassives = defender.passives ?? [];

  // Types
  function getTypeAdvantageMultiplier(attacker, defender, ctx) {
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
  
  

  function hasPassive(unit, key, ctx, id) {
    return (unit.passives ?? []).some(p =>
      (["startOfTurn", "onAttack"].includes(p.type)) &&
      (!p.condition || p.condition(ctx, id)) &&
      p[key] === true
    );
  }

  function getPassiveValue(unit, key, ctx, id) {
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

  let crit = false;
  let extraAttackChance = false;
  let guaranteedSuper = false;

  // Flags
  attackerPassives.forEach(p => {
    if (["startOfTurn", "onAttack"].includes(p.type)) {
      if (!p.condition || p.condition(ctx, id)) {
        if (Math.random() < (p.critChance ?? 0)) crit = true;
        if (Math.random() < (p.extraAttackChance ?? 0)) extraAttackChance = true;
        if (p.guaranteedAdditionalSuper) guaranteedSuper = true;
      }
    }
  });

  const raw = attackerStats.atk;

  let baseDamage = raw;
  let typeLabel = "";

if (!crit) {
  const { multiplier, label } = getTypeAdvantageMultiplier(attacker, defender, ctx);
  typeLabel = label;
  baseDamage *= multiplier;
}


  // DR
  const damageReduction = getPassiveValue(defender, "damageReduction", ctx, defender.id);
  baseDamage *= 1 - (damageReduction ?? 0);

  // Boss DR
  const afterDR = baseDamage * (1 - dr / 100);

  // Crit
  const variance = 0.99 + Math.random() * 0.01;
  let finalDamage;
  if (crit) {
    finalDamage = Math.floor(afterDR * 2 * variance); // Bypasses defense
  } else {
    const reduced = Math.max(0, afterDR - def);
    finalDamage = Math.floor(reduced * variance);
  }

  return {
    damage: finalDamage,
    evaded: false,
    crit,
    isNormalAdditional: !isSuper,
    description: `${attacker.name} dealt ${finalDamage} damage to ${defender.name}${crit ? " (CRIT!)" : ""}${!crit ? ` (${typeLabel})` : ""}`,
    extraAttackChance,
    guaranteedSuper,
    updatedStats: calculateFinalStats(attacker, ctx, id)
  };
}
