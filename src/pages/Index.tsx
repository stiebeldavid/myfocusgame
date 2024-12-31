import React, { useState, useEffect, useCallback } from "react";
import StarBackground from "@/components/StarBackground";
import FocusCircle from "@/components/FocusCircle";
import GameCircle from "@/components/GameCircle";
import ScoreDisplay from "@/components/ScoreDisplay";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target, ZapOff, Zap, Star } from "lucide-react";
import confetti from "canvas-confetti";

const FOCUS_LETTERS = ["F", "O", "C", "U", "S"];

const Index = () => {
  const [score, setScore] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [currentSequence, setCurrentSequence] = useState<string[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
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
    
    if (rand < 0.5) { // 50% chance for yellow
      type = "yellow";
    } else if (rand < 0.75) { // 25% chance for green
      type = "green";
    } else { // 25% chance for red
      type = "red";
    }

    const taps = type === "green" ? Math.floor(Math.random() * 4) + 3 : 0; // 3-6 taps for green
    setGameCircle({ type, isVisible: true, taps });
    setCurrentSequence([]);
  }, [gameStarted]);

  const spawnFirstGreenCircle = useCallback(() => {
    const taps = Math.floor(Math.random() * 4) + 3; // 3-6 taps
    setGameCircle({ type: "green", isVisible: true, taps });
    setCurrentSequence([]);
  }, []);

  const handleCircleClick = () => {
    if (!gameCircle.isVisible) return;

    if (gameCircle.type === "green") {
      const newTaps = gameCircle.taps - 1;
      if (newTaps === 0) {
        setScore((prev) => prev + 1);
        setGameCircle((prev) => ({ ...prev, isVisible: false }));
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setGameCircle((prev) => ({ ...prev, taps: newTaps }));
      }
    } else if (gameCircle.type === "yellow") {
      setScore((prev) => prev + 1);
      setGameCircle((prev) => ({ ...prev, isVisible: false }));
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.6 },
      });
    }
  };

  const handleLetterClick = (letter: string) => {
    if (gameCircle.type !== "red" || !gameCircle.isVisible) return;

    const newSequence = [...currentSequence, letter];
    setCurrentSequence(newSequence);

    if (newSequence.join("") === "FOCUS") {
      setScore((prev) => prev + 1);
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

  const handleStartGame = () => {
    setShowInstructions(false);
    setCountdown(3);
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
      const timeout = setTimeout(spawnNewCircle, 2000);
      return () => clearTimeout(timeout);
    }
  }, [gameCircle.isVisible, spawnNewCircle, gameStarted]);

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <StarBackground />
      <ScoreDisplay score={score} />
      
      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="text-8xl font-bold text-white animate-bounce">
            {countdown === 0 ? "Start!" : countdown}
          </div>
        </div>
      )}

      <GameCircle
        type={gameCircle.type}
        isVisible={gameCircle.isVisible}
        onClick={handleCircleClick}
        taps={gameCircle.taps}
      />

      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-4">
        {scrambledLetters.map((letter, index) => (
          <FocusCircle
            key={index}
            letter={letter}
            onClick={() => handleLetterClick(letter)}
            isActive={currentSequence.includes(letter)}
          />
        ))}
      </div>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-[500px] bg-[#1A1F2C] border-[#9b87f5] text-white">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2 text-[#9b87f5]">
              <Star className="w-6 h-6" />
              Welcome to Focus Flow!
              <Star className="w-6 h-6" />
            </DialogTitle>
            <DialogDescription className="space-y-6 text-white/90">
              <p className="text-center text-lg">
                Train your focus by engaging with what matters and ignoring distractions.
              </p>
              <div className="space-y-4 bg-white/5 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 mt-1 text-game-success" />
                  <div>
                    <h3 className="font-semibold text-[#D6BCFA]">Focus Targets</h3>
                    <p className="text-sm">Green circles need multiple taps to clear. The number shows how many taps remain. These represent important tasks that need your sustained attention.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <ZapOff className="w-5 h-5 mt-1 text-game-danger" />
                  <div>
                    <h3 className="font-semibold text-[#D6BCFA]">Distractions</h3>
                    <p className="text-sm">Red circles are distractions. Practice ignoring them and spell "FOCUS" instead. Just like in real life, some things are better left alone.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 mt-1 text-yellow-400" />
                  <div>
                    <h3 className="font-semibold text-[#D6BCFA]">Quick Wins</h3>
                    <p className="text-sm">Yellow circles need just one tap. They're like small tasks you can quickly complete between bigger challenges.</p>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={handleStartGame} 
              className="w-full sm:w-[200px] bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-semibold"
            >
              Start Training
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;