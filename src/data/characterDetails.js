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
          atkBoost: (ctx, id) => 0.1 * ctx.superAttackCounts[id],
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

        // 🔹 Support: +40% DEF for one turn on swap-out
        {
        type: "onSwitchOut",
        defBoost: 1.4,
        description: "DEF +40% on swap-out for one turn"
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
        extraAttackChance: 0.7,
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
                    }
  };
  
  export default characterDetails;
  
  