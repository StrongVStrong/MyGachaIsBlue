const stages = {
    "1-1": {
      name: "Saiyan Showdown",
      phases: [
        { name: "Vegeta", type: "fire", hp: 250000000, atk: 60000, def: 20000, dr: 70, attacks: 3, SA: 15, SAatk: 600000, bgm: "./assets/OSTs/2.mp3" },
        { name: "Great Ape Vegeta", type: "water", hp: 300000000, atk: 750000, def: 50000, dr: 70, attacks: 4, SA: 30, SAatk: 1200000, bgm: "./assets/OSTs/3.mp3" }
      ],
      rewards: { gems: 1000, exp: 500},
      repeatRewards: {gems: 200, exp: 100}
    },

    "1-2": {
      name: "Battle At Namek",
      phases: [
        { name: "Frieza (Final Form)", type: "grass", hp: 200000000, atk: 140000, dr: 70, attacks: 5, SA: 15, SAatk: 350000, bgm: "./assets/OSTs/3.mp3" },
        { name: "Frieza (Full Power)", type: "fire", hp: 300000000, atk: 875000, dr: 70, attacks: 7, SA: 50, SAatk: 2200000, bgm: "./assets/OSTs/23.mp3" }
      ],
      rewards: { gems: 2000, exp: 1000},
      repeatRewards: {gems: 400, exp: 200}
    },

    "1-3": {
      name: "The Cell Games",
      phases: [
        { name: "Cell (Perfect Form)", type: "water", hp: 350000000, atk: 750000, dr: 70, attacks: 7, SA: 30, SAatk: 2200000, bgm: "./assets/OSTs/10.mp3" },
        { name: "Perfect Cell", type: "grass", hp: 400000000, atk: 1000000, dr: 70, attacks: 8, SA: 30, SAatk: 3000000, bgm: "./assets/OSTs/14.mp3" }
      ],
      rewards: { gems: 3000, exp: 2000},
      repeatRewards: {gems: 600, exp: 400}
    },

    "1-4": {
      name: "Majin Menace",
      phases: [
        { name: "Buu (Fat)", type: "grass", hp: 90000000, atk: 270000, dr: 70, attacks: 3, SA: 15, SAatk: 650000, bgm: "./assets/OSTs/13.mp3" },
        { name: "Buu (Evil)", type: "fire", hp: 120000000, atk: 400000, dr: 70, attacks: 3, SA: 50, SAatk: 900000, bgm: "./assets/OSTs/3.mp3" },
        { name: "Buu (Super)", type: "fire", hp: 250000000, atk: 750000, dr: 70, attacks: 5, SA: 50, SAatk: 2000000, bgm: "./assets/OSTs/24.mp3" },
        { name: "Buu (Piccolo)", type: "fire", hp: 350000000, atk: 1000000, dr: 70, attacks: 7, SA: 50, SAatk: 2200000, bgm: "./assets/OSTs/23.mp3" },
        { name: "Buu (Gotenks)", type: "fire", hp: 400000000, atk: 1800000, dr: 70, attacks: 7, SA: 50, SAatk: 2500000, bgm: "./assets/OSTs/18.mp3" },
        { name: "Buu (Gohan)", type: "fire", hp: 820000000, atk: 2300000, dr: 70, attacks: 8, SA: 50, SAatk: 3900000, bgm: "./assets/OSTs/8.mp3" },
        { name: "Buu (Enraged)", type: "fire", hp: 90000000, atk: 200000, dr: 70, attacks: 3, SA: 50, SAatk: 2000000, bgm: "./assets/OSTs/29.mp3" },
        { name: "Buu (Kid)", type: "fire", hp: 900000000, atk: 3000000, dr: 70, attacks: 10, SA: 50, SAatk: 5000000, bgm: "./assets/OSTs/14.mp3" },
      ],
      rewards: { gems: 5000, exp: 10000},
      repeatRewards: {gems: 1000, exp: 1000}
    },

    "1-5": {
      name: "Tournament of Power",
      phases: [
        { name: "Kefla", type: "grass", hp: 200000000, atk: 230000, dr: 70, attacks: 7, SA: 15, SAatk: 780000, bgm: "./assets/OSTs/1.mp3" },
        { name: "Anilaza", type: "fire", hp: 400000000, atk: 500000, dr: 70, attacks: 4, SA: 15, SAatk: 2300000, bgm: "./assets/OSTs/14.mp3" },
        { name: "Toppo", type: "grass", hp: 500000000, atk: 1500000, dr: 70, attacks: 6, SA: 15, SAatk: 3500000, bgm: "./assets/OSTs/2.mp3" },
        { name: "Toppo (GoD)", type: "water", hp: 650000000, atk: 2200000, dr: 70, attacks: 8, SA: 15, SAatk: 5000000, bgm: "./assets/OSTs/2.mp3" },
        { name: "Jiren", type: "fire", hp: 900000000, atk: 3800000, dr: 70, attacks: 3, SA: 15, SAatk: 8500000, bgm: "./assets/OSTs/20.mp3" },
        { name: "Jiren (Full Power)", type: "water", hp: 1000000000, atk: 5000000, dr: 70, attacks: 10, SA: 50, SAatk: 10000000, bgm: "./assets/OSTs/10.mp3" }
      ],
      rewards: { gems: 10000, exp: 50000},
      repeatRewards: {gems: 2000, exp: 5000}
    },

    "2-1": {
      name: "Saiyan Showdown",
      phases: [
        { name: "Vegeta", type: "fire", hp: 250000000, atk: 60000, def: 20000, dr: 70, attacks: 3, SA: 15, SAatk: 600000, bgm: "./assets/OSTs/2.mp3" },
        { name: "Great Ape Vegeta", type: "water", hp: 300000000, atk: 750000, def: 50000, dr: 70, attacks: 4, SA: 30, SAatk: 1200000, bgm: "./assets/OSTs/3.mp3" }
      ],
      rewards: { gems: 1000, exp: 500},
      repeatRewards: {gems: 200, exp: 100}
    },

    "2-2": {
      name: "Battle At Namek",
      phases: [
        { name: "Frieza (Final Form)", type: "grass", hp: 200000000, atk: 140000, dr: 70, attacks: 5, SA: 15, SAatk: 350000, bgm: "./assets/OSTs/3.mp3" },
        { name: "Frieza (Full Power)", type: "fire", hp: 300000000, atk: 875000, dr: 70, attacks: 7, SA: 50, SAatk: 2200000, bgm: "./assets/OSTs/23.mp3" }
      ],
      rewards: { gems: 2000, exp: 1000},
      repeatRewards: {gems: 400, exp: 200}
    },

    "2-3": {
      name: "The Cell Games",
      phases: [
        { name: "Cell (Perfect Form)", type: "water", hp: 350000000, atk: 750000, dr: 70, attacks: 7, SA: 30, SAatk: 2200000, bgm: "./assets/OSTs/10.mp3" },
        { name: "Perfect Cell", type: "grass", hp: 400000000, atk: 1000000, dr: 70, attacks: 8, SA: 30, SAatk: 3000000, bgm: "./assets/OSTs/14.mp3" }
      ],
      rewards: { gems: 3000, exp: 2000},
      repeatRewards: {gems: 600, exp: 400}
    },

    "2-4": {
      name: "Majin Menace",
      phases: [
        { name: "Buu (Fat)", type: "grass", hp: 90000000, atk: 270000, dr: 70, attacks: 3, SA: 15, SAatk: 650000, bgm: "./assets/OSTs/13.mp3" },
        { name: "Buu (Evil)", type: "fire", hp: 120000000, atk: 400000, dr: 70, attacks: 3, SA: 50, SAatk: 900000, bgm: "./assets/OSTs/3.mp3" },
        { name: "Buu (Super)", type: "fire", hp: 250000000, atk: 750000, dr: 70, attacks: 5, SA: 50, SAatk: 2000000, bgm: "./assets/OSTs/24.mp3" },
        { name: "Buu (Piccolo)", type: "fire", hp: 350000000, atk: 1000000, dr: 70, attacks: 7, SA: 50, SAatk: 2200000, bgm: "./assets/OSTs/23.mp3" },
        { name: "Buu (Gotenks)", type: "fire", hp: 400000000, atk: 1800000, dr: 70, attacks: 7, SA: 50, SAatk: 2500000, bgm: "./assets/OSTs/18.mp3" },
        { name: "Buu (Gohan)", type: "fire", hp: 820000000, atk: 2300000, dr: 70, attacks: 8, SA: 50, SAatk: 3900000, bgm: "./assets/OSTs/8.mp3" },
        { name: "Buu (Enraged)", type: "fire", hp: 90000000, atk: 200000, dr: 70, attacks: 3, SA: 50, SAatk: 2000000, bgm: "./assets/OSTs/29.mp3" },
        { name: "Buu (Kid)", type: "fire", hp: 900000000, atk: 3000000, dr: 70, attacks: 10, SA: 50, SAatk: 5000000, bgm: "./assets/OSTs/14.mp3" },
      ],
      rewards: { gems: 5000, exp: 10000},
      repeatRewards: {gems: 1000, exp: 1000}
    },

    "2-5": {
      name: "Tournament of Power",
      phases: [
        { name: "Kefla", type: "grass", hp: 200000000, atk: 230000, dr: 70, attacks: 7, SA: 15, SAatk: 780000, bgm: "./assets/OSTs/1.mp3" },
        { name: "Anilaza", type: "fire", hp: 400000000, atk: 500000, dr: 70, attacks: 4, SA: 15, SAatk: 2300000, bgm: "./assets/OSTs/14.mp3" },
        { name: "Toppo", type: "grass", hp: 500000000, atk: 1500000, dr: 70, attacks: 6, SA: 15, SAatk: 3500000, bgm: "./assets/OSTs/2.mp3" },
        { name: "Toppo (GoD)", type: "water", hp: 650000000, atk: 2200000, dr: 70, attacks: 8, SA: 15, SAatk: 5000000, bgm: "./assets/OSTs/2.mp3" },
        { name: "Jiren", type: "fire", hp: 900000000, atk: 3800000, dr: 70, attacks: 3, SA: 15, SAatk: 8500000, bgm: "./assets/OSTs/20.mp3" },
        { name: "Jiren (Full Power)", type: "water", hp: 1000000000, atk: 5000000, dr: 70, attacks: 10, SA: 50, SAatk: 10000000, bgm: "./assets/OSTs/10.mp3" }
      ],
      rewards: { gems: 10000, exp: 50000},
      repeatRewards: {gems: 2000, exp: 5000}
    },
  };
  
  export default stages;
  