const stages = {
    "1-1": {
      name: "Saiyan Showdown",
      phases: [
        { name: "Vegeta", type: "fire", hp: 250000000, atk: 75000, def: 20000, dr: 70, attacks: 3, SA: 5, SAatk: 500000, postSuper: true, saCount: 1, guaranteedSuper: false, bgm: "./assets/OSTs/2.mp3", super: "/assets/animations/allgodly.mp4", },
        { name: "Great Ape Vegeta", type: "water", hp: 300000000, atk: 250000, def: 50000, dr: 70, attacks: 4, SA: 10, SAatk: 800000, postSuper: true, saCount: 1, bgm: "./assets/OSTs/3.mp3", super: "/assets/animations/allgodly.mp4", }
      ],
      rewards: { gems: 1000, exp: 500},
      repeatRewards: {gems: 200, exp: 100}
    },

    "1-2": {
      name: "Battle At Namek",
      phases: [
        { name: "Frieza (Final Form)", type: "grass", hp: 300000000, atk: 140000, dr: 70, attacks: 5, SA: 10, SAatk: 350000, postSuper: true, saCount: 1, guaranteedSuper: false, bgm: "./assets/OSTs/3.mp3", super: "/assets/animations/allgodly.mp4", },
        { name: "Frieza (Full Power)", type: "fire", hp: 500000000, atk: 675000, dr: 70, attacks: 7, SA: 15, SAatk: 1700000, postSuper: true, saCount: 1, bgm: "./assets/OSTs/23.mp3", super: "/assets/animations/allgodly.mp4", }
      ],
      rewards: { gems: 2000, exp: 1000},
      repeatRewards: {gems: 400, exp: 200}
    },

    "1-3": {
      name: "The Cell Games",
      phases: [
        { name: "Cell (Perfect Form)", type: "water", hp: 500000000, atk: 550000, dr: 70, attacks: 7, SA: 15, SAatk: 1500000, postSuper: true, saCount: 1, bgm: "./assets/OSTs/10.mp3", super: "/assets/animations/allgodly.mp4", },
        { name: "Perfect Cell", type: "grass", hp: 550000000, atk: 900000, dr: 70, attacks: 8, SA: 15, SAatk: 3000000, preSuper: true, saCount: 1, bgm: "./assets/OSTs/14.mp3", super: "/assets/animations/allgodly.mp4", }
      ],
      rewards: { gems: 3000, exp: 2000},
      repeatRewards: {gems: 600, exp: 400}
    },

    "1-4": {
      name: "Majin Menace",
      phases: [
        { name: "Buu (Fat)", type: "grass", hp: 300000000, atk: 670000, dr: 70, attacks: 3, SA: 5, SAatk: 1250000, postSuper: true, saCount: 1, bgm: "./assets/OSTs/13.mp3", super: "/assets/animations/allgodly.mp4", },
        { name: "Buu (Evil)", type: "fire", hp: 330000000, atk: 900000, dr: 70, attacks: 3, SA: 10, SAatk: 1800000, postSuper: true, saCount: 1, bgm: "./assets/OSTs/3.mp3", super: "/assets/animations/allgodly.mp4", },
        { name: "Buu (Super)", type: "fire", hp: 400000000, atk: 970000, dr: 70, attacks: 5, SA: 15, SAatk: 2000000, postSuper: true, saCount: 1, bgm: "./assets/OSTs/24.mp3", super: "/assets/animations/allgodly.mp4", },
        { name: "Buu (Piccolo)", type: "fire", hp: 430000000, atk: 1000000, dr: 70, attacks: 7, SA: 10, SAatk: 2200000, preSuper: true, saCount: 1, bgm: "./assets/OSTs/23.mp3", super: "/assets/animations/allgodly.mp4", },
        { name: "Buu (Gotenks)", type: "fire", hp: 500000000, atk: 1800000, dr: 70, attacks: 7, SA: 15, SAatk: 2500000, postSuper: true, saCount: 1, bgm: "./assets/OSTs/18.mp3", super: "/assets/animations/allgodly.mp4", },
        { name: "Buu (Gohan)", type: "fire", hp: 720000000, atk: 2300000, dr: 70, attacks: 8, SA: 20, SAatk: 3900000, postSuper: true, saCount: 1, bgm: "./assets/OSTs/8.mp3", super: "/assets/animations/allgodly.mp4", },
        { name: "Buu (Enraged)", type: "fire", hp: 90000000, atk: 200000, dr: 70, attacks: 3, SA: 30, SAatk: 2000000, postSuper: true, saCount: 1, bgm: "./assets/OSTs/29.mp3", super: "/assets/animations/allgodly.mp4", },
        { name: "Buu (Kid)", type: "fire", hp: 900000000, atk: 3000000, dr: 70, attacks: 10, SA: 30, SAatk: 4400000, preSuper: true, saCount: 1, bgm: "./assets/OSTs/14.mp3", super: "/assets/animations/allgodly.mp4", },
      ],
      rewards: { gems: 5000, exp: 10000},
      repeatRewards: {gems: 1000, exp: 1000}
    },

    "1-5": {
      name: "Tournament of Power",
      phases: [
        { name: "Kefla", type: "grass", hp: 200000000, atk: 230000, dr: 70, attacks: 7, SA: 15, SAatk: 780000, preSuper: true, saCount: 1, bgm: "./assets/OSTs/1.mp3", super: "/assets/animations/allgodly.mp4", },
        { name: "Anilaza", type: "fire", hp: 400000000, atk: 570000, dr: 70, attacks: 4, SA: 20, SAatk: 1300000, preSuper: true, saCount: 1, bgm: "./assets/OSTs/14.mp3", super: "/assets/animations/allgodly.mp4", },
        { name: "Toppo", type: "grass", hp: 500000000, atk: 1500000, dr: 70, attacks: 6, SA: 15, SAatk: 3500000, postSuper: true, saCount: 1, bgm: "./assets/OSTs/2.mp3", super: "/assets/animations/allgodly.mp4", },
        { name: "Toppo (GoD)", type: "water", hp: 650000000, atk: 2200000, dr: 70, attacks: 8, SA: 30, SAatk: 5000000, postSuper: true, saCount: 1, bgm: "./assets/OSTs/2.mp3", super: "/assets/animations/allgodly.mp4", },
        { name: "Jiren", type: "fire", hp: 900000000, atk: 3800000, dr: 70, attacks: 3, SA: 5, SAatk: 8500000, postSuper: true, saCount: 3, guaranteedSuper: false,  bgm: "./assets/OSTs/20.mp3", super: "/assets/animations/allgodly.mp4", },
        { name: "Jiren (Full Power)", type: "water", hp: 1100000000, atk: 5000000, dr: 70, attacks: 10, SA: 50, SAatk: 10000000, saCount: 1, bgm: "./assets/OSTs/10.mp3", super: "/assets/animations/allgodly.mp4", }
      ],
      rewards: { gems: 10000, exp: 50000},
      repeatRewards: {gems: 2000, exp: 5000}
    },
  };
  
  export default stages;
  