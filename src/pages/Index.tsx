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