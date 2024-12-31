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
      <DialogContent className="sm:max-w-[600px] bg-[#1A1F2C] border-[#9b87f5] text-white">
        <DialogHeader className="space-y-6">
          <DialogTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3 text-[#9b87f5]">
            <Star className="w-8 h-8" />
            Welcome to Focus Flow!
            <Star className="w-8 h-8" />
          </DialogTitle>
          <DialogDescription className="space-y-8 text-white/90">
            <p className="text-center text-xl leading-relaxed">
              Train your focus by engaging with what matters and ignoring distractions.
            </p>
            <div className="space-y-6 bg-white/5 p-8 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Target className="w-8 h-8 text-game-success" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-[#D6BCFA] mb-2">Focus Targets</h3>
                  <p className="text-base leading-relaxed">Green circles need multiple taps to clear. The number shows how many taps remain. These represent important tasks that need your sustained attention.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <ZapOff className="w-8 h-8 text-game-danger" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-[#D6BCFA] mb-2">Distractions</h3>
                  <p className="text-base leading-relaxed">Red circles are distractions. Practice ignoring them and spell "FOCUS" instead. Just like in real life, some things are better left alone.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-[#D6BCFA] mb-2">Quick Wins</h3>
                  <p className="text-base leading-relaxed">Yellow circles need just one tap. They're like small tasks you can quickly complete between bigger challenges.</p>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-6">
          <Button 
            onClick={onStartGame} 
            className="w-full sm:w-[200px] bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-semibold text-lg py-6"
          >
            Start Training
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameInstructions;