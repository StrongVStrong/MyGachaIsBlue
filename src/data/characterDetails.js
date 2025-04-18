const characterDetails = {
    1: {
      name: "Super Saiyan Goku",
      baseAtk: 15600,
      baseDef: 16500,
      baseHp: 96655,
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
  
        // 🔹 First 5 turns: DEF +159%
        {
          type: "startOfTurn",
          condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 5,
          defBoost: 1.59,
          critChance: 1,
          extraAttackChance: 0.7,
          evadeChance: 0.7,
          description: "DEF +159%, 70% chance to crit/additional/evade for 5 turns from entry"
        },
  
        // 🔹 From turn 6 onward: DEF +59%
        {
          type: "startOfTurn",
          condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] >= 5,
          defBoost: 0.59,
          critChance: 0.5,
          evadeChance: 0.5,
          damageReduction: 0.3,
          description: "DEF +59%, 30% damage reduction, 50% chance to crit/additional/evade from this character's 6th turn"
        },
  
        // 🔹 After evading: ATK & DEF +59%
        {
          type: "startOfTurn",
          condition: (ctx, id) => ctx.evaded[id] === true,
          atkBoost: 0.59,
          defBoost: 0.59,
          description: "ATK & DEF +59% after evading within the turn"
        },

        // Super Attack: Warp Kamehameha: Raises ATK
        {
          type: "superAttack",
          atkBoost: 0.1,
          turns: 999
        },
      ],
      super: "/assets/animations/allgodly.mp4",
      additional: "/assets/animations/common.mp4",
    },

    2: {
      name: "Super Saiyan Vegeta",
      baseAtk: 12000,
      baseDef: 14000,
      baseHp: 120000,
      passives: [
        // 🔹 Always Active: ATK & DEF +200%
        {
          type: "startOfTurn",
          atkBoost: 2.0,
          defBoost: 2.0,
          damageReduction: 0.2,
          description: "ATK & DEF +200%, 20% damage reduction"
        },

        // 🔹 Support: +10% DEF for one turn on swap-out
        {
          type: "onSwitchOut",
          defBoost: 0.1,
          description: "DEF +10% on swapped-out character for one turn"
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
          superEffective: true,
          extraAttackChance: 1,
          description: "ATK +200%, DEF +100%, attacks are super effective, launches an additional Super Attack"
        },

        // Super Attack: Burning Stars Cannon: Raises DEF
        {
          type: "superAttack",
          defBoost: 0.1,
          turns: 999
        }
      ],
      super: "/assets/animations/allgodly.mp4",
      additional: "/assets/animations/common.mp4",
    },

    3: {
      name: "FPSSJ Broly",
      baseAtk: 21200,
      baseDef: 14400,
      baseHp: 93000,
      passives: [
          // 🔹 Always Active: ATK & DEF +222%
          {
            type: "startOfTurn",
            atkBoost: 2.22,
            defBoost: 2.22,
            description: "ATK & DEF +222%"
          },
  
          // 🔹 First 5 turns: DEF +66%, great chance to super
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 5,
            atkBoost: 0.66,
            defBoost: 0.66,
            extraAttackChance: 0.7,
            description: "ATK & DEF +66%, 70% chance to additional super for 5 turns from entry"
          },
    
          // 🔹 From turn 6 onward: DEF +132%, high chance to super and evade
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] >= 5,
            defBoost: 1.32,
            critChance: 0.5,
            extraAttackChance: 0.5,
            evadeChance: 0.5,
            description: "DEF +132%, 50% chance to crit/additional/evade from this character's 6th turn"
          },
  
          // 🔹 When attacking: ATK +167%, DEF +277%, effective against all types
          {
            type: "onAttack",
            atkBoost: 1.67,
            defBoost: 2.77,
            superEffective: true,
            extraAttackChance: 1,
            description: "ATK +167%, DEF +277%, attacks are super effective, launches an additional Super Attack"
          },

          // Super Attack: Meteor Blaster: Raises ATK and DEF for 1 turn
          {
            type: "superAttack",
            atkBoost: 0.1,
            defBoost: 0.1,
            turns: 1
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      4: {
        name: "Super Vegito",
        baseAtk: 12777,
        baseDef: 16777,
        baseHp: 90000,
        passives: [
          // 🔹 Always Active: ATK & DEF +359%, Great chance to super, Guards all attacks
          {
          type: "startOfTurn",
          atkBoost: 3.59,
          defBoost: 3.59,
          guardsAll: true,
          damageReduction: 0.2,
          extraAttackChance: 0.7,
          description: "ATK & DEF +359%, 70% chance to additional super, Guards all attacks"
          },
  
          // 🔹 When attacking: ATK & DEF +200%, effective against all types
          {
          type: "onAttack",
          atkBoost: 2.0,
          defBoost: 2.0,
          critChance: 0.5,
          extraAttackChance: 1,
          description: "ATK & DEF +200%, 50% chance to crit, performs an additional super"
          },

          // Super Attack: Vegito Special: Greatly Raises ATK and DEF
          {
            type: "superAttack",
            atkBoost: 0.3,
            defBoost: 0.3,
            turns: 999
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      5: {
        name: "Super Gogeta",
        baseAtk: 16777,
        baseDef: 12777,
        baseHp: 90000,
        passives: [
          // 🔹 Always Active: ATK & DEF +459%
          {
          type: "startOfTurn",
          atkBoost: 4.59,
          defBoost: 4.59,
          critChance: 0.7,
          evadeChance: 0.7,
          extraAttackChance: 0.7,
          damageReduction: 0.2,
          guardsAll: true,
          description: "Start of turn: ATK & DEF +459, 70% chance to crit/additional/evade, 20% damage reduction, guards all attacks"
          },
  
          // 🔹 When attacking: ATK +159%, DEF +159%, launches an additional super
          {
          type: "onAttack",
          atkBoost: 1.59,
          defBoost: 1.59,
          damageReduction: 0.2,
          extraAttackChance: 1,
          description: "\nWhen Attacking: ATK and DEF +159%, 20% damage reduction, launches an additional Super Attack"
          },

          // Super Attack: Gogeta Special: Raises ATK and DEF for 1 turn
          {
            type: "superAttack",
            atkBoost: 0.1,
            defBoost: 0.1,
            turns: 1
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      6: {
        name: "SSJ4 Daima Goku",
        baseAtk: 27000,
        baseDef: 21700,
        baseHp: 62000,
        passives: [
          // 🔹 Always Active: ATK & DEF +159%
          {
          type: "startOfTurn",
          atkBoost: 1.59,
          defBoost: 1.59,
          damageReduction: 0.3,
          description: "Start of Turn: ATK & DEF +159%, 30% damage reduction"
          },

          // 🔹 When attacking: ATK +500%, DEF +200%, effective against all types
          {
          type: "onAttack",
          atkBoost: 5.0,
          defBoost: 2.0,
          superEffective: true,
          extraAttackChance: 0.7,
          description: "\n When Attacking: ATK +500%, DEF +200%, super effective, launches an additional Super Attack"
          },

          // Super Attack: Ultra Kamehameha: Greatly Raises DEF
          {
            type: "superAttack",
            defBoost: 0.3,
            turns: 999
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      7: {
        name: "Super Saiyan Goku Daima",
        baseAtk: 17500,
        baseDef: 12500,
        baseHp: 92000,
        passives: [
          // 🔹 Always Active: ATK & DEF +59%
          {
          type: "startOfTurn",
          atkBoost: 0.59,
          defBoost: 0.59,
          description: "Start of Turn: ATK & DEF +59%"
          },
  
          // 🔹 First 3 turns: DEF +59%, great chance to super
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 3,
            atkBoost: 0.59,
            defBoost: 0.59,
            extraAttackChance: 0.7,
            damageReduction: (ctx, id) => {
              const turnsPassed = ctx.turnNow - ctx.turnEntered[id];
              return Math.max(0, 0.3 - 0.1 * turnsPassed);
            },
            description: "ATK & DEF +59%, 70% chance to additional super, 30% damage reduction(-10% per turn) for 3 turns from entry"
          },

          // Super Attack: Power Pole Assault: Massively Raises ATK and DEF
          {
            type: "superAttack",
            atkBoost: 1,
            defBoost: 1,
            turns: 999
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      8: {
        name: "SSJ3 Vegeta",
        baseAtk: 18800,
        baseDef: 17700,
        baseHp: 96600,
        passives: [
          // 🔹 Always Active: ATK & DEF +400%
          {
          type: "startOfTurn",
          atkBoost: 4.0,
          defBoost: 4.0,
          damageReduction: 0.6,
          description: "Start of turn: ATK & DEF +400%, 60% damage reduction"
          },
  
          // 🔹 When attacking: DEF +300%
          {
          type: "onAttack",
          defBoost: 3.0,
          description: "\n When attacking: DEF +300%"
          },

          // Super Attack: Vegeta Onslaught: Massively Raises ATK
          {
            type: "superAttack",
            atkBoost: 1,
            turns: 999
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      9: {
        name: "Glorio",
        baseAtk: 19000,
        baseDef: 17000,
        baseHp: 95000,
        passives: [
          // 🔹 Always Active: ATK & DEF +250%
          {
            type: "startOfTurn",
            atkBoost: 2.5,
            defBoost: 2.5,
            evadeChance: 0.3,
            damageReduction: 0.3,
            description: "Start of Turn: ATK & DEF +250%, 30% damage reduction and chance to evade"
          },
  
          // 🔹 From turn 6 onward: DEF +50%, high chance to super and evade
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] >= 5,
            defBoost: 0.5,
            critChance: 0.5,
            evadeChance: 0.5,
            description: "DEF +50% & 50% chance to crit/evade from this character's 6th turn"
          },
  
          // 🔹 When attacking: ATK +555%, effective against all types
          {
            type: "onAttack",
            atkBoost: 5.55,
            superEffective: true,
            description: "\nWhen Attacking: ATK +555%, attacks are super effective"
          },

          // Super Attack: Magic: Greatly Raises DEF
          {
            type: "superAttack",
            defBoost: 0.3,
            turns: 999
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      10: {
        name: "Goma",
        baseAtk: 28000,
        baseDef: 12000,
        baseHp: 85000,
        passives: [
          // 🔹 Always Active: ATK & DEF +666%
          {
            type: "startOfTurn",
            atkBoost: 6.66,
            defBoost: 6.66,
            damageReduction: 0.06,
            guardsAll: true,
            description: "Start of turn: ATK & DEF +666%, 6% damage reduction, Guards all attacks"
          },

          // 🔹 When attacking: ATK +66%, effective against all types
          {
            type: "onAttack",
            atkBoost: 0.66,
            superEffective: true,
            description: "\nWhen attacking: ATK +66%, attacks are super effective"
          },

          // 🔹 Every turn passed: ATK +6%
          {
            type: "startOfTurn",
            condition: (ctx, id) => true,
            atkBoost: (ctx, id) => 0.06 * (ctx.turnNow - ctx.turnEntered[id]),
            description: "\n ATK +6% for every turn from entry"
          },

          // Super Attack: Third Eye: Greatly Raises DEF
          {
            type: "superAttack",
            defBoost: 0.3,
            turns: 999
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      11: {
        name: "Ultra Instinct Goku",
        baseAtk: 13000,
        baseDef: 12000,
        baseHp: 110000,
        passives: [
          // 🔹 Always Active: ATK & DEF +200%
          {
            type: "startOfTurn",
            atkBoost: 2.0,
            defBoost: 2.0,
            damageReduction: 0.2,
            description: "Start of Turn: ATK & DEF +200%, 20% damage reduction"
          },
    
          // 🔹 When attacking: ATK & DEF +159%
          {
            type: "onAttack",
            atkBoost: 1.59,
            defBoost: 1.59,
            description: "\nWhen Attacking: ATK & DEF +159% when attacking"
          },
    
          // 🔹 First 5 turns: DEF +59%
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 4,
            defBoost: 0.59,
            critChance: 0.5,
            extraAttackChance: 0.5,
            evadeChance: 0.5,
            description: "\nDEF +59%, 50% chance to crit/additional/evade for 4 turns from entry"
          },
    
          // 🔹 From turn 6 onward: DEF +159
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] >= 4,
            defBoost: 1.59,
            critChance: 0.77,
            extraAttackChance: 0.77,
            evadeChance: 0.77,
            description: "\nDEF +159%, 77% chance to crit/additional/evade from this character's 5th turn"
          },

          // 🔹 After evading: ATK & DEF +77%
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.evaded[id] === true,
            atkBoost: 0.77,
            defBoost: 0.77,
            description: "\nATK & DEF +77% after evading within the turn"
          },
  
          // Super Attack: Godly Display: Raises ATK and DEF
          {
            type: "superAttack",
            atkBoost: 0.1,
            defBoost: 0.1,
            turns: 999
          },
  
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.superAttackCounts[id] > 0,
            atkBoost: (ctx, id) => 0.01 * ctx.superAttackCounts[id], // 1% atk per super
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },
  
      12: {
        name: "Super Saiyan 4 Goku",
        baseAtk: 22000,
        baseDef: 16000,
        baseHp: 91000,
        passives: [
          // 🔹 Always Active: ATK & DEF +200%
          {
          type: "startOfTurn",
          atkBoost: 3.0,
          defBoost: 3.0,
          damageReduction: 0.2,
          description: "Start of Turn: ATK & DEF +200%, 20% damage reduction, DEF +30% per super attack (Up to 77%)"
          },
  
          // 🔹 Support: +60% DEF for one turn on swap-out
          {
          type: "onSwitchOut",
          defBoost: 0.6,
          description: "\nDEF +60% on swapped-out character for one turn",
          turns: 1
          },
  
          // 🔹 When attacking: ATK +244%, DEF +44%, effective against all types
          {
          type: "onAttack",
          atkBoost: 2.44,
          defBoost: 0.44,
          critChance: 1,
          extraAttackChance: 1,
          description: "\nWhen Attacking: ATK +244%, DEF +44%, performs a crit, launches an additional Super Attack"
          },
  
          // Super Attack: x10 Kamehameha: Greatly Raises DEF
          {
            type: "superAttack",
            defBoost: 0.3,
            turns: 999
          },
  
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.superAttackCounts[id] > 0,
            defBoost: (ctx, id) => Math.min(0.3 * ctx.superAttackCounts[id], 0.77), // Def +30% (up to 77%) per super
          }          
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },
  
      13: {
        name: "Super Saiyan 3 Goku",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 95000,
        passives: [
          // 🔹 Always Active: ATK & DEF +300%, damage reduction +30%
          {
          type: "startOfTurn",
          atkBoost: 3.0,
          defBoost: 3.0,
          damageReduction: 0.3,
          description: "Start of Turn: ATK & DEF +300%, 30% damage reduction"
          },
  
          // 🔹 First 3 turns: ATK & DEF +90%, great chance to super
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 3,
            atkBoost: 0.9,
            defBoost: 0.9,
            extraAttackChance: 0.7,
            description: "\nATK & DEF +90%, Great chance to crit/additional/evade for 3 turns from entry"
          },

          // 🔹 From turn 4 onward: ATK & DEF +33%, high chance to super 
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] >= 3,
            defBoost: 0.33,
            atkBoost: 0.33,
            critChance: 0.5,
            description: "\nDEF +33%, High chance to crit/additional from this character's 4th turn"
          },

          // 🔹 When attacking: ATK +33%, DEF +33%, effective against all types
          {
          type: "onAttack",
          atkBoost: 0.33,
          defBoost: 0.33,
          superEffective: true,
          extraAttackChance: 1,
          damageReduction: 0.33,
          description: "\nWhen Attacking: ATK, DEF, and Damage Reduction +33%, super effective, launches an additional Super Attack"
          },
  

          // Super Attack: Meteor Attack: Raises ATK, Raises DEF for 1 turn
          {
            type: "superAttack",
            defBoost: 0.1,
            turns: 1
          },
          {
            type: "superAttack",
            atkBoost: 0.1,
            turns: 999
          },
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },
  
      14: {
        name: "SSGSS Goku",
        baseAtk: 17000,
        baseDef: 15000,
        baseHp: 94000,
        passives: [
          // 🔹 Always Active: ATK & DEF +159%, Great chance to super, Guards all attacks
          {
          type: "startOfTurn",
          atkBoost: 1.59,
          defBoost: 1.59,
          extraAttackChance: 0.7,
          damageReduction: 0.3,
          guardsAll: true,
          description: "Start of Turn: ATK & DEF +159%, 70% chance to super, Guards all attacks, 30% damage reduction"
          },
  
          // 🔹 When attacking: ATK +70% & DEF +100%, effective against all types
          {
          type: "onAttack",
          atkBoost: 0.7,
          defBoost: 1.0,
          superEffective: true,
          damageReduction: 0.2,
          extraAttackChance: 1,
          description: "\nWhen Attacking: ATK +70%, DEF +100%, 20% damage reduction, Performs an additional super"
          },
  
          // 🔹 On Even turns: DEF + 77%
          {
          type: "startOfTurn",
          defBoost: 0.77,
          guardsAll: true,
          condition: (ctx) => ctx.turnNow % 2 === 0,
          description: "\nOn even turns: DEF +77%"
          },

          // Super Attack: Is gonna pay: Greatly Raises ATK
          {
            type: "superAttack",
            atkBoost: 0.3,
            turns: 999
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },
  
      15: {
        name: "SSGSS Kaioken Goku",
        baseAtk: 22000,
        baseDef: 17000,
        baseHp: 89000,
        passives: [
          // 🔹 Always Active: ATK & DEF +159%
          {
            type: "startOfTurn",
            atkBoost: 1.59,
            defBoost: 1.59,
            critChance: 0.7,
            extraAttackChance: 0.7,
            damageReduction: 0.7,
            description: "Start of Turn: ATK & DEF +159%, 70% damage reduction and chance to launch an additional super attack"
          },
  
          // 🔹 When attacking: ATK +77% and DEF +77%, launches an additional super
          {
            type: "onAttack",
            atkBoost: 0.77,
            defBoost: 0.77,
            extraAttackChance: 1,
            description: "\n When Attacking: ATK +300%, DEF +200%, launches additional Super Attack"
          },

          // Super Attack: Kaioken Rush: Raises ATK, Greatly raises DEF for 1 turn
          {
            type: "superAttack",
            atkBoost: 0.1,
            turns: 999
          },
          {
            type: "superAttack",
            defBoost: 0.3,
            turns: 1
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },
  
      16: {
        name: "Vegito Blue",
        baseAtk: 19000,
        baseDef: 17950,
        baseHp: 86000,
        passives: [
          // 🔹 Always Active: ATK & DEF +159%
          {
          type: "startOfTurn",
          atkBoost: 1.59,
          defBoost: 1.59,
          guardsAll: true,
          extraAttackChance: 1,
          description: "Start of Turn: ATK & DEF +159%, guards all attacks, launches an additional Super Attack"
          },

          // 🔹 When attacking: ATK +500%, DEF +170%, guaranteed crit
          {
          type: "onAttack",
          atkBoost: 5.0,
          defBoost: 1.7,
          critChance: 1,
          extraAttackChance: 1,
          description: "\nWhen Attacking: ATK +500%, DEF +170%, guaranteed crits, launches an additional Super Attack"
          },

          // Super Attack: Final Kamehameha: Greatly Raises DEF
          {
            type: "superAttack",
            defBoost: 0.3,
            turns: 999
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      17: {
        name: "Gogeta Blue",
        baseAtk: 17950,
        baseDef: 19000,
        baseHp: 86000,
        passives: [
          // 🔹 Always Active: ATK +200%, DEF +170%, performs an additional super attack
          {
          type: "startOfTurn",
          atkBoost: 2,
          defBoost: 1.7,
          damageReduction: 0.5,
          guardsAll: true,
          extraAttackChance: 1,
          description: "ATK +200%, DEF +170%, 50% damage reduction, Guards all attacks, performs an additional super attack"
          },
  
          // 🔹 When attacking: ATK +159%, DEF +159%, guaranteed crit
          {
          type: "onAttack",
          atkBoost: 1.59,
          defBoost: 1.59,
          critChance: 1,
          description: "ATK & DEF +159%, guaranteed crits"
          },

          // Super Attack: Meteor Combination: Massively Raises ATK and DEF for 1 turn
          {
            type: "superAttack",
            atkBoost: 1,
            defBoost: 1,
            turns: 1
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      18: {
        name: "Kurapika",
        baseAtk: 24020,
        baseDef: 24030,
        baseHp: 94040,
        passives: [
          // 🔹 Always Active: ATK & DEF +250%
          {
          type: "startOfTurn",
          atkBoost: 2.5,
          defBoost: 2.5,
          guardsAll: true,
          damageReduction: 0.44,
          extraAttackChance: 1,
          description: "Start of Turn: ATK & DEF +250%, 44% damage reduction, Guards all attacks, performs an additional Super Attack"
          },
  
          // 🔹 When attacking: DEF +300%
          {
          type: "onAttack",
          defBoost: 3.0,
          description: "\n When Attacking: DEF +300%"
          },
  
          // 🔹 First 3 turns: ATK & DEF +200%, great chance to super
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 3,
            atkBoost: 2.0,
            defBoost: 2.0,
            extraAttackChance: 0.7,
            superEffective: true,
            description: "\nATK & DEF +200%, 70% chance to additional, attacks are super effective for 3 turns"
          },

          // Super Attack: Emperor's Time: Massively Raises ATK for 1 turn
          {
            type: "superAttack",
            atkBoost: 1,
            turns: 1
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      19: {
        name: "Killua",
        baseAtk: 24700,
        baseDef: 18000,
        baseHp: 85000,
        passives: [
          // 🔹 Always Active: ATK & DEF +150%
          {
            type: "startOfTurn",
            atkBoost: 1.5,
            defBoost: 1.5,
            evadeChance: 0.7,
            description: "Start of Turn: ATK & DEF +150%"
          },
  
          // 🔹 First 5 turns: ATK & DEF +100%, high chance to super
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 5,
            atkBoost: 1.0,
            defBoost: 1.0,
            extraAttackChance: 0.5,
            evadeChance: 0.2,
            critChance: 1,
            description: "\nATK & DEF +100%, Great chance to crit/additional/evade for 5 turns"
          },
  
          // 🔹 When attacking: DEF +100%, effective against all types
          {
            type: "onAttack",
            defBoost: 1.0,
            superEffective: true,
            extraAttackChance: 0.5,
            description: "\nWhen Attacking: DEF +100%, super effective, 50% chance to additional super"
          },

          // Super Attack: Godspeed: Raises ATK, Raises DEF for 1 turn
          {
            type: "superAttack",
            atkBoost: 0.1,
            turns: 999
          },
          {
            type: "superAttack",
            defBoost: 0.1,
            turns: 1
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      20: {
        name: "Gon",
        baseAtk: 13000,
        baseDef: 13000,
        baseHp: 83000,
        passives: [
          // 🔹 Always Active: ATK & DEF +700%
          {
          type: "startOfTurn",
          atkBoost: 7.0,
          defBoost: 7.0,
          damageReduction: 0.7,
          critChance: 0.5,
          description: "Start of Turn: ATK & DEF +700%, 70% damage reduction, 50% chance to crit"
          },

          // 🔹 Every turn passed: ATK +10% up to 50%
          {
            type: "startOfTurn",
            condition: (ctx, id) => true,
            atkBoost: (ctx, id) => Math.min(0.1 * (ctx.turnNow - ctx.turnEntered[id]), 0.5),
            description: "\nATK +10% per turn since entry (up to 50%)"
          },

          // Super Attack: Final Janken: Massively raises ATK for 1 turn
          {
            type: "superAttack",
            atkBoost: 1,
            turns: 1
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      21: {
        name: "Leoreo",
        baseAtk: 22315,
        baseDef: 10400,
        baseHp: 100000,
        passives: [
          // 🔹 Always Active: ATK & DEF +100% and great chance to evade
          {
            type: "startOfTurn",
            atkBoost: 1.0,
            defBoost: 1.0,
            evadeChance: 0.7,
            description: "Start of Turn: ATK & DEF +100% and great chance to evade"
          },
    
          // 🔹 When attacking: ATK +477%, DEF +70%
          {
            type: "onAttack",
            atkBoost: 4.77,
            defBoost: 0.7,
            description: "\nWhen Attacking: ATK & DEF +70% when attacking"
          },
    
          // 🔹 After evading: ATK & DEF +177%
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.evaded[id] === true,
            atkBoost: 1.77,
            defBoost: 1.77,
            description: "\nATK & DEF +59% after evading within the turn"
          },

          // 🔹 Support: +100% DEF for one turn on swap-out
          {
            type: "onSwitchOut",
            defBoost: 1,
            description: "\nDEF +100% on swapped-out character for one turn",
            turns: 1
          },
  
          // Super Attack: Serious mode: Raises ATK and DEF for 1 turn
          {
            type: "superAttack",
            atkBoost: 0.1,
            defBoost: 0.1,
            turns: 1
          },
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },
  
      22: {
        name: "Jotaro (Star Platinum)",
        baseAtk: 19000,
        baseDef: 17000,
        baseHp: 91000,
        passives: [
          // 🔹 Always Active: ATK +100% & DEF +30%
          {
          type: "startOfTurn",
          atkBoost: 1.0,
          defBoost: 0.3,
          guardsAll: true,
          extraAttackChance: 1,
          description: "Start of Turn: ATK +100% & DEF +30%, Guards all attacks, Launches an additional Super Attack"
          },
  
          // 🔹 When attacking: ATK +100%, DEF +200%, effective against all types
          {
          type: "onAttack",
          atkBoost: 4.0,
          defBoost: 2.0,
          superEffective: true,
          extraAttackChance: 1,
          description: "\nWhen Attacking: ATK +400%, DEF +200%, attacks are super effective, launches an additional Super Attack"
          },
  
          // Super Attack: Ora Barrage: Raises DEF
          {
            type: "superAttack",
            defBoost: 0.1,
            turns: 999
          },
  
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.superAttackCounts[id] > 0,
            defBoost: (ctx, id) => Math.min(0.3 * ctx.superAttackCounts[id], 0.77), // Def +30% (up to 77%) per super
          }          
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },
  
      23: {
        name: "DIO (The World)",
        baseAtk: 17000,
        baseDef: 19000,
        baseHp: 91000,
        passives: [
          // 🔹 Always Active: ATK & DEF +100%, damage reduction +30%
          {
          type: "startOfTurn",
          atkBoost: 1.0,
          defBoost: 1.0,
          damageReduction: 0.3,
          description: "Start of turn: ATK & DEF +100%, 30% damage reduction"
          },
  
          // 🔹 First 3 turns: ATK & DEF +50%, great chance to super, great chance to crit
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 5,
            atkBoost: 0.5,
            defBoost: 0.5,
            extraAttackChance: 0.7,
            critChance: 0.7,
            description: "\nATK & DEF +50%, Great chance to crit/additional for 5 turns"
          },
  
          // 🔹 When attacking: ATK +200%, DEF +100%, effective against all types
          {
          type: "onAttack",
          atkBoost: 2.0,
          defBoost: 1.0,
          superEffective: true,
          extraAttackChance: 1,
          description: "\nWhen Attacking: ATK +200%, DEF +100%, attacks are super effective, launches an additional Super Attack"
          },

          // Super Attack: Timestop: Raises ATK
          {
            type: "superAttack",
            atkBoost: 0.1,
            turns: 999
          },
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },
  
      24: {
        name: "Golden Experience Requiem",
        baseAtk: 14500,
        baseDef: 16000,
        baseHp: 96000,
        passives: [
          // 🔹 Always Active: ATK & DEF +150%, Great chance to super, Guards all attacks
          {
          type: "startOfTurn",
          atkBoost: 1.5,
          defBoost: 1.5,
          extraAttackChance: 0.7,
          damageReduction: 0.5,
          description: "Start of Turn: ATK & DEF +159%, 70% chance to super, 50% damage reduction"
          },
  
          // 🔹 When attacking: ATK +250% & DEF +150%, effective against all types
          {
          type: "onAttack",
          atkBoost: 2.5,
          defBoost: 1.5,
          superEffective: true,
          damageReduction: 0.2,
          extraAttackChance: 1,
          description: "\n When Attacking: ATK +250%, DEF +150%, Attacks are Super Effective, 20% damage reduction, Performs an additional Super Attack"
          },

          // Super Attack: GER: Raises ATk and DEF for 3 turns
          {
            type: "superAttack",
            atkBoost: 0.1,
            defBoost: 0.1,
            turns: 3
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },
  
      25: {
        name: "Isagi",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 95000,
        passives: [
          // 🔹 Always Active: ATK +50%, DEF +400%
          {
          type: "startOfTurn",
          atkBoost: 0.5,
          defBoost: 0.5,
          guardsAll: true,
          critChance: 1,
          extraAttackChance: 1,
          description: "Start of Turn: ATK +50%, DEF +400%, Guards all attacks, performs a critical hit and an additional Super Attack"
          },

          // Lowering Damage Reduction
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 4,
            damageReduction: (ctx, id) => {
              const diff = ctx.turnNow - ctx.turnEntered[id];
              return Math.max(0, 0.9 - diff * 0.3);
            },
            description: "\nDamage reduction 90% (-30% per turn from entry)"
          },          
  
          // 🔹 When attacking: ATK +777% and launches an additional super
          {
          type: "onAttack",
          atkBoost: 7.77,
          extraAttackChance: 1,
          description: "\nWhen Attacking: ATK +777%, launches additional Super Attack"
          },

          // Super Attack: Ore Wa Strika Da: Massively Raises DEF
          {
            type: "superAttack",
            defBoost: 1,
            turns: 999
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },
  
      26: {
        name: "Rafal",
        baseAtk: 26606,
        baseDef: 16060,
        baseHp: 86000,
        passives: [
          // 🔹 Always Active: ATK & DEF +20%
          {
          type: "startOfTurn",
          atkBoost: 0.2,
          defBoost: 0.2,
          damageReduction: 0.2,
          description: "ATK & DEF +20%, 20% damage reduction"
          },

          // 50% DR setup
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 5,
            damageReduction: 0.5,
            description: "\nDamage Reduction +50% for 5 turns from entry"
          },

          // 🔹 When attacking: ATK +666%, DEF +666%, guaranteed crit
          {
          type: "onAttack",
          atkBoost: 6.66,
          defBoost: 6.66,
          critChance: 1,
          damageReduction: 0.2,
          extraAttackChance: 1,
          guardsAll: true,
          description: "\nWhen Attacking: ATK and DEF +666%, guaranteed crits, launches an additional Super Attack, 20% damage reduction"
          },

          // Super Attack: Science: Greatly Raises DEF
          {
            type: "superAttack",
            defBoost: 0.3,
            turns: 999
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      27: {
        name: "Sung Jin Woo",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 95000,
        passives: [
          // 🔹 Always Active: ATK +500%, DEF +700%
          {
            type: "startOfTurn",
            atkBoost: 5.0,
            defBoost: 7.0,
            damageReduction: 0.25,
            description: "Start of Turn: ATK +500%, DEF +700%, 25% damage reduction"
          },
  
          // 🔹 When attacking: ATK +100%, DEF +50%, high chance to crit
          {
            type: "onAttack",
            atkBoost: 1.0,
            defBoost: 0.5,
            critChance: 0.5,
            damageReduction: 0.25,
            extraAttackChance: 1,
            description: "ATK +100%, DEF +50%, 50% chance to crit, 25% damage reduction, launches an additional Super Attack"
          },

          // Super Attack: Aura: Raises ATK and DEF for 1 turn
          {
            type: "superAttack",
            atkBoost: 0.1,
            defBoost: 0.1,
            turns: 1
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      28: {
        name: "Lelouch",
        baseAtk: 14500,
        baseDef: 12000,
        baseHp: 95000,
        passives: [
          // 🔹 Always Active: ATK & DEF +150%
          {
          type: "startOfTurn",
          atkBoost: 1.5,
          defBoost: 1.5,
          superEffective: true,
          extraAttackChance: 1,
          guardsAll: true,
          damageReduction: 0.2,
          description: "Start of Turn: ATK & DEF +150%, attacks are super effective, Guards all attacks, 20% damage reduction, launches an additional Super Attack"
          },
  
          // 🔹 First 5 turns: ATK & DEF +500%, great chance to super
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 5,
            atkBoost: 5.0,
            defBoost: 5.0,
            extraAttackChance: 0.7,
            damageReduction: 0.5,
            description: "\nATK & DEF +500%, 50% damage reduction, 70% chance to additional for 5 turns from entry"
          },

          // 🔹 When attacking: ATK +300%, great chance to additional super
          {
            type: "onAttack",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] >= 3,
            atkBoost: 1.0,
            extraAttackChance: 0.7,
            description: "ATK +300% and great chance to additional super when attacking"
          },

          // Super Attack: All Hail Lelouch: Raises ATK and DEF
          {
            type: "superAttack",
            defBoost: 0.1,
            atkBoost: 0.1,
            turns: 999
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      29: {
        name: "Ash Ketchum",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 99000,
        passives: [
          // 🔹 Always Active: ATK & DEF +100%
          {
          type: "startOfTurn",
          atkBoost: 1,
          defBoost: 1,
          description: "Start of Turn: ATK & DEF +100%"
          },
  
          // 🔹 First 10 turns: ATK & DEF +777%, high chance to super
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 10,
            atkBoost: 9.99,
            defBoost: 9.99,
            extraAttackChance: 0.1,
            evadeChance: 0.5,
            damageReduction: 1,
            critChance: 1,
            description: "\nATK & DEF +999%, 10% chance to additional, 50% chance to evade, 100% damage reduction, performs a critical hit for 10 turns from entry"
          },
  
          // 🔹 When attacking: Effective against all types
          {
          type: "onAttack",
          superEffective: true,
          description: "\nWhen Attacking: Attacks are super effective"
          },

          // Super Attack: Omnipotency: Greatly Raises DEF
          {
            type: "superAttack",
            defBoost: 0.3,
            turns: 999
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      },

      30: {
        name: "Gary Oak (Arceus)",
        baseAtk: 14000,
        baseDef: 17000,
        baseHp: 99000,
        passives: [
          // 🔹 Always Active: ATK & DEF +999%
          {
          type: "startOfTurn",
          atkBoost: 9.99,
          defBoost: 9.99,
          damageReduction: 0.9,
          critChance: 0.9,
          description: "Start of Turn: ATK & DEF +999%, 90% damage reduction and chance to crit"
          },

          // Super Attack: Judgment: Massively Raises ATK for 1 turn
          {
            type: "superAttack",
            atkBoost: 1,
            turns: 1
          }
        ],
        super: "/assets/animations/allgodly.mp4",
        additional: "/assets/animations/common.mp4",
      }
  };
  
  export default characterDetails;
  
  