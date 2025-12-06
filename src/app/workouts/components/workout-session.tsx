'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { doc, writeBatch, increment, Timestamp, serverTimestamp, collection } from 'firebase/firestore';
import type { UserProfile } from '@/firebase/auth/use-user';
import { format, differenceInCalendarDays } from 'date-fns';
import { X, Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


export interface Exercise {
  name: string;
  details: string;
  duration: number; // Duration in seconds
  muscles: string[];
  imageUrl: string;
}

export interface WorkoutPlan {
  title: string;
  goal: string;
  daysPerWeek: number;
  exercises: Exercise[];
  metric?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface WorkoutSessionProps {
  plan: WorkoutPlan;
  onClose: () => void;
}

export function WorkoutSession({ plan, onClose }: WorkoutSessionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = React.useState(0);
  const [timer, setTimer] = React.useState(plan.exercises[0].duration);
  const [isActive, setIsActive] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const { user, profile } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const totalWorkoutDuration = React.useMemo(() => plan.exercises.reduce((sum, ex) => sum + ex.duration, 0), [plan.exercises]);


  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false);
      // Maybe play a sound or show a notification
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timer]);
  
  const currentExercise = plan.exercises[currentExerciseIndex];
  const progressPercentage = ((currentExerciseIndex + 1) / plan.exercises.length) * 100;

  const handleNextExercise = () => {
    setIsActive(false);
    if (currentExerciseIndex < plan.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setTimer(plan.exercises[currentExerciseIndex + 1].duration);
    } else {
      setIsCompleted(true);
      // Last exercise completed
    }
  };

  const handleFinishWorkout = async () => {
    if (!user || !profile) {
      toast({
        variant: "destructive",
        title: "Not Authenticated",
        description: "You must be logged in to log a workout.",
      });
      return;
    }
    try {
      const userRef = doc(firestore, 'users', user.uid);
      const workoutsCollectionRef = collection(userRef, 'workouts');
      const newWorkoutRef = doc(workoutsCollectionRef);
      const workoutDate = new Date();
      const workoutDateStr = format(workoutDate, 'yyyy-MM-dd');

      const workoutPayload = {
        workoutType: plan.title,
        duration: totalWorkoutDuration / 60, // in minutes
        caloriesBurned: Math.round(totalWorkoutDuration / 60 * 8), // rough estimate
        date: Timestamp.fromDate(workoutDate),
        createdAt: serverTimestamp(),
        notes: `Completed workout plan: ${plan.title}`,
      };

      const batch = writeBatch(firestore);
      batch.set(newWorkoutRef, workoutPayload);
      
      const updates: Partial<UserProfile> & { [key: string]: any } = {};
      updates.totalWorkouts = increment(1);
      updates.caloriesBurned = increment(workoutPayload.caloriesBurned);
      
      const lastWorkoutDate = profile.lastWorkoutDate ? new Date(profile.lastWorkoutDate) : null;
      let newStreak = profile.activeStreak || 0;
      if (lastWorkoutDate) {
        const daysDifference = differenceInCalendarDays(workoutDate, lastWorkoutDate);
        if (daysDifference === 1) newStreak += 1;
        else if (daysDifference > 1) newStreak = 1;
      } else {
        newStreak = 1;
      }
      updates.activeStreak = newStreak;
      updates.lastWorkoutDate = workoutDateStr;

      const monthKey = format(workoutDate, 'MMM');
      const newWorkoutHistory = [...(profile.workoutHistory || [])];
      const monthIndex = newWorkoutHistory.findIndex(h => h.month === monthKey);
      if (monthIndex > -1) {
          newWorkoutHistory[monthIndex] = { ...newWorkoutHistory[monthIndex], workouts: (newWorkoutHistory[monthIndex].workouts || 0) + 1};
      }
      updates.workoutHistory = newWorkoutHistory;
      
      if (plan.metric) {
        const newProgressOverview = [...(profile.progressOverview || [])];
        const metricIndex = newProgressOverview.findIndex(p => p.metric === plan.metric);
        if (metricIndex > -1) {
          newProgressOverview[metricIndex].value = (newProgressOverview[metricIndex].value || 0) + 5; // Add 5 points per plan
        }
        updates.progressOverview = newProgressOverview;
      }
      
      batch.update(userRef, updates);
      await batch.commit();
      
      toast({
        title: 'Workout Completed & Logged!',
        description: 'Great job! Your dashboard has been updated.',
      });
      onClose();
    } catch(e: any) {
      toast({
        variant: "destructive",
        title: "Error finishing workout",
        description: e.message || "Could not save your workout. Please try again.",
      });
      console.error(e);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleClose = () => {
    if (!isCompleted) {
        setIsClosing(true);
    } else {
        onClose();
    }
  };

  return (
    <>
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in-50">
      <Card className="w-full max-w-2xl mx-4 relative">
        <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={handleClose}>
          <X />
        </Button>
        <CardHeader>
          <CardTitle className="font-headline">{plan.title}</CardTitle>
          <CardDescription>
            Exercise {currentExerciseIndex + 1} of {plan.exercises.length}
          </CardDescription>
          <Progress value={progressPercentage} className="mt-2" />
        </CardHeader>
        <CardContent className="text-center">
            {isCompleted ? (
                <div className="flex flex-col items-center justify-center p-8 gap-4">
                    <h2 className="text-3xl font-bold font-headline text-primary">Workout Complete!</h2>
                    <p className="text-muted-foreground">You rocked it! Ready to log this session?</p>
                    <Button size="lg" onClick={handleFinishWorkout}>Finish & Log Workout</Button>
                </div>
            ) : (
                <>
                    <div className="relative h-64 w-full bg-muted rounded-lg mb-4 overflow-hidden">
                        <Image 
                            src={currentExercise.imageUrl} 
                            alt={currentExercise.name}
                            fill
                            className="object-contain"
                            data-ai-hint={`${currentExercise.muscles.join(' ')} exercise`}
                        />
                    </div>
                    <h2 className="text-2xl font-semibold">{currentExercise.name}</h2>
                    <p className="text-muted-foreground mb-1">{currentExercise.details}</p>
                    <p className="text-xs text-muted-foreground mb-8">Muscles: {currentExercise.muscles.join(', ')}</p>

                    <div className="text-8xl font-bold font-mono text-primary my-8">
                        {formatTime(timer)}
                    </div>

                    <div className="flex justify-center gap-4 items-center">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setTimer(currentExercise.duration)}
                            aria-label="Reset Timer"
                        >
                            <RotateCcw />
                        </Button>
                        <Button
                            size="lg"
                            onClick={() => setIsActive(!isActive)}
                            className="w-32"
                            aria-label={isActive ? 'Pause Timer' : 'Start Timer'}
                        >
                            {isActive ? <Pause className="mr-2"/> : <Play className="mr-2"/>}
                            {isActive ? 'Pause' : 'Start'}
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNextExercise}
                            aria-label="Next Exercise"
                            disabled={timer > 0}
                        >
                            <SkipForward />
                        </Button>
                    </div>
                </>
            )}
        </CardContent>
      </Card>
    </div>
    <AlertDialog open={isClosing} onOpenChange={setIsClosing}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to quit?</AlertDialogTitle>
            <AlertDialogDescription>
                If you quit now, your workout progress for this session will not be saved.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onClose} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Quit Workout
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
