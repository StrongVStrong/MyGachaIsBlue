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
      description: "10% attack"
    },
    "Stronger": {
      atkBoost: 0.2,
      description: "20% attack"
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
      description: "5% chance to dodge"
    },
    "Serious": {
      critChance: 0.3,
      description: "20% chance to crit"
    },
    "Hasty": {
      extraAttackChance: 0.5,
      description: "50% chance to additional super"
    },
    "Ultra Instinct": {
      evadeChance: 0.3,
      defBoost: 0.1,
      description: "30% chance to dodge, 10% def"
    },
    "Enlightened": {
      extraAttackChance: 0.5,
      description: "50% chance to additional super"
    },
    "Beast": {
      critChance: 0.5,
      description: "50% chance to crit"
    },
    "Divine": {
      critChance: 0.3,
      atkBoost: 0.1,
      description: "30% chance to crit, 10% atk"
    },
  };
  