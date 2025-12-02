"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/lib/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Clock, LogIn } from "lucide-react";
import Link from "next/link";

export default function VoteInfo() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [canVote, setCanVote] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.nextVoteAt) {
      setCanVote(true);
      setTimeLeft("");
      return;
    }

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const nextVoteTime = new Date(user.nextVoteAt!).getTime();
      const difference = nextVoteTime - now;

      if (difference <= 0) {
        setCanVote(true);
        setTimeLeft("");
      } else {
        setCanVote(false);
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user?.nextVoteAt]);

  if (!isAuthenticated) {
    return (
      <Alert variant="destructive" className="bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Giriş Yapmalısınız</AlertTitle>
        <AlertDescription className="flex items-center justify-between mt-2">
          <span>Oy kullanmak ve ödül kazanmak için giriş yapmanız gerekmektedir.</span>
          <Button size="sm" variant="outline" className="bg-background/50 border-yellow-500/30 hover:bg-yellow-500/20" asChild>
            <Link href="/auth/sign-in">
              <LogIn className="w-4 h-4 mr-2" />
              Giriş Yap
            </Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!canVote) {
    return (
      <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400">
        <Clock className="h-4 w-4" />
        <AlertTitle>Sonraki Oy Hakkı</AlertTitle>
        <AlertDescription className="mt-2 font-mono text-lg font-bold">
          {timeLeft}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Oy Kullanabilirsiniz</AlertTitle>
      <AlertDescription>
        Şu anda oy kullanabilir ve ödüllerinizi alabilirsiniz. Aşağıdaki sitelerden birini seçin.
      </AlertDescription>
    </Alert>
  );
}
