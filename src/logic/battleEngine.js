import { calculateFinalStats } from "./statCalculator";

export function performAttack(attacker, defender, ctx, id) {
  const attackerStats = calculateFinalStats(attacker, ctx, id);
  const dr = defender.dr ?? 0; // Default to 0%
  const def = defender.def ?? 0; // Default to 0 if missing

  const rawDamage = attackerStats.atk;

  // Step 1: Apply Damage Reduction
  const afterDR = rawDamage * (1 - dr / 100);

  // Step 2: Subtract Defense
  const finalDamage = Math.max(0, Math.floor(afterDR - def));

  return {
    attackerStats,
    rawAtk: rawDamage,
    damageReduction: dr,
    defenderDef: def,
    damage: finalDamage,
    description: `${attacker.name} dealt ${finalDamage} damage to ${defender.name} (DR ${dr}%, DEF ${def})`
  };
}
