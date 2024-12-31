import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useGameState = () => {
  const [score, setScore] = useState(0);
  const [currentGameId, setCurrentGameId] = useState<number | null>(null);
  const { toast } = useToast();

  const initializeGame = async () => {
    try {
      const { data, error } = await supabase
        .from('GamePlays')
        .insert([{ score: 0 }])
        .select()
        .single();

      if (error) throw error;
      
      setCurrentGameId(data.id);
      setScore(0);
    } catch (error) {
      console.error('Error initializing game:', error);
      toast({
        title: "Error",
        description: "Failed to initialize game. Please try again.",
        variant: "destructive"
      });
    }
  };

  const incrementScore = async () => {
    const newScore = score + 1;
    setScore(newScore);
    
    if (currentGameId) {
      try {
        const { error } = await supabase
          .from('GamePlays')
          .update({ score: newScore })
          .eq('id', currentGameId);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating score:', error);
        toast({
          title: "Warning",
          description: "Score update didn't save to the server.",
          variant: "destructive"
        });
      }
    }
  };

  return {
    score,
    initializeGame,
    incrementScore
  };
};