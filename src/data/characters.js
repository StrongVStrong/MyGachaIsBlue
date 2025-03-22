const characters = [
    { "id": 1, "name": "Super Saiyan Goku", "power": 9000 },
    { "id": 2, "name": "Super Vegeta", "power": 8500 },
    { "id": 3, "name": "Full Power SSJ Broly", "power": 9500 },
    { "id": 4, "name": "Super Vegito", "power": 10500 },
    { "id": 5, "name": "Super Gogeta", "power": 10500 },
    { "id": 6, "name": "Super Saiyan 4 Goku (Daima)", "power": 11000 },
    { "id": 7, "name": "Super Saiyan Goku (Daima)", "power": 8000 },
    { "id": 8, "name": "Super Saiyan 3 Vegeta (Daima)", "power": 8400 },
    { "id": 9, "name": "Glorio", "power": 7800 },
    { "id": 10, "name": "Goma", "power": 10000 }
];


export default characters;
export const characterMap = Object.fromEntries(characters.map(c => [c.id, c]));