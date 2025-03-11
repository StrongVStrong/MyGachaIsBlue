import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const MAX_COOKIE_SIZE = 3800; // Maximum size for a single cookie

export function usePlayerData() {
  // Load inventory from cookies
  const loadInventory = () => {
    let allCharacters = [];
    let index = 1;
    let cookieData;

    while ((cookieData = Cookies.get(`Characters${index}`))) {
      const chunk = JSON.parse(cookieData);
      allCharacters = [...allCharacters, ...chunk];
      index++;
    }

    return allCharacters;
  };

  // Load gems and inventory
  const [gems, setGems] = useState(() => {
    return parseInt(Cookies.get("Gems") || "0", 10);
  });
  const [characters, setCharacters] = useState(() => loadInventory());

  // Save inventory to cookies
  const saveInventory = (newInventory) => {
    const inventoryJSON = JSON.stringify(newInventory);
    const charactersArray = newInventory;

    let chunkIndex = 1;
    let chunk = [];
    let chunkSize = 0;

    charactersArray.forEach((character, index) => {
      const characterJSON = JSON.stringify(character);
      chunkSize += characterJSON.length;

      // If adding this character exceeds the max cookie size, save the current chunk
      if (chunkSize > MAX_COOKIE_SIZE) {
        Cookies.set(`Characters${chunkIndex}`, JSON.stringify(chunk), { expires: 999 });
        chunkIndex++;
        chunk = [];
        chunkSize = characterJSON.length;
      }

      // Add the character to the current chunk
      chunk.push(character);
    });

    // Save the last chunk
    if (chunk.length > 0) {
      Cookies.set(`Characters${chunkIndex}`, JSON.stringify(chunk), { expires: 999 });
    }

    console.log(`✅ Inventory saved across ${chunkIndex} cookies`);
  };

  // Save gems when they change
  useEffect(() => {
    Cookies.set("Gems", gems, { expires: 999 });
  }, [gems]);

  // Save inventory when it changes
  useEffect(() => {
    saveInventory(characters);
  }, [characters]);

  return { gems, setGems, characters, setCharacters };
}