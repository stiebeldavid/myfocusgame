import React, { useState, useEffect, useCallback } from "react";
import StarBackground from "@/components/StarBackground";
import FocusCircle from "@/components/FocusCircle";
import GameCircle from "@/components/GameCircle";
import ScoreDisplay from "@/components/ScoreDisplay";
import confetti from "canvas-confetti";

const FOCUS_LETTERS = ["F", "O", "C", "U", "S"];

const Index = () => {
  const [score, setScore] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [currentSequence, setCurrentSequence] = useState<string[]>([]);
  const [gameCircle, setGameCircle] = useState<{ type: "green" | "red"; isVisible: boolean; taps: number }>({
    type: "green",
    isVisible: false,
    taps: 0,
  });

  const scrambleLetters = useCallback(() => {
    const shuffled = [...FOCUS_LETTERS].sort(() => Math.random() - 0.5);
    setScrambledLetters(shuffled);
  }, []);

  const spawnNewCircle = useCallback(() => {
    const type = Math.random() > 0.5 ? "green" : "red";
    setGameCircle({ type, isVisible: true, taps: 0 });
    setCurrentSequence([]);
  }, []);

  const handleCircleClick = () => {
    if (!gameCircle.isVisible) return;

    if (gameCircle.type === "green") {
      const newTaps = gameCircle.taps + 1;
      if (newTaps === 3) {
        setScore((prev) => prev + 1);
        setGameCircle((prev) => ({ ...prev, isVisible: false }));
      } else {
        setGameCircle((prev) => ({ ...prev, taps: newTaps }));
      }
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

  useEffect(() => {
    scrambleLetters();
  }, [scrambleLetters]);

  useEffect(() => {
    if (!gameCircle.isVisible) {
      const timeout = setTimeout(spawnNewCircle, 2000);
      return () => clearTimeout(timeout);
    }
  }, [gameCircle.isVisible, spawnNewCircle]);

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
    </div>
  );
};

export default Index;