export const traitPool = {
    common: ["Strong", "Sharp", "Quick"],
    rare: ["Master", "Serious", "Hasty"],
    legendary: ["Powerful", "Perceptive", "Godspeed"],
    godly: [
      { name: "Ultra Instinct", rate: 0.2 },
      { name: "Enlightened", rate: null }, // evenly split remaining %
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
    "Ultra Instinct": {
      evadeChance: 0.3,
      description: "30% chance to dodge (Hidden Potential)"
    },
    "Enlightened": {
      extraSuperChance: 0.2,
      description: "20% chance to perform an extra super attack (Hidden Potential)"
    },
    "Sharp": {
      critChance: 0.3,
      description: "30% crit chance (Hidden Potential)"
    },
    // Add more as needed
  };
  