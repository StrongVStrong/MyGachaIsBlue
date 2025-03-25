const characters = [
    { "id": 1, "name": "Super Saiyan Goku", "power": 9000, "rarity": "rare", "type": "grass" },
    { "id": 2, "name": "Super Vegeta", "power": 8500, "rarity": "common", "type": "water" },
    { "id": 3, "name": "Full Power SSJ Broly", "power": 9500, "rarity": "ultra", "type": "grass" },
    { "id": 4, "name": "Super Vegito", "power": 10500, "rarity": "legendary", "type": "grass" },
    { "id": 5, "name": "Super Gogeta", "power": 10500, "rarity": "legendary", "type": "fire" },
    { "id": 6, "name": "Super Saiyan 4 Goku (Daima)", "power": 11000, "rarity": "legendary", "type": "fire" },
    { "id": 7, "name": "Super Saiyan Goku (Daima)", "power": 8000, "rarity": "common", "type": "grass" },
    { "id": 8, "name": "Super Saiyan 3 Vegeta (Daima)", "power": 8400, "rarity": "rare", "type": "fire" },
    { "id": 9, "name": "Glorio", "power": 7800, "rarity": "common", "type": "grass" },
    { "id": 10, "name": "Goma", "power": 10000, "rarity": "ultra", "type": "water" }
];


export default characters;
export const characterMap = Object.fromEntries(characters.map(c => [c.id, c]));