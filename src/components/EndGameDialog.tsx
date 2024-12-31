import React, { useState } from "react";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EndGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  score: number;
  gameId: number | null;
  onPlayAgain: () => void;
}

const EndGameDialog: React.FC<EndGameDialogProps> = ({
  open,
  onOpenChange,
  score,
  gameId,
  onPlayAgain,
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!gameId) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("GamePlays")
        .update({ user_email: email })
        .eq("id", gameId);

      if (error) throw error;

      setIsSubscribed(true);
      toast({
        title: "Thanks for subscribing!",
        description: "We'll keep you posted about new focus-building features.",
      });
    } catch (error) {
      console.error("Error saving email:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlayAgain = () => {
    onPlayAgain();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[calc(100%-2rem)] mx-auto max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="flex items-center gap-2 text-lg sm:text-2xl">
            <Trophy className="text-yellow-500 h-5 w-5 flex-shrink-0 sm:h-8 sm:w-8" />
            Great focus session!
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p className="text-base sm:text-lg">You scored {score} points.</p>
            <p className="text-base sm:text-lg">Want to build even better focus skills?</p>
            <p className="text-sm text-muted-foreground">
              Get notified when we add new features to this game, or launch other focus-building games or tools.
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-4">
          <Button
            onClick={handleSubmit}
            disabled={!email || isSubmitting || isSubscribed}
            className="w-full sm:w-auto py-4 sm:py-6"
          >
            {isSubscribed ? "Thanks!" : "Join the Waitlist"}
          </Button>
          <Button
            variant="outline"
            onClick={handlePlayAgain}
            className="w-full sm:w-auto py-4 sm:py-6"
          >
            Play Again
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EndGameDialog;