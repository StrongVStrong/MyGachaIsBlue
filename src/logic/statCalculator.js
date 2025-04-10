// Start of Turn
export function calculatePreAttackStats(unit, ctx, id = unit.id) {
  let atk = unit.baseAtk;
  let def = unit.baseDef;

  // 1. Leader Skill
  atk *= ctx.leaderAtkMultiplier ?? 1;
  def *= ctx.leaderDefMultiplier ?? 1;

  // 2. Start-of-Turn Passives
  unit.passives?.forEach(p => {
    if (p.type === "startOfTurn" && (!p.condition || p.condition(ctx, id))) {
      const atkBoost = typeof p.atkBoost === "function" ? p.atkBoost(ctx, id) : (p.atkBoost ?? 0);
      const defBoost = typeof p.defBoost === "function" ? p.defBoost(ctx, id) : (p.defBoost ?? 0);
      atk *= 1 + atkBoost;
      def *= 1 + defBoost;
    }
  });

  // 3. Super Attack Buffs
  const superBuffs = ctx.superEffects?.[id] ?? [];
  let totalSuperAtkBoost = 0;
  let totalSuperDefBoost = 0;

  superBuffs.forEach(buff => {
    if (ctx.turnNow <= buff.expiresOn) {
      totalSuperAtkBoost += buff.atkBoost ?? 0;
      totalSuperDefBoost += buff.defBoost ?? 0;
    }
  });

  atk *= 1 + totalSuperAtkBoost;
  def *= 1 + totalSuperDefBoost;

  return {
    atk: Math.floor(atk),
    def: Math.floor(def)
  };
}

export function calculateFinalStats(unit, ctx, id = unit.id) {
  // Pre-attack stats
  const stats = calculatePreAttackStats(unit, ctx, id);
  let atk = stats.atk;
  let def = stats.def;

  // 4. Add On-Attack Passives
  unit.passives?.forEach(p => {
    if (p.type === "onAttack" && (!p.condition || p.condition(ctx, id))) {
      const atkBoost = typeof p.atkBoost === "function" ? p.atkBoost(ctx, id) : (p.atkBoost ?? 0);
      const defBoost = typeof p.defBoost === "function" ? p.defBoost(ctx, id) : (p.defBoost ?? 0);
      atk *= 1 + atkBoost;
      def *= 1 + defBoost;
    }
  });

  return {
    atk: Math.floor(atk),
    def: Math.floor(def)
  };
}