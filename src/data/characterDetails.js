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
  
        // 🔹 First 5 turns: DEF +159%, great chances...
        {
          type: "startOfTurn",
          condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 5,
          defBoost: 1.59,
          critChance: 1,
          extraAttackChance: 0.7,
          evadeChance: 0.7,
          description: "DEF +159%, 70% chance to crit/additional/evade for 5 turns"
        },
  
        // 🔹 From turn 6 onward: DEF +59%, high chances...
        {
          type: "startOfTurn",
          condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] >= 5,
          defBoost: 0.59,
          critChance: 0.5,
          evadeChance: 0.5,
          description: "DEF +59%, 50% chance to crit/additional/evade from turn 6"
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
          description: "ATK & DEF +200%"
        },

        // 🔹 Support: +10% DEF for one turn on swap-out
        {
          type: "onSwitchOut",
          defBoost: 0.1,
          description: "DEF +10% on swap-out for one turn"
        },

        // 🔹 First 3 turns from entry: DEF +300%, Guard
        {
          type: "startOfTurn",
          condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 3,
          defBoost: 3.0,
          guardsAll: true,
          description: "DEF +300%, guards all attacks for 3 turns"
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
            description: "ATK & DEF +66%, 70% chance to additional super for 5 turns"
          },
    
          // 🔹 From turn 6 onward: DEF +132%, high chance to super and evade
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] >= 5,
            defBoost: 1.32,
            critChance: 0.5,
            extraAttackChance: 0.5,
            evadeChance: 0.5,
            description: "DEF +132%, 50% chance to crit/additional/evade from turn 6"
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

          // Super Attack: Meteor Blaster
          {
            type: "superAttack",
            atkBoost: 0.1,
            defBoost: 0.1,
            description: "Raises ATK and DEF for 1 turn",
            turns: 1
          }
        ],
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
          extraAttackChance: 0.7,
          description: "ATK & DEF +359%, 70% chance to additional super, Guards all attacks"
          },
  
          // 🔹 When attacking: ATK & DEF +200%, effective against all types
          {
          type: "onAttack",
          atkBoost: 2.0,
          defBoost: 2.0,
          superEffective: true,
          extraAttackChance: 1,
          description: "ATK & DEF +200%, super effective, performs an additional super"
          },

          // Super Attack: Vegito Special: Greatly Raises ATK and DEF
          {
            type: "superAttack",
            atkBoost: 0.3,
            defBoost: 0.3,
            turns: 999
          }
          ],
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
  
          // 🔹 When attacking: ATK +159%, DEF +59%, launches an additional super
          {
          type: "onAttack",
          atkBoost: 1.59,
          defBoost: 0.59,
          extraAttackChance: 1,
          description: "\nWhen Attacking: ATK +159%, DEF +59%, launches an additional Super Attack"
          },

          // Super Attack: Gogeta Special: Raises ATK and DEF for 1 turn
          {
            type: "superAttack",
            atkBoost: 0.1,
            defBoost: 0.1,
            turns: 1
          }
        ],
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
          description: "Start of Turn: ATK & DEF +159%"
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
            description: "ATK & DEF +59%, 70% chance to additional super for 3 turns"
          },

          // Super Attack: Power Pole Assault: Massively Raises ATK and DEF
          {
            type: "superAttack",
            atkBoost: 1,
            defBoost: 1,
            turns: 999
          }
        ],
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
          description: "Start of turn: ATK & DEF +400%"
          },
  
          // 🔹 When attacking: DEF +300%
          {
          type: "onAttack",
          defBoost: 4.0,
          description: "\n When attacking: DEF +300%"
          },

          // Super Attack: Vegeta Onslaught: Massively Raises ATK
          {
            type: "superAttack",
            atkBoost: 1,
            turns: 999
          }
        ],
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
            description: "Start of Turn: ATK & DEF +250%"
          },
  
          // 🔹 From turn 6 onward: DEF +50%, high chance to super and evade
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] >= 5,
            defBoost: 0.5,
            critChance: 0.5,
            evadeChance: 0.5,
            description: "DEF +50% & 50% chance to crit/evade from turn 6"
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
            description: "Start of turn: ATK & DEF +500%"
          },

          // 🔹 When attacking: ATK +66%, effective against all types
          {
            type: "onAttack",
            atkBoost: 0.66,
            superEffective: true,
            description: "\n When attacking: ATK +66%, super effective"
          },

          // 🔹 Every turn passed: ATK +6%
          {
            type: "startOfTurn",
            condition: (ctx, id) => true,
            atkBoost: (ctx, id) => 0.06 * (ctx.turnNow - ctx.turnEntered[id]),
            description: "\n ATK +6% for every turn"
          },

          // Super Attack: Third Eye: Greatly Raises DEF
          {
            type: "superAttack",
            defBoost: 0.3,
            turns: 999
          }
        ],
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
            description: "ATK & DEF +200%"
          },
    
          // 🔹 When attacking: ATK & DEF +159%
          {
            type: "onAttack",
            atkBoost: 1.59,
            defBoost: 1.59,
            description: "ATK & DEF +159% when attacking"
          },
    
          // 🔹 First 5 turns: DEF +59%, high chances...
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 5,
            defBoost: 0.59,
            critChance: 0.5,
            extraAttackChance: 0.5,
            evadeChance: 0.5,
            description: "DEF +59%, High chance to crit/additional/evade for 5 turns"
          },
    
          // 🔹 From turn 6 onward: DEF +159%, great chances...
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] >= 5,
            defBoost: 1.59,
            critChance: 0.77,
            extraAttackChance: 0.77,
            evadeChance: 0.77,
            description: "DEF +59%, Great chance to crit/additional/evade after turn 6"
          },
    
          // 🔹 After evading: ATK & DEF +77%
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.evaded[id] === true,
            atkBoost: 0.77,
            defBoost: 0.77,
            description: "ATK & DEF +59% after evading within the turn"
          },
  
          // Super Attack: Godly Display
          {
            type: "superAttack",
            atkBoost: 0.1,
            defBoost: 0.1,
            description: "Raises ATK and DEF",
            turns: 999
          },
  
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.superAttackCounts[id] > 0,
            atkBoost: (ctx, id) => 0.01 * ctx.superAttackCounts[id], // 1% atk per super
          }
        ],
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
          description: "ATK & DEF +200%"
          },
  
          // 🔹 Support: +40% DEF for one turn on swap-out
          {
          type: "onSwitchOut",
          defBoost: 0.4,
          description: "DEF +40% on swap-out for one turn",
          turns: 1
          },
  
          // 🔹 When attacking: ATK +244%, DEF +44%, effective against all types
          {
          type: "onAttack",
          atkBoost: 2.44,
          defBoost: 0.44,
          critChance: 1,
          extraAttackChance: 1,
          description: "ATK +200%, DEF +100%, super effective, launches additional Super Attack"
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
          description: "ATK & DEF +300%"
          },
  
          // 🔹 First 3 turns: ATK & DEF +90%, great chance to super
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 3,
            atkBoost: 0.9,
            defBoost: 0.9,
            extraAttackChance: 0.7,
            description: "ATK & DEF +90%, Great chance to crit/additional/evade for 5 turns"
          },
    
          // 🔹 From turn 4 onward: ATK & DEF +33, high chance to super 
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] >= 3,
            defBoost: 0.33,
            atkBoost: 0.33,
            critChance: 0.5,
            description: "DEF +59%, High chance to crit/additional after turn 6"
          },
  
          // 🔹 When attacking: ATK +33%, DEF +33%, effective against all types
          {
          type: "onAttack",
          atkBoost: 0.33,
          defBoost: 0.33,
          superEffective: true,
          extraAttackChance: 1,
          description: "ATK +200%, DEF +100%, super effective, launches additional Super Attack"
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
          description: "ATK & DEF +159%, Great chance to super, Guards all attacks"
          },
  
          // 🔹 When attacking: ATK +70% & DEF +100%, effective against all types
          {
          type: "onAttack",
          atkBoost: 0.7,
          defBoost: 1.0,
          superEffective: true,
          damageReduction: 0.7,
          extraAttackChance: 1,
          description: "ATK +200%, DEF +200%"
          },
  
          // 🔹 On Even turns: DEF + 77%
          {
          type: "startOfTurn",
          defBoost: 0.77,
          guardsAll: true,
          condition: (ctx) => ctx.turnNow % 2 === 0,
          description: "On even turns: DEF +77%"
          },

          // Super Attack: Is gonna pay: Greatly Raises ATK
          {
            type: "superAttack",
            atkBoost: 0.3,
            turns: 999
          }
          ],
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
            damageReduction: 0.35,
            description: "ATK & DEF +159%"
          },
  
          // 🔹 When attacking: ATK +77% and DEF +77%, launches an additional super
          {
            type: "onAttack",
            atkBoost: 0.77,
            defBoost: 0.77,
            extraAttackChance: 1,
            description: "ATK +300%, DEF +200%, launches additional Super Attack"
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
      },
  
      16: {
        name: "Vegito Blue",
        baseAtk: 19000,
        baseDef: 17950,
        baseHp: 86000,
        passives: [
          // 🔹 Always Active: ATK & DEF +59%
          {
          type: "startOfTurn",
          atkBoost: 0.59,
          defBoost: 0.59,
          extraAttackChance: 1,
          description: "ATK & DEF +59%"
          },

          // 🔹 When attacking: ATK +700%, DEF +170%, guaranteed crit
          {
          type: "onAttack",
          atkBoost: 7.0,
          defBoost: 1.7,
          critChance: 1,
          extraAttackChance: 1,
          description: "ATK +600%, DEF +500%, guaranteed crits, launches additional Super Attack"
          },

          // Super Attack: Final Kamehameha: Greatly Raises DEF
          {
            type: "superAttack",
            defBoost: 0.3,
            turns: 999
          }
        ],
      },

      17: {
        name: "Gogeta Blue",
        baseAtk: 17950,
        baseDef: 19000,
        baseHp: 86000,
        passives: [
          // 🔹 Always Active: ATK & DEF +159%
          {
          type: "startOfTurn",
          atkBoost: 1.59,
          defBoost: 1.59,
          extraAttackChance: 1,
          description: "ATK & DEF +159%"
          },
  
          // 🔹 When attacking: ATK +59%, DEF +59%, guaranteed crit
          {
          type: "onAttack",
          atkBoost: 0.59,
          defBoost: 0.59,
          critChance: 1,
          extraAttackChance: 1,
          description: "ATK +300%, DEF +400%, guaranteed crits, launches additional Super Attack"
          },

          // Super Attack: Meteor Combination: Massively Raises ATK and DEF for 1 turn
          {
            type: "superAttack",
            atkBoost: 1,
            defBoost: 1,
            turns: 1
          }
        ],
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
          extraAttackChance: 1,
          description: "ATK & DEF +250%"
          },
  
          // 🔹 When attacking: DEF +300%
          {
          type: "onAttack",
          defBoost: 3.0,
          description: "DEF +300%"
          },
  
          // 🔹 First 3 turns: ATK & DEF +200%, great chance to super
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 3,
            atkBoost: 2.0,
            defBoost: 2.0,
            extraAttackChance: 0.7,
            superEffective: true,
            description: "ATK & DEF +200%, Great chance to crit/additional/evade for 5 turns"
          },

          // Super Attack: Emperor's Time: Massively Raises ATK for 1 turn
          {
            type: "superAttack",
            atkBoost: 1,
            turns: 999
          }
        ],
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
            evadeChance: 0.5,
            description: "ATK & DEF +150%"
          },
  
          // 🔹 First 5 turns: ATK & DEF +100%, high chance to super
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 5,
            atkBoost: 1.0,
            defBoost: 1.0,
            extraAttackChance: 0.5,
            evadeChance: 0.4,
            critChance: 1,
            description: "ATK & DEF +100%, Great chance to crit/additional/evade for 5 turns"
          },
  
          // 🔹 When attacking: DEF +100%, effective against all types
          {
            type: "onAttack",
            defBoost: 1.0,
            superEffective: true,
            extraAttackChance: 0.5,
            description: "DEF +100%, super effective"
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
          description: "ATK & DEF +700%"
          },

          // 🔹 Every turn passed: ATK +10% up to 50%
          {
            type: "startOfTurn",
            condition: (ctx, id) => true,
            atkBoost: (ctx, id) => Math.min(0.1 * (ctx.turnNow - ctx.turnEntered[id]), 0.5),
            description: "ATK +10% per turn since entry (up to 50%)"
          },

          // Super Attack: Final Janken: Massively raises ATK for 1 turn
          {
            type: "superAttack",
            atkBoost: 1,
            turns: 1
          }
        ],
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
            description: "ATK & DEF +100% and great chance to evade"
          },
    
          // 🔹 When attacking: ATK +477%, DEF +70%
          {
            type: "onAttack",
            atkBoost: 4.77,
            defBoost: 0.7,
            description: "ATK & DEF +70% when attacking"
          },
    
          // 🔹 After evading: ATK & DEF +177%
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.evaded[id] === true,
            atkBoost: 1.77,
            defBoost: 1.77,
            description: "ATK & DEF +59% after evading within the turn"
          },

          // 🔹 Support: +100% DEF for one turn on swap-out
          {
            type: "onSwitchOut",
            defBoost: 1,
            description: "DEF +100% on swap-out for one turn",
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
          description: "ATK +400% & DEF +30%, Guards all attacks"
          },
  
          // 🔹 When attacking: ATK +100%, DEF +200%, effective against all types
          {
          type: "onAttack",
          atkBoost: 4.0,
          defBoost: 2.0,
          superEffective: true,
          extraAttackChance: 1,
          description: "ATK +100%, DEF +200%, super effective, launches additional Super Attack"
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
          description: "ATK & DEF +300%"
          },
  
          // 🔹 First 3 turns: ATK & DEF +50%, great chance to super, great chance to crit
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 3,
            atkBoost: 0.5,
            defBoost: 0.5,
            extraAttackChance: 0.7,
            critChance: 0.7,
            description: "ATK & DEF +90%, Great chance to crit/additional/evade for 5 turns"
          },
  
          // 🔹 When attacking: ATK +200%, DEF +100%, effective against all types
          {
          type: "onAttack",
          atkBoost: 2.0,
          defBoost: 1.0,
          superEffective: true,
          extraAttackChance: 1,
          description: "ATK +200%, DEF +100%, super effective, launches additional Super Attack"
          },
  

          // Super Attack: Timestop: Raises ATK
          {
            type: "superAttack",
            atkBoost: 0.1,
            turns: 999
          },
        ],
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
          description: "ATK & DEF +159%, Great chance to super, Guards all attacks"
          },
  
          // 🔹 When attacking: ATK +250% & DEF +150%, effective against all types
          {
          type: "onAttack",
          atkBoost: 2.5,
          defBoost: 1.5,
          superEffective: true,
          damageReduction: 0.7,
          extraAttackChance: 1,
          description: "ATK +250%, DEF +150%"
          },

          // Super Attack: GER: Raises ATk and DEF for 3 turns
          {
            type: "superAttack",
            atkBoost: 0.1,
            defBoost: 0.1,
            turns: 3
          }
          ],
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
          defBoost: 4.0,
          critChance: 1,
          extraAttackChance: 1,
          description: "ATK & DEF +50%"
          },
  
          // 🔹 When attacking: ATK +777% and launches an additional super
          {
          type: "onAttack",
          atkBoost: 7.77,
          extraAttackChance: 1,
          description: "ATK +300%, DEF +200%, launches additional Super Attack"
          },

          // 🔹 When attacking: DEF +7%
          {
            type: "onAttack",
            defBoost: 0.07,
            description: "ATK +300%, DEF +400%, guaranteed crits, launches additional Super Attack"
          },

          // Super Attack: Ore Wa Strika Da: Massively Raises DEF
          {
            type: "superAttack",
            defBoost: 1,
            turns: 999
          }
        ],
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
          description: "ATK & DEF +20%"
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
          description: "ATK +600%, DEF +500%, guaranteed crits, launches additional Super Attack"
          },

          // Super Attack: Science: Greatly Raises DEF
          {
            type: "superAttack",
            defBoost: 0.3,
            turns: 999
          }
        ],
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
            description: "ATK & DEF +200%"
          },
  
          // 🔹 When attacking: ATK +100%, DEF +50%, high chance to crit
          {
            type: "onAttack",
            atkBoost: 1.0,
            defBoost: 0.5,
            critChance: 0.5,
            damageReduction: 0.25,
            extraAttackChance: 1,
            description: "ATK +100%, DEF +50%, guaranteed crits, launches additional Super Attack"
          },

          // Super Attack: Aura: Raises ATK and DEF for 1 turn
          {
            type: "superAttack",
            atkBoost: 0.1,
            defBoost: 0.1,
            turns: 1
          }
        ],
      },

      28: {
        name: "Lelouch",
        baseAtk: 12500,
        baseDef: 8000,
        baseHp: 95000,
        passives: [
          // 🔹 Always Active: ATK & DEF +150%
          {
          type: "startOfTurn",
          atkBoost: 1.5,
          defBoost: 1.5,
          superEffective: true,
          extraAttackChance: 1,
          description: "ATK & DEF +150%"
          },
  
          // 🔹 First 5 turns: ATK & DEF +500%, great chance to super
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 5,
            atkBoost: 5.0,
            defBoost: 5.0,
            extraAttackChance: 0.7,
            description: "ATK & DEF +500%, Great chance to crit/additional/evade for 5 turns"
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
          description: "ATK & DEF +100%"
          },
  
          // 🔹 First 10 turns: ATK & DEF +777%, high chance to super
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 10,
            atkBoost: 1.0,
            defBoost: 1.0,
            extraAttackChance: 0.5,
            evadeChance: 0.5,
            damageReduction: 1,
            critChance: 1,
            description: "ATK & DEF +100%, Great chance to crit/additional/evade for 5 turns"
          },
  
          // 🔹 When attacking: ATK +100%, effective against all types
          {
          type: "onAttack",
          atkBoost: 1.0,
          superEffective: true,
          description: "ATK +100%, super effective"
          },

          // Super Attack: Omnipotency: Greatly Raises DEF
          {
            type: "superAttack",
            defBoost: 0.3,
            turns: 999
          }
        ],
      },

      30: {
        name: "Gary Oak Arceus",
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
          description: "ATK & DEF +999%"
          },

          // Super Attack: Judgment: Massively Raises ATK for 1 turn
          {
            type: "superAttack",
            atkBoost: 1,
            turns: 1
          }
        ],
      }
  };
  
  export default characterDetails;
  
  