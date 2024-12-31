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
}

const EndGameDialog: React.FC<EndGameDialogProps> = ({
  open,
  onOpenChange,
  score,
  gameId,
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

      toast({
        title: "Thanks for subscribing!",
        description: "We'll keep you posted about new focus-building features.",
      });
      onOpenChange(false);
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

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            Great focus session!
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>You scored {score} points. Want to build even better focus skills?</p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Get notified when we add new focus-building features.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Maybe later
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!email || isSubmitting}
          >
            Keep me posted
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EndGameDialog;