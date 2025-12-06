'use client';

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { tinyDailyTasks } from '@/lib/daily-tasks';
import { PartyPopper, X, Check } from 'lucide-react';
import { useWindowSize } from '@/hooks/use-window-size';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { format, differenceInCalendarDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export function DailyTaskCard() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [task, setTask] = useState<string | null>(null);
  const { width, height } = useWindowSize();
  const { user, profile } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const taskState = localStorage.getItem('dailyTaskState');

    if (taskState !== today) {
      const dayIndex = getDayOfYear();
      const dailyTask = tinyDailyTasks[dayIndex % tinyDailyTasks.length];
      setTask(dailyTask);
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('dailyTaskState', today);
    setIsVisible(false);
  };

  const handleComplete = async () => {
    if (!user || !profile) {
      toast({
          variant: "destructive",
          title: "Not Authenticated",
          description: "You must be logged in to complete a task.",
      });
      return;
    }
    
    setIsCompleted(true);
    
    try {
      const userRef = doc(firestore, 'users', user.uid);
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');
      
      const lastWorkoutDate = profile.lastWorkoutDate ? new Date(profile.lastWorkoutDate) : null;
      let newStreak = profile.activeStreak || 0;

      if (!lastWorkoutDate || format(lastWorkoutDate, 'yyyy-MM-dd') !== todayStr) {
        if (lastWorkoutDate && differenceInCalendarDays(today, lastWorkoutDate) === 1) {
            newStreak += 1;
        } else {
            newStreak = 1;
        }
        await updateDoc(userRef, {
            activeStreak: newStreak,
            lastWorkoutDate: todayStr,
        });
         toast({
            title: "Streak Updated!",
            description: `You're on a ${newStreak}-day streak!`,
        });
      }

    } catch(e) {
      console.error("Failed to update streak", e);
      toast({
        variant: "destructive",
        title: "Error updating streak",
        description: "Could not save your progress, but great job on the task!",
      })
    }

    setTimeout(() => {
        handleDismiss();
    }, 5000); // Hide card after 5 seconds of confetti
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {isCompleted && <Confetti width={width} height={height} recycle={false} numberOfPieces={400} />}
      <Card className="w-full bg-accent/20 border-accent/50 animate-in fade-in-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className='flex items-center gap-2'>
                <PartyPopper className="text-primary h-6 w-6" />
                <CardTitle className="font-headline text-xl">Your Tiny Task for Today!</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center text-lg font-medium text-foreground">
            {task}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
            {isCompleted ? (
                <div className="text-lg font-semibold text-primary flex items-center gap-2">
                    <Check /> Well Done!
                </div>
            ) : (
                <Button onClick={handleComplete}>
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Complete
                </Button>
            )}
        </CardFooter>
      </Card>
    </>
  );
}
