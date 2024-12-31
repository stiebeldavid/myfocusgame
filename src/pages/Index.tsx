import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import StarBackground from "@/components/StarBackground";
import FocusCircle from "@/components/FocusCircle";
import GameCircle from "@/components/GameCircle";
import ScoreDisplay from "@/components/ScoreDisplay";
import GameInstructions from "@/components/GameInstructions";
import Auth from "@/components/Auth";
import { useGameState } from "@/hooks/useGameState";
import confetti from "canvas-confetti";

const FOCUS_LETTERS = ["F", "O", "C", "U", "S"];

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const { score, initializeGame, incrementScore } = useGameState();
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
      const timeout = setTimeout(spawnNewCircle, 2000);
      return () => clearTimeout(timeout);
    }
  }, [gameCircle.isVisible, spawnNewCircle, gameStarted]);

  if (!session) {
    return <Auth />;
  }

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

      <GameInstructions
        open={showInstructions}
        onOpenChange={setShowInstructions}
        onStartGame={handleStartGame}
      />
    </div>
  );
};

export default Index;
