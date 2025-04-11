const stages = {
    "1-1": {
      name: "Saiyan Showdown",
      phases: [
        { name: "Vegeta", type: "fire", hp: 1500000000, atk: 60000, def: 20000, dr: 70, attacks: 3, SA: 30, SAatk: 600000 },
        { name: "Great Ape Vegeta", type: "water", hp: 1800000000, atk: 1000000, def: 50000, dr: 70, attacks: 4, SA: 50, SAatk: 1500000 }
      ],
      bgm: "./assets/OSTs/2.mp3"
    },

    "1-2": {
      name: "Namek Showdown",
      phases: [
        { name: "Frieza(Final Form)", type: "grass", hp: 2000000000, atk: 100000, dr: 70, attacks: 3, SA: 30, SAatk: 1200000 },
        { name: "Frieza(Full Power)", type: "fire", hp: 3000000000, atk: 1000000, dr: 70, attacks: 4, SA: 50, SAatk: 3000000 }
      ],
      bgm: "./assets/OSTs/2.mp3"
    }
  };
  
  export default stages;
  