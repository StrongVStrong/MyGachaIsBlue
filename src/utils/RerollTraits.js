export const traitPool = {
    common: ["Strong", "Stronger", "Sharp", "Sharper", "Quick", "Quicker"],
    rare: ["Master", "Serious", "Hasty"],
    legendary: ["Powerful", "Perceptive", "Godspeed"],
    godly: [
      { name: "Ultra Instinct", rate: 0.25 },
      { name: "Enlightened", rate: null }, // evenly split remaining %
      { name: "Beast", rate: 0.25 },
      { name: "Divine", rate: 0.01 },
    ],
  };
  
  export function rerollTrait(currentTrait = null) {
    const rarityChances = {
      common: 50,
      rare: 40,
      legendary: 9,
      godly: 1,
    };
  
    const totalRoll = Math.random() * 100;
    let cumulative = 0;
    let selectedRarity = "common";
  
    for (const [rarity, chance] of Object.entries(rarityChances)) {
      cumulative += chance;
      if (totalRoll < cumulative) {
        selectedRarity = rarity;
        break;
      }
    }
  
    const pool = traitPool[selectedRarity];
    if (!pool) return { name: null, rarity: selectedRarity };
  
    // GODLY = Weighted random
    if (selectedRarity === "godly") {
      const fixed = pool.filter(t => t.rate !== null && t.name !== currentTrait);
      const dynamic = pool.filter(t => t.rate === null && t.name !== currentTrait);
  
      const fixedSum = fixed.reduce((sum, t) => sum + t.rate, 0);
      const leftover = 1 - fixedSum;
      const dynamicRate = dynamic.length > 0 ? leftover / dynamic.length : 0;
  
      const weighted = [
        ...fixed.map(t => ({ ...t, weight: t.rate })),
        ...dynamic.map(t => ({ ...t, weight: dynamicRate })),
      ];
  
      const rand = Math.random();
      let acc = 0;
      for (const t of weighted) {
        acc += t.weight;
        if (rand <= acc) return { name: t.name, rarity: "godly" };
      }
      return { name: weighted[weighted.length - 1].name, rarity: "godly" };
    }
  
    // COMMON,RARE,LEGENDARY = Simple random (excluding current)
    const filtered = pool.filter(name => name !== currentTrait);
    const name = filtered[Math.floor(Math.random() * filtered.length)];
    return { name, rarity: selectedRarity };
  }
  
export const traitEffects = {
    "Strong": {
      atkBoost: 0.1,
      description: "+10% damage dealt"
    },
    "Stronger": {
      atkBoost: 0.2,
      description: "20% damage dealt"
    },
    "Sharp": {
      damageReduction: 0.1,
      description: "10% defense"
    },
    "Sharper": {
      guardsAll: 0.5,
      description: "20% defense"
    },
    "Quick": {
      extraAttackChance: 0.1,
      description: "10% chance to additional super"
    },
    "Quicker": {
      defBoost: 0.2,
      description: "20% chance to additional super"
    },
    "Master": {
      evadeChance: 0.05,
      guardsAll: 0.3,
      description: "5% chance to dodge, 30% chance to guard"
    },
    "Serious": {
      damageReduction: 0.05,
      critChance: 0.2,
      description: "5% damage reduction, 20% chance to crit"
    },
    "Hasty": {
      extraAttackChance: 0.3,
      description: "30% chance to additional super"
    },
    "Powerful": {
      evadeChance: 0.05,
      guardsAll: 0.3,
      description: "5% chance to dodge, 30% chance to guard"
    },
    "Perceptive": {
      critChance: 0.4,
      description: "40% chance to crit"
    },
    "Godspeed": {
      extraAttackChance: 0.7,
      description: "70% chance to additional super"
    },
    "Ultra Instinct": {
      evadeChance: 0.3,
      defBoost: 0.1,
      description: "30% chance to dodge, 10% def"
    },
    "Enlightened": {
      extraAttackChance: 0.5,
      guardsAll: 0.5,
      description: "50% chance to additional super, 50% chance to guard incoming attacks"
    },
    "Beast": {
      critChance: 0.5,
      damageReduction: 0.07,
      description: "7% damage reduction, 50% chance to crit"
    },
    "Divine": {
      critChance: 0.3,
      atkBoost: 0.1,
      description: "30% chance to crit, 10% atk"
    },
  };
  