import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface GameCircleProps {
  type: "green" | "red" | "yellow";
  onClick: () => void;
  taps?: number;
  isVisible: boolean;
}

const GameCircle: React.FC<GameCircleProps> = ({ type, onClick, taps = 0, isVisible }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isVisible) {
      let lastTime = performance.now();
      // Increased initial velocity range from 2 to 4
      let velocityX = (Math.random() - 0.5) * 4;
      let velocityY = (Math.random() - 0.5) * 4;

      const animate = (currentTime: number) => {
        const deltaTime = (currentTime - lastTime) / 16;
        lastTime = currentTime;

        setPosition(prev => {
          const newX = prev.x + velocityX * deltaTime;
          const newY = prev.y + velocityY * deltaTime;

          // Bounce off boundaries with more energy (increased from 0.8 to 0.9)
          if (Math.abs(newX) > 150) velocityX *= -0.9;
          if (Math.abs(newY) > 150) velocityY *= -0.9;

          // Increased random movement (from 0.1 to 0.2)
          velocityX += (Math.random() - 0.5) * 0.2;
          velocityY += (Math.random() - 0.5) * 0.2;

          // Reduced damping (from 0.99 to 0.995) to maintain speed longer
          velocityX *= 0.995;
          velocityY *= 0.995;

          return {
            x: Math.max(-150, Math.min(150, newX)),
            y: Math.max(-150, Math.min(150, newY))
          };
        });

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
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
        "w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold absolute top-1/2 left-1/2 transition-transform duration-75",
        bgColor,
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
      )}
    >
      {type === "green" && taps > 0 && <span className="text-white">{taps}</span>}
      {type === "yellow" && <span className="text-white">1</span>}
    </button>
  );
};

export default GameCircle;