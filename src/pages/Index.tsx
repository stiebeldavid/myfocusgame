import React, { useState, useEffect, useCallback } from "react";
import StarBackground from "@/components/StarBackground";
import FocusCircle from "@/components/FocusCircle";
import GameCircle from "@/components/GameCircle";
import ScoreDisplay from "@/components/ScoreDisplay";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

const FOCUS_LETTERS = ["F", "O", "C", "U", "S"];

const Index = () => {
  const [score, setScore] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [currentSequence, setCurrentSequence] = useState<string[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
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
    setGameStarted(true);
  };

  useEffect(() => {
    scrambleLetters();
  }, [scrambleLetters]);

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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Welcome to the Focus Game!</DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <p>Here's how to play:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Yellow circles: Tap once to pop</li>
                <li>Green circles: Tap the number shown inside to pop</li>
                <li>Red circles: Spell "FOCUS" using the letters below</li>
              </ul>
              <p>Score points by successfully completing each challenge!</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleStartGame} className="w-full">
              Start Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;