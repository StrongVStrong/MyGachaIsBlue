import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useClickSFX } from "../hooks/useClickSFX";
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
    3: {
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
    4: {
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

    </div>

  );
  
}
