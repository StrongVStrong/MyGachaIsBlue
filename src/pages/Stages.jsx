import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
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
            name: "Majin Threat",
            description: "The mighty majin is undergoing some severe changes...",
        },
        5: {
            name: "Fate Staken Tournament",
            description: "Fight to protect your universe!",
        },
    },
    2: {
        1: {
            name: "Arrival of Raditz",
            description: "Face off against Raditz in the opening battle.",
        },
        2: {
            name: "Team-Up",
            description: "Goku and Piccolo join forces to continue the fight.",
        },
        3: {
            name: "Saiyan Threat",
            description: "The Saiyan threat grows...",
        },
        4: {
            name: "Rampaging Nappa",
            description: "Survive Nappa’s wrath!",
        },
        5: {
            name: "Prince of All Saiyans",
            description: "Vegeta awaits as the final challenge of Chapter 1.",
        },
    },
    3: {
        1: {
            name: "Arrival of Raditz",
            description: "Face off against Raditz in the opening battle.",
        },
        2: {
            name: "Team-Up",
            description: "Goku and Piccolo join forces to continue the fight.",
        },
        3: {
            name: "Saiyan Threat",
            description: "The Saiyan threat grows...",
        },
        4: {
            name: "Rampaging Nappa",
            description: "Survive Nappa’s wrath!",
        },
        5: {
            name: "Prince of All Saiyans",
            description: "Vegeta awaits as the final challenge of Chapter 1.",
        },
    },
    4: {
        1: {
            name: "Arrival of Raditz",
            description: "Face off against Raditz in the opening battle.",
        },
        2: {
            name: "Team-Up",
            description: "Goku and Piccolo join forces to continue the fight.",
        },
        3: {
            name: "Saiyan Threat",
            description: "The Saiyan threat grows...",
        },
        4: {
            name: "Rampaging Nappa",
            description: "Survive Nappa’s wrath!",
        },
        5: {
            name: "Prince of All Saiyans",
            description: "Vegeta awaits as the final challenge of Chapter 1.",
        },
    },
    5: {
        1: {
            name: "Arrival of Raditz",
            description: "Face off against Raditz in the opening battle.",
        },
        2: {
            name: "Team-Up",
            description: "Goku and Piccolo join forces to continue the fight.",
        },
        3: {
            name: "Saiyan Threat",
            description: "The Saiyan threat grows...",
        },
        4: {
            name: "Rampaging Nappa",
            description: "Survive Nappa’s wrath!",
        },
        5: {
            name: "Prince of All Saiyans",
            description: "Vegeta awaits as the final challenge of Chapter 1.",
        },
    },
    
};

  
const stages = [1, 2, 3, 4, 5];

export default function BattleSelect() {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const navigate = useNavigate();

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
                onClick={() => setSelectedChapter(ch)}
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
            onClick={() => setSelectedChapter(null)}
            >
            <div className="chapter-image-overlay" />
            <span className="chapter-label">Chapter {selectedChapter.id}</span>
            </div>

            <div className="stage-right-panel">
            {stages.map((st) => (
            <div key={st} className="stage-wrapper">
                <button
                    onClick={() => setSelectedStage(st === selectedStage ? null : st)}
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
                    onClick={() => navigate(`/battle/${selectedChapter.id}-${st}`)}
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

    </div>

  );
  
}
