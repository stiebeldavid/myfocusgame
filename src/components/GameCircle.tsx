import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GameCircleProps {
  type: "green" | "red" | "yellow";
  onClick: () => void;
  taps?: number;
  isVisible: boolean;
}

const GameCircle: React.FC<GameCircleProps> = ({ type, onClick, taps = 0, isVisible }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isVisible) {
      // Start at center
      setPosition({ x: 0, y: 0 });
      
      // Wandering animation
      const interval = setInterval(() => {
        setPosition(prev => {
          const newX = prev.x + (Math.random() - 0.5) * 20;
          const newY = prev.y + (Math.random() - 0.5) * 20;
          
          // Keep within bounds (-150px to 150px from center)
          return {
            x: Math.max(-150, Math.min(150, newX)),
            y: Math.max(-150, Math.min(150, newY))
          };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const bgColor = {
    green: "bg-game-success",
    red: "bg-game-danger",
    yellow: "bg-yellow-400"
  }[type];

  const style = {
    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
  };

  return (
    <button
      onClick={onClick}
      style={style}
      className={cn(
        "w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold absolute top-1/2 left-1/2 transition-all duration-300",
        bgColor,
        isVisible ? "animate-circle-in" : "animate-circle-out"
      )}
    >
      {type === "green" && taps > 0 && <span className="text-white">{taps}</span>}
      {type === "yellow" && <span className="text-white">1</span>}
    </button>
  );
};

export default GameCircle;
