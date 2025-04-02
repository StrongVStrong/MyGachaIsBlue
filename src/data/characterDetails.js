const characterDetails = {
    1: {
      name: "Super Saiyan Goku",
      baseAtk: 21560,
      baseDef: 15000,
      baseHp: 20000,
      passives: [
        // 🔹 Always Active: ATK & DEF +200%
        {
          type: "startOfTurn",
          atkBoost: 2.0,
          defBoost: 2.0,
          description: "ATK & DEF +200%"
        },
  
        // 🔹 When attacking: ATK & DEF +159%
        {
          type: "onAttack",
          atkBoost: 1.59,
          defBoost: 1.59,
          description: "ATK & DEF +159% when attacking"
        },
  
        // 🔹 First 5 turns: DEF +159%, great chances...
        {
          type: "startOfTurn",
          condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 5,
          atkBoost: 1.59,
          defBoost: 1.59,
          critChance: 0.7,
          extraAttackChance: 0.7,
          evadeChance: 0.7,
          description: "DEF +159%, Great chance to crit/additional/evade for 5 turns"
        },
  
        // 🔹 From turn 6 onward: DEF +59%, high chances...
        {
          type: "startOfTurn",
          condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] >= 5,
          defBoost: 0.59,
          critChance: 0.5,
          extraAttackChance: 0.5,
          evadeChance: 0.5,
          description: "DEF +59%, High chance to crit/additional/evade after turn 6"
        },
  
        // 🔹 After evading: permanent ATK & DEF +59%
        {
          type: "startOfTurn",
          condition: (ctx, id) => ctx.evaded[id] === true,
          atkBoost: 0.59,
          defBoost: 0.59,
          permanent: true,
          description: "ATK & DEF +59% permanently after evading"
        }
      ],
        linkNames: [
            "Saiyan Warrior Race",
            "Super Saiyan",
            "Kamehameha",
            "Fierce Battle",
            "Prepared for Battle"
        ],
    },

    2: {
    name: "Super Saiyan Vegeta",
    baseAtk: 22000,
    baseDef: 16000,
    baseHp: 21000,
    passives: [
        // 🔹 Always Active: ATK & DEF +200%
        {
        type: "startOfTurn",
        atkBoost: 2.0,
        defBoost: 2.0,
        description: "ATK & DEF +200%"
        },

        // 🔹 Support: +40% DEF to "Successors" or "Fusion" allies
        {
        type: "support",
        targetCategories: ["Successors", "Fusion"],
        defBoost: 0.4,
        description: "DEF +40% to 'Successors' or 'Fusion' allies"
        },

        // 🔹 First 3 turns from entry: DEF +300%, Guard
        {
        type: "startOfTurn",
        condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 3,
        defBoost: 3.0,
        guardsAll: true,
        description: "DEF +300%, guards all attacks for 3 turns from entry"
        },

        // 🔹 When attacking: ATK +200%, DEF +100%, effective against all types
        {
        type: "onAttack",
        atkBoost: 2.0,
        defBoost: 1.0,
        effectiveAgainstAll: true,
        description: "ATK +200%, DEF +100%, attacks effective against all types when attacking"
        },

        // 🔹 Always additional super
        {
        type: "onAttack",
        guaranteedAdditionalSuper: true,
        description: "Launches an additional Super Attack"
        },

        // 🔹 On Switch-In: Guard + Great chance to launch additional super
        {
        type: "onSwitchIn",
        oncePerEntry: true,
        guardsAll: true,
        extraAttackChance: 0.7,
        extraAttackIsSuper: true,
        description: "Each time this unit is switched in: Guards all, launches additional with great chance"
        }
    ],

    linkNames: [
        "Saiyan Warrior Race",
        "Super Saiyan",
        "Prepared for Battle",
        "Fierce Battle"
    ]
    }
  };
  
  export default characterDetails;
  