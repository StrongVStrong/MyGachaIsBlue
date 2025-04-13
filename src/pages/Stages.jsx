import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useClickSFX } from "../hooks/useClickSFX";
import { useSyncedAudio } from "../hooks/useSyncedAudio";
import "./Stages.css";

const chapters = [
    { id: 1, image: "./assets/stages/dbz.jpg" },
    { id: 2, image: "./assets/stages/daima.jpg" },
    { id: 3, image: "./assets/stages/hxh.jpeg" },
    { id: 4, image: "./assets/stages/pokegods.jpg" },
    { id: 5, image: "./assets/stages/jojo.jpg" },
  ];

const stageDescriptions = {
    1: {
        1: {
            name: "The Mighty Vegeta",
            description: "The proud saiyan warrior has come to challenge you.",
        },
        2: {
            name: "Galactic Emperor",
            description: "Take down the embodiment of evil and save the universe.",
        },
        3: {
            name: "Perfect Warrior",
            description: "The warrior made of everyone's DNA, can you win?",
        },
        4: {
            name: "Majin Menace",
            description: "The mighty majin is undergoing some severe changes...",
        },
        5: {
            name: "Fate Staken Tournament",
            description: "Fight to protect your universe!",
        },
    },
    2: {
        1: {
            name: "Daima",
            description: "Enter the World of Daima",
        },
        2: {
            name: "Number 3",
            description: "Fight the protector of the Dragon Balls",
        },
        3: {
            name: "Kuu",
            description: "This Majin seems to be quite an annoying trickster...",
        },
        4: {
            name: "Duu",
            description: "This Majin seems to be quite a tanky trickster...",
        },
        5: {
            name: "Goma",
            description: "The Third Eye has been awakened... Put an end to it",
        },
    },
    3: {
        1: {
            name: "Exam",
            description: "Get your license!",
        },
        2: {
            name: "Arena",
            description: "They say reaching the top is akin to Heaven...",
        },
        3: {
            name: "Island",
            description: "What a greedy game...",
        },
        4: {
            name: "Troupe",
            description: "They shall plague this world no longer.",
        },
        5: {
            name: "Ants",
            description: "Filthy things... Wipe them out.",
        },
    },
    4: {
        1: {
            name: "Aces",
            description: "Beat Ash's best.",
        },
        2: {
            name: "Weather",
            description: "Oh my god that's a dragon",
        },
        3: {
            name: "Experiment",
            description: "We dreamed of creating the world's strongest...and we succeeded.",
        },
        4: {
            name: "Light that burns the sky",
            description: "Is that an alien too?",
        },
        5: {
            name: "Gods",
            description: "Tremble.",
        },
    },
    5: {
        1: {
            name: "Soon",
            description: "Soon",
        },
        2: {
            name: "Soon",
            description: "Soon",
        },
        3: {
            name: "Soon",
            description: "Soon",
        },
        4: {
            name: "Soon",
            description: "Soon",
        },
        5: {
            name: "Soon",
            description: "Soon",
        },
    },
};
  
const stages = [1, 2, 3, 4, 5];

export default function BattleSelect() {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const navigate = useNavigate();
  const playClick = useClickSFX();
  const audioRef = useRef(null);
  const OST = `${import.meta.env.BASE_URL}assets/stages.mp3`;
  useSyncedAudio(audioRef, OST);

  return (
    <div className="battle-select-bar-wrapper">
        <BackButton />
        {!selectedChapter &&
        chapters.map((ch) => (
            <div
            key={ch.id}
            className="chapter-fullbar-wrapper"
            style={{ backgroundImage: `url(${ch.image})` }}
            >
            <div className="chapter-image-overlay" />
            <button
                onClick={() => { playClick(); setSelectedChapter(ch); }}
                className="chapter-fullbar"
            >
                Chapter {ch.id}
            </button>
            </div>
        ))}

        {selectedChapter && (
        <div className="selected-layout">
            <div
            className="chapter-selected-banner"
            style={{ backgroundImage: `url(${selectedChapter.image})` }}
            onClick={() => { playClick(); setSelectedChapter(null) }}
            >
            <div className="chapter-image-overlay" />
            <span className="chapter-label">Chapter {selectedChapter.id}</span>
            </div>

            <div className="stage-right-panel">
            {stages.map((st) => (
            <div key={st} className="stage-wrapper">
                <button
                    onClick={() => { playClick(); setSelectedStage(st === selectedStage ? null : st); }}
                    className="stage-bar"
                >
                    {stageDescriptions?.[selectedChapter.id]?.[st]?.name || `Stage ${st}`}
                </button>

                {selectedStage === st && (
                <div className="stage-dropdown">
                    <div className="stage-description">
                    <p>
                        {stageDescriptions?.[selectedChapter.id]?.[st]?.description || "No description available."}
                    </p>
                    </div>
                    <button
                    className="stage-play-button"
                    onClick={() => { playClick(); navigate(`/teams?returnTo=battle&stageId=${selectedChapter.id}-${st}`); }}
                    >
                    ▶
                    </button>
                </div>
                )}

            </div>
            ))}

            </div>
        </div>
        )}

        <audio ref={audioRef} loop autoPlay>
          <source src={OST} type="audio/mp3" />
        </audio>

    </div>

  );
  
}
