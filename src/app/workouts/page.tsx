'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Target, Repeat, PlayCircle, Zap, HeartPulse, Wind } from 'lucide-react';
import { WorkoutSession, type WorkoutPlan } from './components/workout-session';

const workoutPlans: WorkoutPlan[] = [
  {
    title: 'Full Body Strength',
    goal: 'Build overall muscle and strength',
    daysPerWeek: 3,
    metric: 'Strength',
    exercises: [
      { name: 'Squats', details: '3 sets of 8-12 reps', duration: 180 },
      { name: 'Bench Press', details: '3 sets of 8-12 reps', duration: 180 },
      { name: 'Deadlifts', details: '3 sets of 5-8 reps', duration: 240 },
      { name: 'Overhead Press', details: '3 sets of 8-12 reps', duration: 180 },
      { name: 'Pull-ups', details: '3 sets to failure', duration: 150 },
    ],
  },
  {
    title: 'Cardio Burn',
    goal: 'Improve cardiovascular health and endurance',
    daysPerWeek: 4,
    metric: 'Cardio',
    exercises: [
      { name: 'Treadmill Run', details: '30 min, Moderate intensity', duration: 1800 },
      { name: 'Cycling', details: '20 min, High intensity', duration: 1200 },
      { name: 'Jumping Jacks', details: '4 sets of 60 seconds', duration: 240 },
      { name: 'Burpees', details: '4 sets of 15 reps', duration: 180 },
    ],
  },
  {
    title: 'HIIT Blitz',
    goal: 'High-intensity interval training for max calorie burn',
    daysPerWeek: 3,
    metric: 'Endurance',
    exercises: [
      { name: 'High Knees', details: '45s on, 15s rest', duration: 60 },
      { name: 'Mountain Climbers', details: '45s on, 15s rest', duration: 60 },
      { name: 'Jump Squats', details: '45s on, 15s rest', duration: 60 },
      { name: 'Plank Jacks', details: '45s on, 15s rest', duration: 60 },
      { name: 'Rest', details: '2 minutes', duration: 120 },
      { name: 'Repeat Circuit', details: '3 more times', duration: 0 },
    ],
  },
  {
    title: 'Core Crusher',
    goal: 'Develop strong and stable core muscles',
    daysPerWeek: 4,
    metric: 'Strength',
    exercises: [
      { name: 'Crunches', details: '3 sets of 20 reps', duration: 120 },
      { name: 'Leg Raises', details: '3 sets of 15 reps', duration: 120 },
      { name: 'Russian Twists', details: '3 sets of 15 reps (each side)', duration: 120 },
      { name: 'Plank', details: '3 sets, hold for 60s', duration: 180 },
      { name: 'Side Plank', details: '3 sets, hold 30s each side', duration: 180 },
    ],
  },
  {
    title: 'Mindful Movement',
    goal: 'Increase flexibility and mind-body connection',
    daysPerWeek: 5,
    metric: 'Flexibility',
    exercises: [
      { name: 'Dynamic Stretching', details: '10 minutes', duration: 600 },
      { name: 'Yoga Flow', details: '30 minutes', duration: 1800 },
      { name: 'Foam Rolling', details: '15 minutes', duration: 900 },
      { name: 'Deep Stretches (Hamstrings, Hips)', details: '10 minutes', duration: 600 },
    ],
  },
   {
    title: 'Active Recovery',
    goal: 'Promote muscle recovery and reduce soreness',
    daysPerWeek: 2,
    metric: 'Balance',
    exercises: [
      { name: 'Light Walk', details: '20 minutes', duration: 1200 },
      { name: 'Full Body Stretching', details: '15 minutes', duration: 900 },
      { name: 'Foam Roll', details: '10 minutes, focus on sore areas', duration: 600 },
    ],
  },
];

const getIcon = (metric?: string) => {
    switch(metric) {
        case 'Strength': return <Dumbbell className="text-primary" />;
        case 'Cardio': return <HeartPulse className="text-primary" />;
        case 'Endurance': return <Zap className="text-primary" />;
        case 'Flexibility': return <Wind className="text-primary" />;
        case 'Balance': return <Dumbbell className="text-primary" />;
        default: return <Dumbbell className="text-primary" />;
    }
}

export default function WorkoutsPage() {
  const [activeWorkout, setActiveWorkout] = React.useState<WorkoutPlan | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Workout Plans</h1>
        <p className="text-muted-foreground">
          Here are your custom and suggested workout plans. Click one to start a session.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workoutPlans.map((plan, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    {getIcon(plan.metric)} {plan.title}
                </CardTitle>
                 <CardDescription className="pt-2">
                    <span className="flex items-center gap-1.5"><Target className="size-4 text-muted-foreground" /> {plan.goal}</span>
                    <span className="flex items-center gap-1.5 mt-1"><Repeat className="size-4 text-muted-foreground" /> {plan.daysPerWeek} days/week</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                 <ul className="space-y-2 pt-4 border-t">
                    {plan.exercises.slice(0, 3).map((ex, exIndex) => (
                    <li key={exIndex} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-muted-foreground">{ex.name}</span>
                        <span className="text-xs text-muted-foreground/80">
                        {ex.details}
                        </span>
                    </li>
                    ))}
                    {plan.exercises.length > 3 && <li className="text-sm text-center text-muted-foreground/80">...and more</li>}
                </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setActiveWorkout(plan)}>
                <PlayCircle className="mr-2" />
                Start Workout
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {activeWorkout && (
        <WorkoutSession
          plan={activeWorkout}
          onClose={() => setActiveWorkout(null)}
        />
      )}
    </div>
  );
}
