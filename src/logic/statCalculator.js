export function calculateFinalStats(unit, ctx, id) {
    let atk = unit.baseAtk;
    let def = unit.baseDef;
  
    // 1. Leader Skill
    atk *= ctx.leaderAtkMultiplier ?? 1;
    def *= ctx.leaderDefMultiplier ?? 1;
  
    // 2. Start-of-Turn Passives
    unit.passives?.forEach(p => {
      if (p.type === "startOfTurn" && (!p.condition || p.condition(ctx, id))) {
        atk *= 1 + (p.atkBoost ?? 0);
        def *= 1 + (p.defBoost ?? 0);
      }
    });
  
    // 3. Links
    unit.links?.forEach(link => {
      if (!link.condition || link.condition(ctx.team)) {
        atk *= 1 + (link.atkBoost ?? 0);
        def *= 1 + (link.defBoost ?? 0);
      }
    });
  
    // 4. On-Attack Passives
    unit.passives?.forEach(p => {
      if (p.type === "onAttack" && (!p.condition || p.condition(ctx, id))) {
        atk *= 1 + (p.atkBoost ?? 0);
        def *= 1 + (p.defBoost ?? 0);
      }
    });
  
    return {
      atk: Math.floor(atk),
      def: Math.floor(def)
    };
  }
  