const characters = [
    { "id": 1, "name": "Super Saiyan Goku", "power": 9000, "rarity": "Rare", "type": "grass", details: "Strong Start (5 turns), Dodge", super: "Warp Kamehameha - Raises ATK" },
    { "id": 2, "name": "Super Vegeta", "power": 8500, "rarity": "Common", "type": "water", details: "Strong Start (3 turns), Swap-out Support", super: "Burning Stars Cannon - Raises DEF" },
    { "id": 3, "name": "Full Power SSJ Broly", "power": 9500, "rarity": "Ultra", "type": "grass", details: "Slow Start (Turn 6+), Dodge", super: "Blastor Meteor - Raises ATK & DEF for 1 turn" },
    { "id": 4, "name": "Super Vegito", "power": 10500, "rarity": "Legendary", "type": "grass", details: "Slow Start (Stacker), Guard", super: "Vegito Special - Greatly raises ATK & DEF" },
    { "id": 5, "name": "Super Gogeta", "power": 10500, "rarity": "Legendary", "type": "fire", passive: "Attack +100%", details: "Strong Start, Dodge, Guard", super: "Gogeta Special - Raises ATK and DEF for 1 turn" },
    { "id": 6, "name": "Super Saiyan 4 Goku (Daima)", "power": 11000, "rarity": "Legendary", "type": "fire", details: "Slow Start (Stacker)", super: "Ultra Kamehameha - Greatly Raises DEF" },
    { "id": 7, "name": "Super Saiyan Goku (Daima)", "power": 8500, "rarity": "Common", "type": "grass", details: "Slow Start (Stacker)", super: "Power Pole Assault - Massively Raises ATK & DEF" },
    { "id": 8, "name": "Super Saiyan 3 Vegeta (Daima)", "power": 9000, "rarity": "Rare", "type": "fire", details: "Burst Attacker (Stacker)", super: "Vegeta Onslaught - Massively Raises ATK" },
    { "id": 9, "name": "Glorio", "power": 8000, "rarity": "Common", "type": "water", details: "Slow Start (Turn 6+, Stacker), Dodge", super: "Magic - Greatly Raises DEF" },
    { "id": 10, "name": "Goma", "power": 10000, "rarity": "Ultra", "type": "water", details: "Slow Start (Stacker), Late Game", super: "Third Eye - Greatly Raises DEF" },
    { "id": 11, "name": "Ultra Instinct Goku", "power": 15000, "rarity": "Godly", "type": "water", details: "All-rounder, Stacker, Dodge", super: "Godly Display - Raises ATK and DEF" },
    { "id": 12, "name": "Super Saiyan 4 Goku (GT)", "power": 15000, "rarity": "Godly", "type": "grass", details: "Stacker, Swap-out Support", super: "x10 Kamehameha - Greatly raises DEF" },
    { "id": 13, "name": "Super Saiyan 3 Goku", "power": 9500, "rarity": "Legendary", "type": "fire", details: "Burst Attacker", super: "Meteor Attack - Raises ATK, Raises DEF for 1 turn" },
    { "id": 14, "name": "Super Saiyan Blue Goku", "power": 12000, "rarity": "Ultra", "type": "water", details: "Tactical (Even Turns)", super: "Is Gonna Pay - Greatly raises ATK" },
    { "id": 15, "name": "Super Saiyan Blue Goku (Kaioken x10)", "power": 15000, "rarity": "Godly", "type": "fire", details: "Burst Attacker", super: "Kaioken Rush - Raises ATK, Greatly raises DEF for 1 turn" },
    { "id": 16, "name": "Vegito Blue", "power": 13500, "rarity": "Legendary", "type": "water", details: "Slow Start (Stacker)", super: "Final Kamehameha - Greatly Raises DEF" },
    { "id": 17, "name": "Gogeta Blue", "power": 13500, "rarity": "Legendary", "type": "grass", details: "Burst Attacker", super: "Meteor Combination - Massively Raises ATK and DEF for 1 turn" },
    { "id": 18, "name": "Kurapika (Emperor's Time)", "power": 13000, "rarity": "Godly", "type": "fire", details: "Onslaught Attacker", super: "Emperor's Time - Massively Raises ATK" },
    { "id": 19, "name": "Killua (Godspeed)", "power": 12500, "rarity": "Godly", "type": "water", details: "Strong Start (5 turns)", super: "Godspeed - Raises ATK, Raises DEF for 1 turn" },
    { "id": 20, "name": "Gon (All Out)", "power": 13500, "rarity": "Godly", "type": "grass", details: "Full Power", super: "Final Janken - Massively Raises ATK for 1 turn" },
    { "id": 21, "name": "Leoreo (Serious)", "power": 8000, "rarity": "Common", "type": "water", details: "Dodge or Die, Swap-out Support", super: "Serious Mode - Raises ATK and DEF for 1 turn" },
    { "id": 22, "name": "Jotaro (Star Platinum)", "power": 10000, "rarity": "Ultra", "type": "fire", details: "Stacker, Burst Attacker", super: "Ora Barrage - Raises DEF" },
    { "id": 23, "name": "Dio (The World)", "power": 10000, "rarity": "Legendary", "type": "grass", details: "Strong Start (3 turns), Burst Attacker", super: "Timestop - Raises ATK" },
    { "id": 24, "name": "Giorno (GER)", "power": 15000, "rarity": "Godly", "type": "water", details: "Tank (Guard + DR), Burst Attacker", super: "GER - Raises ATK and DEF for 3 turns" },
    { "id": 25, "name": "Isagi (Bloodlust)", "power": 8500, "rarity": "Common", "type": "water", details: "Stacker, Onslaught Attacker, Glass Cannon", super: "Ore Wa Strika Da - Massively Raises DEF" },
    { "id": 26, "name": "Rafal (All-knowing)", "power": 8000, "rarity": "Common", "type": "fire", details: "Slow Start, On-Super Warrior", super: "Science - Greatly Raises DEF" },
    { "id": 27, "name": "Sung Jin Woo (Farmer)", "power": 9000, "rarity": "Rare", "type": "water", details: "Strong Start", super: "Aura - Raises ATK and DEF for 1 turn" },
    { "id": 28, "name": "Lelouch (Full Geass)", "power": 12000, "rarity": "Godly", "type": "grass", details: "Strong Start (5 turns), Stacker", super: "All Hail Lelouch - Raises ATK and DEF" },
    { "id": 29, "name": "Ash Ketchum (Omnipotent)", "power": 15000, "rarity": "Godly", "type": "water", details: "Strong Start (10 turns), Stacker, Invincible", super: "Omnipotency - Greatly Raises DEF" },
    { "id": 30, "name": "Gary Oak (Arceus)", "power": 14000, "rarity": "Godly", "type": "fire", details: "Wall", super: "Judgment - Massively Raises ATK for 1 turn" },
];


export default characters;
export const characterMap = Object.fromEntries(characters.map(c => [c.id, c]));