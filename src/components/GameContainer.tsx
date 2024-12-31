import React, { useState } from 'react';
import GameCircle from './GameCircle';
import GameLetters from './GameLetters';
import ScoreDisplay from './ScoreDisplay';
import { Button } from './ui/button';
import { Flag } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface GameContainerProps {
  gameStarted: boolean;
  gameCircle: {
    type: "green" | "red" | "yellow";
    isVisible: boolean;
    taps: number;
  };
  scrambledLetters: string[];
  currentSequence: string[];
  score: number;
  onCircleClick: () => void;
  onLetterClick: (letter: string) => void;
  onEndGame: () => void;
  hasSeenGreen: boolean;
  hasSeenYellow: boolean;
  hasSeenRed: boolean;
  onShowInstructions: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({
  gameStarted,
  gameCircle,
  scrambledLetters,
  currentSequence,
  score,
  onCircleClick,
  onLetterClick,
  onEndGame,
  hasSeenGreen,
  hasSeenYellow,
  hasSeenRed,
  onShowInstructions,
}) => {
  const [showRedTooltip, setShowRedTooltip] = useState(false);

  const getTooltipContent = () => {
    if (gameCircle.type === "green" && !hasSeenGreen) {
      return "This is a Focus Target! Tap it multiple times to clear it. The number shows how many taps remain.";
    }
    if (gameCircle.type === "yellow" && !hasSeenYellow) {
      return "Quick Win! Just one tap to clear this yellow circle.";
    }
    if (gameCircle.type === "red" && !hasSeenRed) {
      return "This is a Distraction! Instead of tapping it, try spelling 'FOCUS' with the letters below.";
    }
    return null;
  };

  const handleCircleClick = () => {
    if (gameCircle.type === "red") {
      setShowRedTooltip(true);
      // Hide tooltip after 3 seconds
      setTimeout(() => setShowRedTooltip(false), 3000);
    }
    onCircleClick();
  };

  const tooltipContent = getTooltipContent();

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center px-4 py-6">
      <ScoreDisplay score={score} />
      
      {gameStarted && (
        <div className="absolute top-4 sm:top-8 right-4 sm:right-8 z-10">
          <Button
            variant="outline"
            onClick={onEndGame}
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 text-white border-white/20 text-sm sm:text-base py-2 px-3 sm:py-3 sm:px-4"
          >
            <Flag className="mr-2 h-4 w-4" />
            Done Training
          </Button>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center w-full max-w-lg mx-auto">
        <TooltipProvider>
          <Tooltip open={gameCircle.type === "red" && showRedTooltip}>
            <TooltipTrigger asChild>
              <div className="relative">
                <GameCircle
                  type={gameCircle.type}
                  isVisible={gameCircle.isVisible}
                  onClick={handleCircleClick}
                  taps={gameCircle.taps}
                />
              </div>
            </TooltipTrigger>
            {gameCircle.type === "red" && (
              <TooltipContent 
                side="top" 
                className="max-w-[200px] text-center bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-lg shadow-lg"
              >
                Ignore this red circle! Instead, spell 'FOCUS' using the letters below.
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="w-full max-w-lg mx-auto mt-auto">
        <GameLetters
          scrambledLetters={scrambledLetters}
          currentSequence={currentSequence}
          onLetterClick={onLetterClick}
        />
      </div>
    </div>
  );
};

export default GameContainer;