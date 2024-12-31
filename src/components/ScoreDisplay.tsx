import React from "react";

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="absolute top-4 sm:top-8 left-4 sm:left-8 bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 rounded-full">
      <span className="text-white text-xl sm:text-2xl font-bold">{score}</span>
    </div>
  );
};

export default ScoreDisplay;