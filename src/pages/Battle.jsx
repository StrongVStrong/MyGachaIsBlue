// Inventory.jsx
import { usePlayerData } from "../hooks/usePlayerData";
import BackButton from "../components/BackButton";

function Battle() {
    return (
    <div>
      <BackButton /> {/*Back button*/}
      Welcome to the Battle Page!
      <title>Battle</title>
      <audio loop autoPlay>
          <source src={`${import.meta.env.BASE_URL}assets/battle.mp3`} type="audio/mp3" />
      </audio>
      
    </div>
    
    );
  }
  export default Battle;