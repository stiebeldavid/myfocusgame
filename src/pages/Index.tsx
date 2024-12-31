import React, { useState, useEffect, useCallback } from "react";
import StarBackground from "@/components/StarBackground";
import GameCircle from "@/components/GameCircle";
import ScoreDisplay from "@/components/ScoreDisplay";
import GameInstructions from "@/components/GameInstructions";
import GameCountdown from "@/components/GameCountdown";
import GameLetters from "@/components/GameLetters";
import EndGameDialog from "@/components/EndGameDialog";
import { useGameState } from "@/hooks/useGameState";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import confetti from "canvas-confetti";

const FOCUS_LETTERS = ["F", "O", "C", "U", "S"];

const Index = () => {
  const { score, initializeGame, incrementScore, currentGameId } = useGameState();
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [currentSequence, setCurrentSequence] = useState<string[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [gameCircle, setGameCircle] = useState<{
    type: "green" | "red" | "yellow";
    isVisible: boolean;
    taps: number;
  }>({
    type: "green",
    isVisible: false,
    taps: 0,
  });

  const scrambleLetters = useCallback(() => {
    const shuffled = [...FOCUS_LETTERS].sort(() => Math.random() - 0.5);
    setScrambledLetters(shuffled);
  }, []);

  const spawnNewCircle = useCallback(() => {
    if (!gameStarted) return;
    
    const rand = Math.random();
    let type: "green" | "red" | "yellow";
    
    if (rand < 0.5) {
      type = "yellow";
    } else if (rand < 0.75) {
      type = "green";
    } else {
      type = "red";
    }

    const taps = type === "green" ? Math.floor(Math.random() * 4) + 3 : 0;
    setGameCircle({ type, isVisible: true, taps });
    setCurrentSequence([]);
  }, [gameStarted]);

  const spawnFirstGreenCircle = useCallback(() => {
    const taps = Math.floor(Math.random() * 4) + 3;
    setGameCircle({ type: "green", isVisible: true, taps });
    setCurrentSequence([]);
  }, []);

  const handleCircleClick = () => {
    if (!gameCircle.isVisible) return;

    if (gameCircle.type === "green") {
      const newTaps = gameCircle.taps - 1;
      if (newTaps === 0) {
        incrementScore();
        setGameCircle((prev) => ({ ...prev, isVisible: false }));
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          decay: 0.95
        });
      } else {
        setGameCircle((prev) => ({ ...prev, taps: newTaps }));
      }
    } else if (gameCircle.type === "yellow") {
      incrementScore();
      setGameCircle((prev) => ({ ...prev, isVisible: false }));
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.6 },
        decay: 0.95
      });
    }
  };

  const handleLetterClick = (letter: string) => {
    if (gameCircle.type !== "red" || !gameCircle.isVisible) return;

    const newSequence = [...currentSequence, letter];
    setCurrentSequence(newSequence);

    if (newSequence.join("") === "FOCUS") {
      incrementScore();
      setGameCircle((prev) => ({ ...prev, isVisible: false }));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      scrambleLetters();
    } else if (newSequence.length === 5 || letter !== FOCUS_LETTERS[newSequence.length - 1]) {
      setCurrentSequence([]);
    }
  };

  const handleStartGame = async () => {
    setShowInstructions(false);
    setCountdown(3);
    await initializeGame();
  };

  useEffect(() => {
    scrambleLetters();
  }, [scrambleLetters]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setGameStarted(true);
      setCountdown(null);
      spawnFirstGreenCircle();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, spawnFirstGreenCircle]);

  useEffect(() => {
    if (!gameCircle.isVisible && gameStarted) {
      const timeout = setTimeout(spawnNewCircle, 1500);
      return () => clearTimeout(timeout);
    }
  }, [gameCircle.isVisible, spawnNewCircle, gameStarted]);

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <StarBackground />
      <ScoreDisplay score={score} />
      
      {gameStarted && (
        <div className="absolute top-8 right-8">
          <Button
            variant="outline"
            onClick={() => setShowEndDialog(true)}
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <Flag className="mr-2" />
            Done Training
          </Button>
        </div>
      )}
      
      <GameCountdown countdown={countdown} />

      <GameCircle
        type={gameCircle.type}
        isVisible={gameCircle.isVisible}
        onClick={handleCircleClick}
        taps={gameCircle.taps}
      />

      <GameLetters
        scrambledLetters={scrambledLetters}
        currentSequence={currentSequence}
        onLetterClick={handleLetterClick}
      />

      <GameInstructions
        open={showInstructions}
        onOpenChange={setShowInstructions}
        onStartGame={handleStartGame}
      />

      <EndGameDialog
        open={showEndDialog}
        onOpenChange={setShowEndDialog}
        score={score}
        gameId={currentGameId}
      />
    </div>
  );
};

export default Index;