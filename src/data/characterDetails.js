const characterDetails = {
    1: {
      name: "Super Saiyan Goku",
      baseAtk: 560,
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
          defBoost: 1.59,
          critChance: 1,
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
  
        // 🔹 After evading: ATK & DEF +59%
        {
          type: "startOfTurn",
          condition: (ctx, id) => ctx.evaded[id] === true,
          atkBoost: 0.59,
          defBoost: 0.59,
          description: "ATK & DEF +59% after evading within the turn"
        },

        // Super Attack: Warp Kamehameha
        {
          type: "superAttack",
          atkBoost: 0.1,
          description: "Raises ATK",
          turns: 999
        },

        {
          type: "startOfTurn",
          condition: (ctx, id) => ctx.superAttackCounts[id] > 0, // Only activate if at least 1 super performed
          atkBoost: (ctx, id) => 0.1 * ctx.superAttackCounts[id], // 10% atk per super
        }
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
        atkBoost: 3.0,
        defBoost: 3.0,
        description: "ATK & DEF +200%"
        },

        // 🔹 Support: +10% DEF for one turn on swap-out
        {
        type: "onSwitchOut",
        defBoost: 9.1,
        description: "DEF +10% on swap-out for one turn"
        },

        // 🔹 First 3 turns from entry: DEF +300%, Guard
        {
        type: "startOfTurn",
        condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 3,
        defBoost: 4.0,
        guardsAll: true,
        description: "DEF +300%, guards all attacks for 3 turns from entry"
        },

        // 🔹 When attacking: ATK +200%, DEF +100%, effective against all types
        {
        type: "onAttack",
        atkBoost: 3.0,
        defBoost: 2.0,
        superEffective: true,
        extraAttackChance: 1,
        description: "ATK +200%, DEF +100%, super effective, launches additional Super Attack"
        },

        // 🔹 On Switch-In: Guard + Great chance to launch additional super
        {
        type: "onSwitchIn",
        oncePerEntry: true,
        guardsAll: true,
        description: "Each time this unit is switched in: Guards all, launches additional with great chance"
        },

        // Super Attack: Burning Stars Cannon
        {
          type: "superAttack",
          defBoost: 1.1,
          description: "Raises DEF",
          turns: 999
        }
      ],
    },

    3: {
      name: "FPSSJ Broly",
      baseAtk: 24000,
      baseDef: 14000,
      baseHp: 25000,
      passives: [
          // 🔹 Always Active: ATK & DEF +400%
          {
          type: "startOfTurn",
          atkBoost: 5.0,
          defBoost: 5.0,
          description: "ATK & DEF +400%"
          },
  
          // 🔹 First 5 turns: DEF +66%, great chance to super
        {
          type: "startOfTurn",
          condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 5,
          atkBoost: 1.66,
          defBoost: 1.66,
          extraAttackChance: 0.7,
          description: "DEF +159%, Great chance to crit/additional/evade for 5 turns"
        },
  
        // 🔹 From turn 6 onward: DEF +22%, high chance to super and evade
        {
          type: "startOfTurn",
          condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] >= 5,
          defBoost: 1.59,
          critChance: 0.5,
          extraAttackChance: 0.5,
          evadeChance: 0.5,
          description: "DEF +59%, High chance to crit/additional after turn 6"
        },
  
          // 🔹 When attacking: ATK +200%, DEF +100%, effective against all types
          {
          type: "onAttack",
          atkBoost: 3.0,
          defBoost: 2.0,
          superEffective: true,
          extraAttackChance: 1,
          description: "ATK +200%, DEF +100%, super effective, launches additional Super Attack"
          },
  
          // 🔹 On Switch-In: Guard + Great chance to launch additional super
          {
          type: "onSwitchIn",
          oncePerEntry: true,
          guardsAll: true,
          extraAttackChance: 0.7,
          description: "Each time this unit is switched in: Guards all, launches additional with great chance"
          },

          // Super Attack: Meteor Blaster
          {
            type: "superAttack",
            atkBoost: 1.1,
            defBoost: 1.1,
            description: "Raises ATK and DEF for 1 turn",
            turns: 1
          }
        ],
      },

      4: {
        name: "Super Vegito",
        baseAtk: 24500,
        baseDef: 15000,
        baseHp: 22000,
        passives: [
          // 🔹 Always Active: ATK & DEF +359%, Great chance to super, Guards all attacks
          {
          type: "startOfTurn",
          atkBoost: 4.59,
          defBoost: 4.59,
          guardsAll: true,
          extraAttackChance: 0.7,
          description: "ATK & DEF +359%, Great chance to super, Guards all attacks"
          },
  
          // 🔹 When attacking: ATK +200%, DEF +200%, effective against all types
          {
          type: "onAttack",
          atkBoost: 3.0,
          defBoost: 3.0,
          superEffective: true,
          extraAttackChance: 1,
          description: "ATK +200%, DEF +200%"
          },
  
          // 🔹 On Switch-In: Great chance to launch additional super
          {
          type: "onSwitchIn",
          oncePerEntry: true,
          extraAttackChance: 0.7,
          description: "Each time this unit is switched in: Launches additional with great chance"
          },

          // Super Attack: Vegito Special
          {
            type: "superAttack",
            atkBoost: 1.3,
            defBoost: 1.3,
            description: "Greatly Raises ATK and DEF",
            turns: 999
          }
          ],
      },

      5: {
        name: "Super Gogeta",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
        passives: [
          // 🔹 Always Active: ATK & DEF +400%
          {
          type: "startOfTurn",
          atkBoost: 4.59,
          defBoost: 4.59,
          critChance: 0.7,
          evadeChance: 0.7,
          extraAttackChance: 0.7,
          damageReduction: 0.5,
          guardsAll: true,
          description: "ATK & DEF +400%"
          },
  
          // 🔹 When attacking: ATK +300%, DEF +200%, launches an additional super
          {
          type: "onAttack",
          atkBoost: 4.0,
          defBoost: 3.0,
          extraAttackChance: 1,
          description: "ATK +300%, DEF +200%,launches additional Super Attack"
          },

          // Super Attack: Gogeta Special
          {
            type: "superAttack",
            atkBoost: 1.3,
            defBoost: 1.3,
            description: "Greatly Raises ATK and DEF",
            turns: 999
          }
        ],
      },

      6: {
        name: "SSJ4 Daima Goku",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
        passives: [
          // 🔹 Always Active: ATK & DEF +159%
          {
          type: "startOfTurn",
          atkBoost: 2.59,
          defBoost: 2.59,
          description: "ATK & DEF +159%"
          },

          // 🔹 When attacking: ATK +500%, DEF +300%, effective against all types
          {
          type: "onAttack",
          atkBoost: 6.0,
          defBoost: 4.0,
          superEffective: true,
          extraAttackChance: 1,
          description: "ATK +500%, DEF +300%, super effective, launches additional Super Attack"
          },

          // 🔹 On Switch-In: Guard + Great chance to evade
          {
          type: "onSwitchIn",
          oncePerEntry: true,
          guardsAll: true,
          evadeChance: 0.7,
          description: "Each time this unit is switched in: Guards all, great chance to evade all attacks"
          },

          // Super Attack: Ultra Kamehameha
          {
            type: "superAttack",
            defBoost: 1.3,
            description: "Greatly Raises DEF",
            turns: 999
          }
        ],
      },

      7: {
        name: "Super Saiyan Goku Daima",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
        passives: [
          // 🔹 Always Active: ATK & DEF +200%
          {
          type: "startOfTurn",
          atkBoost: 3.0,
          defBoost: 3.0,
          description: "ATK & DEF +200%"
          },
  
          // 🔹 First 5 turns: DEF +66%, great chance to super
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 5,
            atkBoost: 0.66,
            defBoost: 0.66,
            description: "DEF +66%, Great chance to crit/additional/evade for 5 turns"
          },

          // Super Attack: Power Pole Assault
          {
            type: "superAttack",
            atkBoost: 2.0,
            defBoost: 2.0,
            description: "Massively Raises ATK and DEF",
            turns: 999
          }
        ],
      },

      8: {
        name: "SSJ3 Vegeta",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
        passives: [
          // 🔹 Always Active: ATK & DEF +400%
          {
          type: "startOfTurn",
          atkBoost: 4.0,
          defBoost: 4.0,
          description: "ATK & DEF +400%"
          },
  
          // 🔹 When attacking: DEF +300%
          {
          type: "onAttack",
          defBoost: 4.0,
          description: "DEF +300%"
          },
  
          // 🔹 On Switch-In: Great chance to launch additional super
          {
          type: "onSwitchIn",
          oncePerEntry: true,
          extraAttackChance: 0.7,
          description: "Each time this unit is switched in: Launches additional with great chance"
          },

          // Super Attack: Vegeta Onslaught
          {
            type: "superAttack",
            atkBoost: 2,
            description: "Massively Raises ATK",
            turns: 999
          }
        ],
      },

      9: {
        name: "Glorio",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
        passives: [
          // 🔹 Always Active: ATK & DEF +250%
          {
          type: "startOfTurn",
          atkBoost: 3.5,
          defBoost: 3.5,
          description: "ATK & DEF +350%"
          },
  
          // 🔹 From turn 6 onward: DEF +50%, high chance to super and evade
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] >= 5,
            defBoost: 0.5,
            critChance: 0.5,
            extraAttackChance: 0.5,
            evadeChance: 0.5,
            description: "DEF +50%, High chance to crit/additional after turn 6"
          },
  
          // 🔹 When attacking: DEF +100%, effective against all types
          {
          type: "onAttack",
          defBoost: 1.0,
          superEffective: true,
          description: "DEF +100%, super effective"
          },

          // Super Attack: Magic
          {
            type: "superAttack",
            defBoost: 1.3,
            description: "Greatly Raises DEF",
            turns: 999
          }
        ],
      },

      10: {
        name: "Goma",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
        passives: [
          // 🔹 Always Active: ATK & DEF +500%
          {
          type: "startOfTurn",
          atkBoost: 6.0,
          defBoost: 6.0,
          description: "ATK & DEF +500%"
          },

          // 🔹 Every turn passed: ATK +30%
          {
            type: "startOfTurn",
            condition: (ctx, id) => true,
            atkBoost: (ctx, id) => 0.3 * (ctx.turnNow - ctx.turnEntered[id]),
            description: "ATK +30% per turn since entry"
          },

          // Super Attack: Third Eye
          {
            type: "superAttack",
            defBoost: 1.3,
            description: "Greatly Raises DEF",
            turns: 999
          }
        ],
      },

      11: {
        name: "Ultra Instinct Goku",
        baseAtk: 20,
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
            condition: (ctx, id) => ctx.superAttackCounts[id] > 0, // Only activate if at least 1 super performed
            atkBoost: (ctx, id) => 0.1 * ctx.superAttackCounts[id], // 10% atk per super
          }
        ],
      },
  
      12: {
        name: "Super Saiyan 4 Goku",
        baseAtk: 22000,
        baseDef: 16000,
        baseHp: 21000,
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
  
          // 🔹 When attacking: ATK +200%, DEF +100%, effective against all types
          {
          type: "onAttack",
          atkBoost: 3.0,
          defBoost: 2.0,
          superEffective: true,
          extraAttackChance: 1,
          description: "ATK +200%, DEF +100%, super effective, launches additional Super Attack"
          },
  
          // Super Attack: x10 Kamehameha
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
            defBoost: (ctx, id) => Math.min(0.3 * ctx.superAttackCounts[id], 0.77), // Def +30% (up to 77%) per super
          }          
        ],
      },
  
      13: {
        name: "Super Saiyan 3 Goku",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
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
            defBoost: 1.59,
            critChance: 0.5,
            extraAttackChance: 0.5,
            description: "DEF +59%, High chance to crit/additional after turn 6"
          },
  
          // 🔹 When attacking: ATK +200%, DEF +100%, effective against all types
          {
          type: "onAttack",
          atkBoost: 3.0,
          defBoost: 2.0,
          superEffective: true,
          extraAttackChance: 1,
          description: "ATK +200%, DEF +100%, super effective, launches additional Super Attack"
          },
  

          // Super Attack: Meteor Attack
          {
            type: "superAttack",
            defBoost: 1.1,
            description: "Raises DEF for 1 turn",
            turns: 1
          },
          {
            type: "superAttack",
            atkBoost: 1.1,
            description: "Raises ATK",
            turns: 999
          },
        ],
      },
  
      14: {
        name: "SSGSS Goku",
        baseAtk: 24500,
        baseDef: 15000,
        baseHp: 22000,
        passives: [
          // 🔹 Always Active: ATK & DEF +159%, Great chance to super, Guards all attacks
          {
          type: "startOfTurn",
          atkBoost: 1.59,
          defBoost: 1.59,
          extraAttackChance: 0.7,
          description: "ATK & DEF +159%, Great chance to super, Guards all attacks"
          },
  
          // 🔹 When attacking: ATK +200% & DEF +200%, effective against all types
          {
          type: "onAttack",
          atkBoost: 2.0,
          defBoost: 2.0,
          superEffective: true,
          damageReduction: 0.7,
          extraAttackChance: 1,
          description: "ATK +200%, DEF +200%"
          },
  
          // 🔹 On Even turns: ATK + 77%
          {
          type: "startOfTurn",
          defBoost: 0.77,
          guardsAll: true,
          condition: (ctx) => ctx.turnNow % 2 === 0,
          description: "Each time this unit is switched in: ATK +77%"
          },

          // Super Attack: Is gonna pay
          {
            type: "superAttack",
            atkBoost: 0.3,
            description: "Greatly Raises ATK and DEF",
            turns: 999
          }
          ],
      },
  
      15: {
        name: "SSGSS Kaioken Goku",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
        passives: [
          // 🔹 Always Active: ATK & DEF +400%
          {
          type: "startOfTurn",
          atkBoost: 4.59,
          defBoost: 4.59,
          critChance: 0.7,
          extraAttackChance: 0.7,
          damageReduction: 0.35,
          description: "ATK & DEF +400%"
          },
  
          // 🔹 When attacking: ATK +300% and launches an additional super
          {
          type: "onAttack",
          atkBoost: 4.0,
          defBoost: 3.0,
          extraAttackChance: 1,
          description: "ATK +300%, DEF +200%,launches additional Super Attack"
          },

          // Super Attack: Kaioken Rush
          {
            type: "superAttack",
            atkBoost: 1.3,
            description: "Greatly Raises ATK",
            turns: 999
          }
        ],
      },
  
      16: {
        name: "Vegito Blue",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
        passives: [
          // 🔹 Always Active: ATK & DEF +59%
          {
          type: "startOfTurn",
          atkBoost: 0.59,
          defBoost: 0.59,
          description: "ATK & DEF +59%"
          },

          // 🔹 When attacking: ATK +600%, DEF +500%, guaranteed crit
          {
          type: "onAttack",
          atkBoost: 6.0,
          defBoost: 5.0,
          critChance: 1,
          extraAttackChance: 1,
          description: "ATK +600%, DEF +500%, guaranteed crits, launches additional Super Attack"
          },

          // Super Attack: Final Kamehameha
          {
            type: "superAttack",
            defBoost: 1.3,
            description: "Greatly Raises DEF",
            turns: 999
          }
        ],
      },

      17: {
        name: "Gogeta Blue",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
        passives: [
          // 🔹 Always Active: ATK & DEF +200%
          {
          type: "startOfTurn",
          atkBoost: 2.0,
          defBoost: 2.0,
          description: "ATK & DEF +200%"
          },
  
          // 🔹 When attacking: ATK +300%, DEF +400%, guaranteed crit
          {
          type: "onAttack",
          atkBoost: 3.0,
          defBoost: 4.0,
          critChance: 1,
          extraAttackChance: 1,
          description: "ATK +300%, DEF +400%, guaranteed crits, launches additional Super Attack"
          },

          // Super Attack: Meteor Combination
          {
            type: "superAttack",
            atkBoost: 2.0,
            defBoost: 2.0,
            description: "Massively Raises ATK and DEF for 1 turn",
            turns: 1
          }
        ],
      },

      18: {
        name: "Kurapika",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
        passives: [
          // 🔹 Always Active: ATK & DEF +450%
          {
          type: "startOfTurn",
          atkBoost: 4.0,
          defBoost: 4.0,
          superEffective: true,
          extraAttackChance: 1,
          description: "ATK & DEF +450%"
          },
  
          // 🔹 When attacking: DEF +300%
          {
          type: "onAttack",
          defBoost: 4.0,
          description: "DEF +300%"
          },
  
          // 🔹 First 5 turns: ATK & DEF +200%, great chance to super
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 3,
            atkBoost: 2.0,
            defBoost: 2.0,
            extraAttackChance: 0.7,
            description: "ATK & DEF +90%, Great chance to crit/additional/evade for 5 turns"
          },

          // Super Attack: Emperor's Time
          {
            type: "superAttack",
            defBoost: 2,
            description: "Massively Raises DEF",
            turns: 999
          }
        ],
      },

      19: {
        name: "Glorio",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
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
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 3,
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
          description: "DEF +100%, super effective"
          },

          // Super Attack: Godspeed
          {
            type: "superAttack",
            atkBoost: 1.3,
            description: "Greatly Raises ATK",
            turns: 999
          }
        ],
      },

      20: {
        name: "Gon",
        baseAtk: 240,
        baseDef: 140,
        baseHp: 25000,
        passives: [
          // 🔹 Always Active: ATK & DEF +700%
          {
          type: "startOfTurn",
          atkBoost: 7.0,
          defBoost: 7.0,
          damageReduction: 0.7,
          guardsAll: true,
          critChance: 0.5,
          description: "ATK & DEF +700%"
          },

          // 🔹 Every turn passed: ATK +30% up to 90%
          {
            type: "startOfTurn",
            condition: (ctx, id) => true,
            atkBoost: (ctx, id) => Math.min(0.3 * (ctx.turnNow - ctx.turnEntered[id]), 0.9),
            description: "ATK +30% per turn since entry (up to 90%)"
          },

          // Super Attack: Final Janken
          {
            type: "superAttack",
            atkBoost: 2,
            description: "Massively Raises ATK for 1 turn",
            turns: 1
          }
        ],
      },

      21: {
        name: "Leoreo",
        baseAtk: 20,
        baseDef: 15000,
        baseHp: 20000,
        passives: [
          // 🔹 Always Active: ATK & DEF +100% and great chance to evade
          {
            type: "startOfTurn",
            atkBoost: 1.0,
            defBoost: 1.0,
            evadeChance: 0.7,
            description: "ATK & DEF +100% and great chance to evade"
          },
    
          // 🔹 When attacking: ATK & DEF +70%
          {
            type: "onAttack",
            atkBoost: 0.7,
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
  
          // Super Attack: Serious mode
          {
            type: "superAttack",
            atkBoost: 0.1,
            defBoost: 0.1,
            description: "Raises ATK and DEF for 1 turn",
            turns: 1
          },
        ],
      },
  
      22: {
        name: "Jotaro (Star Platinum)",
        baseAtk: 22000,
        baseDef: 16000,
        baseHp: 21000,
        passives: [
          // 🔹 Always Active: ATK +100% & DEF +30%
          {
          type: "startOfTurn",
          atkBoost: 1.0,
          defBoost: 0.3,
          guardsAll: true,
          description: "ATK +100% & DEF +30%, Guards all attacks"
          },
  
          // 🔹 When attacking: ATK +100%, DEF +200%, effective against all types
          {
          type: "onAttack",
          atkBoost: 1.0,
          defBoost: 2.0,
          superEffective: true,
          extraAttackChance: 1,
          description: "ATK +100%, DEF +200%, super effective, launches additional Super Attack"
          },
  
          // Super Attack: Ora Barrage
          {
            type: "superAttack",
            defBoost: 0.1,
            description: "Raises DEF",
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
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
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
  

          // Super Attack: Timestop
          {
            type: "superAttack",
            atkBoost: 0.1,
            description: "Raises ATK",
            turns: 999
          },
        ],
      },
  
      24: {
        name: "Golden Experience Requiem",
        baseAtk: 24500,
        baseDef: 15000,
        baseHp: 22000,
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

          // Super Attack: GER
          {
            type: "superAttack",
            atkBoost: 1,
            defBoost: 1,
            description: "Massively Raises ATK and DEF for 3 turns",
            turns: 3
          }
          ],
      },
  
      25: {
        name: "Isagi",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
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
          description: "ATK +300%, DEF +200%,launches additional Super Attack"
          },

          // Super Attack: Ore Wa Strika Da
          {
            type: "superAttack",
            atkBoost: 1,
            description: "Massively Raises ATK",
            turns: 999
          }
        ],
      },
  
      26: {
        name: "Rafal",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
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
          extraAttackChance: 1,
          guardsAll: true,
          description: "ATK +600%, DEF +500%, guaranteed crits, launches additional Super Attack"
          },

          // Super Attack: Science
          {
            type: "superAttack",
            defBoost: 0.3,
            description: "Greatly Raises DEF for 1 turn",
            turns: 1
          }
        ],
      },

      27: {
        name: "Sung Jin Woo",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
        passives: [
          // 🔹 Always Active: ATK +200%, DEF +100%
          {
          type: "startOfTurn",
          atkBoost: 2.0,
          defBoost: 1.0,
          damageReduction: 0.25,
          description: "ATK & DEF +200%"
          },
  
          // 🔹 When attacking: ATK +100%, DEF +200%, high chance to crit
          {
          type: "onAttack",
          atkBoost: 1.0,
          defBoost: 2.0,
          critChance: 0.5,
          damageReduction: 0.25,
          extraAttackChance: 1,
          description: "ATK +300%, DEF +400%, guaranteed crits, launches additional Super Attack"
          },

          // Super Attack: Aura
          {
            type: "superAttack",
            atkBoost: 0.1,
            defBoost: 0.1,
            description: "Raises ATK and DEF for 1 turn",
            turns: 1
          }
        ],
      },

      28: {
        name: "Lelouch",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
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
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 3,
            atkBoost: 5.0,
            defBoost: 5.0,
            extraAttackChance: 0.7,
            description: "ATK & DEF +500%, Great chance to crit/additional/evade for 5 turns"
          },

          // Super Attack: Emperor's Time
          {
            type: "superAttack",
            defBoost: 1,
            atkBoost: 1,
            description: "Massively Raises ATK and DEF",
            turns: 999
          }
        ],
      },

      29: {
        name: "Ash Ketchum",
        baseAtk: 24000,
        baseDef: 14000,
        baseHp: 25000,
        passives: [
          // 🔹 Always Active: ATK & DEF +100%
          {
          type: "startOfTurn",
          atkBoost: 1,
          defBoost: 1,
          guardsAll: true,
          description: "ATK & DEF +100%"
          },
  
          // 🔹 First 10 turns: ATK & DEF +777%, high chance to super
          {
            type: "startOfTurn",
            condition: (ctx, id) => ctx.turnNow - ctx.turnEntered[id] < 3,
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

          // Super Attack: Omnipotency
          {
            type: "superAttack",
            defBoost: 0.3,
            description: "Greatly Raises DEF",
            turns: 999
          }
        ],
      },

      30: {
        name: "Gary Oak Arceus",
        baseAtk: 240,
        baseDef: 140,
        baseHp: 25000,
        passives: [
          // 🔹 Always Active: ATK & DEF +999%
          {
          type: "startOfTurn",
          atkBoost: 9.99,
          defBoost: 9.99,
          damageReduction: 0.9,
          guardsAll: true,
          critChance: 0.9,
          description: "ATK & DEF +999%"
          },

          // Super Attack: Judgement
          {
            type: "superAttack",
            atkBoost: 1,
            defBoost: 1,
            description: "Massively Raises ATK and DEF",
            turns: 999
          }
        ],
      }
  };
  
  export default characterDetails;
  
  