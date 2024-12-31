import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target, ZapOff, Zap, Star } from "lucide-react";

interface GameInstructionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartGame: () => void;
}

const GameInstructions: React.FC<GameInstructionsProps> = ({ open, onOpenChange, onStartGame }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[calc(100%-2rem)] mx-auto max-h-[85vh] overflow-y-auto bg-[#1A1F2C] border-[#9b87f5] text-white">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-lg sm:text-3xl font-bold text-center flex items-center justify-center gap-2 sm:gap-3 text-[#9b87f5] px-2">
            <Star className="w-4 h-4 sm:w-8 sm:h-8" />
            Welcome to Focus Flow!
            <Star className="w-4 h-4 sm:w-8 sm:h-8" />
          </DialogTitle>
          <DialogDescription className="space-y-4 text-white/90">
            <p className="text-center text-sm sm:text-xl leading-relaxed px-2">
              Train your focus by engaging with what matters and ignoring distractions.
            </p>
            <div className="space-y-4 bg-white/5 p-3 sm:p-6 rounded-lg mx-2">
              <div className="flex items-start gap-3">
                <div className="mt-1 shrink-0">
                  <Target className="w-4 h-4 sm:w-6 sm:h-6 text-game-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-lg text-[#D6BCFA] mb-1">Focus Targets</h3>
                  <p className="text-xs sm:text-base leading-relaxed">Green circles need multiple taps to clear. The number shows how many taps remain. These represent important tasks that need your sustained attention.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 shrink-0">
                  <ZapOff className="w-4 h-4 sm:w-6 sm:h-6 text-game-danger" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-lg text-[#D6BCFA] mb-1">Distractions</h3>
                  <p className="text-xs sm:text-base leading-relaxed">Red circles are distractions. Practice ignoring them and spell "FOCUS" instead. Just like in real life, some things are better left alone.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 shrink-0">
                  <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-lg text-[#D6BCFA] mb-1">Quick Wins</h3>
                  <p className="text-xs sm:text-base leading-relaxed">Yellow circles need just one tap. They're like small tasks you can quickly complete between bigger challenges.</p>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-4">
          <Button 
            onClick={onStartGame} 
            className="w-full sm:w-[200px] bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-semibold text-base sm:text-lg py-3 sm:py-6"
          >
            Start Training
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameInstructions;