import React from 'react';

interface GameCountdownProps {
  countdown: number | null;
}

const GameCountdown = ({ countdown }: GameCountdownProps) => {
  if (countdown === null) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="text-8xl font-bold text-white animate-bounce">
        {countdown === 0 ? "Start!" : countdown}
      </div>
    </div>
  );
};

export default GameCountdown;