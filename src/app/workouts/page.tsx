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
import { Dumbbell, Target, Repeat, PlayCircle, Zap, HeartPulse, Wind, ShieldCheck, BarChart, Leaf } from 'lucide-react';
import { WorkoutSession, type WorkoutPlan } from './components/workout-session';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';


const workoutPlans: WorkoutPlan[] = [
  // Beginner
  {
    title: 'Beginner Bodyweight Basics',
    goal: 'Build foundational strength with no equipment',
    daysPerWeek: 3,
    metric: 'Strength',
    difficulty: 'Beginner',
    exercises: [
      { name: 'Jumping Jacks', details: 'Warm-up for 60 seconds', duration: 60, muscles: ['Full Body'] },
      { name: 'Bodyweight Squats', details: '3 sets of 10-15 reps', duration: 180, muscles: ['Quads', 'Glutes'] },
      { name: 'Knee Push-ups', details: '3 sets of 8-12 reps', duration: 180, muscles: ['Chest', 'Triceps'] },
      { name: 'Plank', details: '3 sets, hold for 30 seconds', duration: 150, muscles: ['Core'] },
      { name: 'Glute Bridges', details: '3 sets of 15 reps', duration: 120, muscles: ['Glutes', 'Hamstrings'] },
    ],
  },
  {
    title: 'Cardio Starter',
    goal: 'Improve cardiovascular health and endurance',
    daysPerWeek: 4,
    metric: 'Cardio',
    difficulty: 'Beginner',
    exercises: [
      { name: 'Brisk Walking', details: '15 min, steady pace', duration: 900, muscles: ['Legs', 'Cardio'] },
      { name: 'Jogging in Place', details: '5 min, moderate effort', duration: 300, muscles: ['Legs', 'Cardio'] },
      { name: 'Jumping Jacks', details: '4 sets of 45 seconds', duration: 240, muscles: ['Full Body'] },
      { name: 'High Knees', details: '4 sets of 30 seconds', duration: 180, muscles: ['Full Body', 'Cardio'] },
    ],
  },
  {
    title: 'Mindful Movement',
    goal: 'Increase flexibility and mind-body connection',
    daysPerWeek: 5,
    metric: 'Flexibility',
    difficulty: 'Beginner',
    exercises: [
      { name: 'Dynamic Stretching', details: '10 minutes of gentle movements', duration: 600, muscles: ['Full Body'] },
      { name: 'Beginner Yoga Flow', details: '20 minutes of basic poses', duration: 1200, muscles: ['Full Body'] },
      { name: 'Deep Breathing', details: '5 minutes of focused breathing', duration: 300, muscles: ['Mind'] },
      { name: 'Static Stretches (Hold 30s each)', details: '10 minutes', duration: 600, muscles: ['Legs', 'Back', 'Chest'] },
    ],
  },
  {
    title: 'Active Recovery & Mobility',
    goal: 'Promote muscle recovery and reduce soreness',
    daysPerWeek: 2,
    metric: 'Balance',
    difficulty: 'Beginner',
    exercises: [
      { name: 'Light Walk', details: '20 minutes', duration: 1200, muscles: ['Full Body'] },
      { name: 'Full Body Stretching', details: '15 minutes', duration: 900, muscles: ['Full Body'] },
      { name: 'Foam Roll', details: '10 minutes, focus on tight areas', duration: 600, muscles: ['Full Body'] },
    ],
  },
  {
    title: 'Dumbbell Intro',
    goal: 'Learn basic dumbbell movements safely',
    daysPerWeek: 3,
    metric: 'Strength',
    difficulty: 'Beginner',
    exercises: [
      { name: 'Dumbbell Goblet Squats', details: '3 sets of 10 reps', duration: 180, muscles: ['Quads', 'Glutes'] },
      { name: 'Dumbbell Rows', details: '3 sets of 12 reps per arm', duration: 240, muscles: ['Back', 'Biceps'] },
      { name: 'Dumbbell Bench Press', details: '3 sets of 10 reps', duration: 180, muscles: ['Chest', 'Triceps'] },
      { name: 'Dumbbell Bicep Curls', details: '3 sets of 12 reps', duration: 150, muscles: ['Biceps'] },
    ],
  },
  // Intermediate
  {
    title: 'Full Body Strength',
    goal: 'Build overall muscle and strength',
    daysPerWeek: 3,
    metric: 'Strength',
    difficulty: 'Intermediate',
    exercises: [
      { name: 'Barbell Squats', details: '3 sets of 8-12 reps', duration: 180, muscles: ['Quads', 'Glutes'] },
      { name: 'Bench Press', details: '3 sets of 8-12 reps', duration: 180, muscles: ['Chest', 'Triceps'] },
      { name: 'Deadlifts', details: '3 sets of 5-8 reps', duration: 240, muscles: ['Back', 'Hamstrings'] },
      { name: 'Overhead Press', details: '3 sets of 8-12 reps', duration: 180, muscles: ['Shoulders'] },
      { name: 'Pull-ups / Lat Pulldowns', details: '3 sets to failure or 10-12 reps', duration: 150, muscles: ['Back', 'Biceps'] },
    ],
  },
  {
    title: 'Core Crusher',
    goal: 'Develop strong and stable core muscles',
    daysPerWeek: 4,
    metric: 'Strength',
    difficulty: 'Intermediate',
    exercises: [
      { name: 'Hanging Leg Raises', details: '3 sets of 15 reps', duration: 180, muscles: ['Lower Abs'] },
      { name: 'Cable Crunches', details: '3 sets of 15-20 reps', duration: 180, muscles: ['Abs'] },
      { name: 'Russian Twists (with weight)', details: '3 sets of 15 reps (each side)', duration: 120, muscles: ['Obliques'] },
      { name: 'Plank', details: '3 sets, hold for 90s', duration: 270, muscles: ['Core'] },
      { name: 'Ab Rollouts', details: '3 sets of 10-12 reps', duration: 180, muscles: ['Core', 'Abs'] },
    ],
  },
  {
    title: 'Endurance Builder',
    goal: 'Push your cardio limits and increase stamina',
    daysPerWeek: 4,
    metric: 'Endurance',
    difficulty: 'Intermediate',
    exercises: [
        { name: 'Interval Run', details: '5 min warm up, then 8x 400m sprint, 90s rest', duration: 2400, muscles: ['Legs', 'Cardio'] },
        { name: 'Kettlebell Swings', details: '5 sets of 20 reps', duration: 300, muscles: ['Glutes', 'Hamstrings', 'Back'] },
        { name: 'Rowing Machine', details: '2000m for time', duration: 600, muscles: ['Full Body', 'Cardio'] },
        { name: 'Box Jumps', details: '4 sets of 12 reps', duration: 240, muscles: ['Legs', 'Glutes'] },
    ],
  },
  {
    title: 'Aesthetic Physique (Upper Body Focus)',
    goal: 'Build a well-defined upper body',
    daysPerWeek: 2,
    metric: 'Strength',
    difficulty: 'Intermediate',
    exercises: [
        { name: 'Incline Dumbbell Press', details: '4 sets of 10-12 reps', duration: 240, muscles: ['Upper Chest'] },
        { name: 'Seated Cable Rows', details: '4 sets of 10-12 reps', duration: 240, muscles: ['Back'] },
        { name: 'Lateral Raises', details: '4 sets of 15-20 reps', duration: 200, muscles: ['Shoulders'] },
        { name: 'Tricep Pushdowns', details: '3 sets of 12-15 reps', duration: 150, muscles: ['Triceps'] },
        { name: 'Face Pulls', details: '3 sets of 15-20 reps', duration: 150, muscles: ['Rear Delts', 'Back'] },
    ],
  },
  {
    title: 'Aesthetic Physique (Lower Body Focus)',
    goal: 'Develop strong and sculpted legs',
    daysPerWeek: 2,
    metric: 'Strength',
    difficulty: 'Intermediate',
    exercises: [
        { name: 'Leg Press', details: '4 sets of 10-15 reps', duration: 240, muscles: ['Quads', 'Glutes'] },
        { name: 'Romanian Deadlifts', details: '4 sets of 10-12 reps', duration: 240, muscles: ['Hamstrings', 'Glutes'] },
        { name: 'Bulgarian Split Squats', details: '3 sets of 12 reps per leg', duration: 300, muscles: ['Quads', 'Glutes'] },
        { name: 'Leg Curls', details: '3 sets of 15-20 reps', duration: 150, muscles: ['Hamstrings'] },
        { name: 'Calf Raises', details: '4 sets of 20 reps', duration: 180, muscles: ['Calves'] },
    ],
  },
  // Advanced
  {
    title: 'HIIT Blitz',
    goal: 'High-intensity interval training for max calorie burn',
    daysPerWeek: 3,
    metric: 'Endurance',
    difficulty: 'Advanced',
    exercises: [
      { name: 'Burpee Box Jumps', details: '45s on, 15s rest', duration: 60, muscles: ['Full Body', 'Cardio'] },
      { name: 'Kettlebell Snatches', details: '45s on, 15s rest', duration: 60, muscles: ['Full Body'] },
      { name: 'Assault Bike Sprint', details: '45s on, 15s rest', duration: 60, muscles: ['Full Body', 'Cardio'] },
      { name: 'Toes-to-Bar', details: '45s on, 15s rest', duration: 60, muscles: ['Core', 'Abs'] },
      { name: 'Rest', details: '3 minutes', duration: 180, muscles: [] },
      { name: 'Repeat Circuit', details: '4 more times', duration: 0, muscles: [] },
    ],
  },
  {
    title: 'Advanced Strength & Power',
    goal: 'Maximize strength and explosive power',
    daysPerWeek: 4,
    metric: 'Strength',
    difficulty: 'Advanced',
    exercises: [
        { name: 'Heavy Squats', details: '5 sets of 3-5 reps', duration: 300, muscles: ['Quads', 'Glutes'] },
        { name: 'Heavy Bench Press', details: '5 sets of 3-5 reps', duration: 300, muscles: ['Chest', 'Triceps'] },
        { name: 'Power Cleans', details: '5 sets of 3 reps', duration: 300, muscles: ['Full Body', 'Power'] },
        { name: 'Weighted Pull-ups', details: '4 sets of 5-8 reps', duration: 240, muscles: ['Back', 'Biceps'] },
        { name: 'Push Press', details: '4 sets of 5 reps', duration: 240, muscles: ['Shoulders', 'Triceps'] },
    ],
  },
  {
    title: 'Cross-functional Fitness Challenge',
    goal: 'Test all-around fitness with a challenging workout',
    daysPerWeek: 1,
    metric: 'Endurance',
    difficulty: 'Advanced',
    exercises: [
        { name: 'For Time: 1-mile run', details: 'As fast as possible', duration: 480, muscles: ['Cardio'] },
        { name: '100 Pull-ups', details: 'Partition as needed', duration: 600, muscles: ['Back', 'Biceps'] },
        { name: '200 Push-ups', details: 'Partition as needed', duration: 720, muscles: ['Chest', 'Triceps'] },
        { name: '300 Squats', details: 'Partition as needed', duration: 900, muscles: ['Quads', 'Glutes'] },
        { name: 'For Time: 1-mile run', details: 'As fast as possible', duration: 480, muscles: ['Cardio'] },
    ],
  },
  {
    title: 'Advanced Yoga & Inversions',
    goal: 'Master advanced yoga poses and inversions',
    daysPerWeek: 3,
    metric: 'Flexibility',
    difficulty: 'Advanced',
    exercises: [
        { name: 'Handstand Practice', details: '15 minutes against a wall', duration: 900, muscles: ['Shoulders', 'Core'] },
        { name: 'Advanced Vinyasa Flow', details: '45 minutes, complex sequences', duration: 2700, muscles: ['Full Body'] },
        { name: 'Deep Hip Openers', details: '10 minutes, poses like pigeon and lizard', duration: 600, muscles: ['Hips', 'Glutes'] },
        { name: 'Forearm Stand Practice', details: '10 minutes', duration: 600, muscles: ['Shoulders', 'Core', 'Back'] },
    ],
  },
  {
    title: 'Metabolic Conditioning (Metcon)',
    goal: 'Improve work capacity and metabolic rate',
    daysPerWeek: 3,
    metric: 'Cardio',
    difficulty: 'Advanced',
    exercises: [
        { name: 'AMRAP 20 (As Many Rounds As Possible)', details: '20-minute continuous circuit', duration: 1200, muscles: ['Full Body'] },
        { name: '5 Burpees', details: 'Part of the AMRAP circuit', duration: 0, muscles: ['Full Body'] },
        { name: '10 Thrusters (95/65 lb)', details: 'Part of the AMRAP circuit', duration: 0, muscles: ['Legs', 'Shoulders'] },
        { name: '15 Kettlebell Swings (53/35 lb)', details: 'Part of the AMRAP circuit', duration: 0, muscles: ['Glutes', 'Hamstrings'] },
    ],
  },
];

const getIcon = (metric?: string) => {
    switch(metric) {
        case 'Strength': return <Dumbbell className="text-primary" />;
        case 'Cardio': return <HeartPulse className="text-primary" />;
        case 'Endurance': return <Zap className="text-primary" />;
        case 'Flexibility': return <Wind className="text-primary" />;
        case 'Balance': return <ShieldCheck className="text-primary" />;
        default: return <Leaf className="text-primary" />;
    }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700';
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700';
    case 'Advanced':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
  }
};


export default function WorkoutsPage() {
  const [activeWorkout, setActiveWorkout] = React.useState<WorkoutPlan | null>(null);
  const [difficultyFilter, setDifficultyFilter] = React.useState('All');

  const filteredWorkouts = React.useMemo(() => {
    if (difficultyFilter === 'All') {
      return workoutPlans;
    }
    return workoutPlans.filter(plan => plan.difficulty === difficultyFilter);
  }, [difficultyFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Workout Plans</h1>
            <p className="text-muted-foreground mt-1">
              Find a plan that fits your level. Click one to start a session.
            </p>
        </div>
        <Tabs value={difficultyFilter} onValueChange={setDifficultyFilter} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Beginner">Beginner</TabsTrigger>
            <TabsTrigger value="Intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="Advanced">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkouts.map((plan, index) => (
          <Card key={index} className="flex flex-col hover:shadow-md transition-shadow duration-300">
            <CardHeader>
                <div className='flex justify-between items-start gap-2'>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        {getIcon(plan.metric)} {plan.title}
                    </CardTitle>
                    <Badge className={cn(getDifficultyColor(plan.difficulty), 'whitespace-nowrap')}>
                        {plan.difficulty}
                    </Badge>
                </div>
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
                         {ex.muscles.join(', ')}
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
