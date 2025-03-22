// Inventory.jsx
import { usePlayerData } from "../hooks/usePlayerData";

function Battle() {
    return (
    <div> Welcome to the Battle Page!
      <audio loop autoPlay>
          <source src={`${import.meta.env.BASE_URL}assets/battle.mp3`} type="audio/mp3" />
        </audio>
    </div>
    
    );
  }
  export default Battle;