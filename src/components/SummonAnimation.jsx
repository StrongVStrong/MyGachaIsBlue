import React, { useEffect, useRef, useState } from "react";
import { useAudio } from "../context/AudioContext";
import "./SummonAnimation.css";

const rarityCutoffs = {
  Common: 1,
  Rare: 2.19,
  Ultra: 3.2,
  Legendary: 5,
  Godly: null, // Full length
};

const SummonAnimation = ({ highestRarity, specialClip, pulledRarities, audioRef, onComplete }) => {
  const mainRef = useRef(null);
  const [playingPhase, setPlayingPhase] = useState("main");
  const [completed, setCompleted] = useState(false);
  const { setVolume, volume } = useAudio();

  const getExtraClip = () => {
    const count = (r) => pulledRarities.filter(x => x === r).length;
    if (count("Common") == 1 || count("Common") == 10) return "common.mp4";
    if (count("Godly") == 1) return "godly.mp4";
    if (count("Godly") >= 2) return "godlies.mp4";
    if (count("Legendary") == 2) return "legendaries2.mp4";
    if (count("Legendary") >= 3) return "legendaries.mp4";
    if (count("Godly") >= 5) return "allgodly.mp4";
    return null;
  };

  const extraClip = getExtraClip();

  const safeComplete = () => {
    if (!completed) {
      setCompleted(true);
      onComplete();
    }
  };

  const handleTimeUpdate = () => {
    const vid = mainRef.current;
    const cutoff = rarityCutoffs[highestRarity];
    if (!vid || vid.readyState < 2 || vid.paused || completed) return;

    if (cutoff !== null && vid.currentTime >= cutoff) {
      vid.pause();
      setTimeout(() => {
        if (specialClip) {
          setPlayingPhase("special");
        } else if (extraClip) {
          setPlayingPhase("extra");
        } else {
          safeComplete();
        }
      }, 50);
    }
  };

  const handleMainEnded = () => {
    if (highestRarity === "Godly") {
      if (specialClip) {
        setPlayingPhase("special");
      } else if (extraClip) {
        setPlayingPhase("extra");
      } else {
        safeComplete();
      }
    }
  };

  const handleSpecialEnded = () => {
    if (extraClip) {
      setPlayingPhase("extra");
    } else {
      safeComplete();
    }
  };

  const handleExtraEnded = () => {
    safeComplete();
  };

  const handleSkip = () => {
    if (completed) return;

    const vid = mainRef.current;
    if (vid && !vid.paused) vid.pause();

    if (playingPhase === "main") {
      if (specialClip) {
        setPlayingPhase("special");
      } else if (extraClip) {
        setPlayingPhase("extra");
      } else {
        safeComplete();
      }
    } else if (playingPhase === "special" && extraClip) {
      setPlayingPhase("extra");
    } else {
      safeComplete();
    }
  };

  useEffect(() => {
    const vid = mainRef.current;
    const bgm = audioRef?.current;
    if (bgm && !bgm.paused) bgm.pause();

    if (vid) {
      vid.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("Main video failed to play:", err);
        }
      });
    }

    const maxDuration = rarityCutoffs[highestRarity] ?? 9999;
    const timeout = setTimeout(() => {
      safeComplete();
    }, (maxDuration + 30) * 1000);

    return () => {
      clearTimeout(timeout);
      setVolume(volume);
    };
  }, [highestRarity]);

  const getVideoSrc = () => {
    switch (playingPhase) {
      case "main":
        return "./assets/animations/mainSummon.mp4";
      case "special":
        return `./assets/animations/${specialClip}`;
      case "extra":
        return `./assets/animations/${extraClip}`;
      default:
        return null;
    }
  };

  const getOnEndedHandler = () => {
    switch (playingPhase) {
      case "main": return handleMainEnded;
      case "special": return handleSpecialEnded;
      case "extra": return handleExtraEnded;
      default: return () => {};
    }
  };

  return (
    <div 
    className="summon-animation-overlay"
    onClick={handleSkip}
    >
      <video
        ref={mainRef}
        src={getVideoSrc()}
        autoPlay
        className="summon-video"
        onTimeUpdate={playingPhase === "main" ? handleTimeUpdate : null}
        onEnded={getOnEndedHandler()}
      />
    </div>
  );
};

export default SummonAnimation;
