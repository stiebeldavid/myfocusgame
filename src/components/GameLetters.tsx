import React from 'react';
import FocusCircle from './FocusCircle';

interface GameLettersProps {
  scrambledLetters: string[];
  currentSequence: string[];
  onLetterClick: (letter: string) => void;
}

const GameLetters = ({ scrambledLetters, currentSequence, onLetterClick }: GameLettersProps) => {
  return (
    <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-4">
      {scrambledLetters.map((letter, index) => (
        <FocusCircle
          key={index}
          letter={letter}
          onClick={() => onLetterClick(letter)}
          isActive={currentSequence.includes(letter)}
        />
      ))}
    </div>
  );
};

export default GameLetters;