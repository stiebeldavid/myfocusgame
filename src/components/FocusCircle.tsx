import React from "react";
import { cn } from "@/lib/utils";

interface FocusCircleProps {
  letter: string;
  onClick: () => void;
  isActive: boolean;
}

const FocusCircle: React.FC<FocusCircleProps> = ({ letter, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300",
        isActive ? "bg-game-focus text-white scale-110" : "bg-game-focus/50 text-white/70"
      )}
    >
      {letter}
    </button>
  );
};

export default FocusCircle;