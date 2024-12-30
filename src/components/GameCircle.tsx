import React from "react";
import { cn } from "@/lib/utils";

interface GameCircleProps {
  type: "green" | "red";
  onClick: () => void;
  taps?: number;
  isVisible: boolean;
}

const GameCircle: React.FC<GameCircleProps> = ({ type, onClick, taps = 0, isVisible }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
        type === "green" ? "bg-game-success" : "bg-game-danger",
        isVisible ? "animate-circle-in" : "animate-circle-out",
      )}
    >
      {type === "green" && taps > 0 && <span className="text-white">{3 - taps}</span>}
    </button>
  );
};

export default GameCircle;