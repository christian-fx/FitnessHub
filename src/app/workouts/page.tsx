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
import { Dumbbell, Target, Repeat, PlayCircle, Zap, HeartPulse, Wind, ShieldCheck, Leaf } from 'lucide-react';
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
      { name: 'Jumping Jacks', details: 'Warm-up for 60 seconds', duration: 60, muscles: ['Full Body'], instructions: '1. Stand with your feet together and your arms at your sides.\n2. Jump up, spreading your feet beyond your hips while bringing your arms above your head.\n3. Jump again, lowering your arms and bringing your feet back to the starting position.' },
      { name: 'Bodyweight Squats', details: '3 sets of 10-15 reps', duration: 180, muscles: ['Quads', 'Glutes'], instructions: '1. Stand with your feet shoulder-width apart.\n2. Lower your hips back and down as if sitting in a chair, keeping your chest up.\n3. Go as low as you can comfortably, then push through your heels to return to the start.' },
      { name: 'Knee Push-ups', details: '3 sets of 8-12 reps', duration: 180, muscles: ['Chest', 'Triceps'], instructions: '1. Start on all fours, then walk your hands forward until your body is in a straight line from your head to your knees.\n2. Lower your chest towards the floor.\n3. Push back up to the starting position.' },
      { name: 'Plank', details: '3 sets, hold for 30 seconds', duration: 150, muscles: ['Core'], instructions: '1. Place your forearms on the ground with elbows aligned below shoulders.\n2. Keep your body in a straight line from head to heels.\n3. Engage your core and hold the position.' },
      { name: 'Glute Bridges', details: '3 sets of 15 reps', duration: 120, muscles: ['Glutes', 'Hamstrings'], instructions: '1. Lie on your back with your knees bent and feet flat on the floor.\n2. Lift your hips off the floor until your body forms a straight line from your shoulders to your knees.\n3. Squeeze your glutes at the top, then lower back down.' },
    ],
  },
  {
    title: 'Cardio Starter',
    goal: 'Improve cardiovascular health and endurance',
    daysPerWeek: 4,
    metric: 'Cardio',
    difficulty: 'Beginner',
    exercises: [
      { name: 'Brisk Walking', details: '15 min, steady pace', duration: 900, muscles: ['Legs', 'Cardio'], instructions: 'Walk at a pace that elevates your heart rate but still allows you to hold a conversation. Maintain good posture.' },
      { name: 'Jogging in Place', details: '5 min, moderate effort', duration: 300, muscles: ['Legs', 'Cardio'], instructions: 'Lightly jog on the spot, lifting your knees and pumping your arms.' },
      { name: 'Jumping Jacks', details: '4 sets of 45 seconds', duration: 240, muscles: ['Full Body'], instructions: '1. Stand with your feet together and your arms at your sides.\n2. Jump up, spreading your feet beyond your hips while bringing your arms above your head.\n3. Jump again, lowering your arms and bringing your feet back to the starting position.' },
      { name: 'High Knees', details: '4 sets of 30 seconds', duration: 180, muscles: ['Full Body', 'Cardio'], instructions: 'Run in place, bringing your knees up towards your chest as high as possible.' },
    ],
  },
  {
    title: 'Mindful Movement',
    goal: 'Increase flexibility and mind-body connection',
    daysPerWeek: 5,
    metric: 'Flexibility',
    difficulty: 'Beginner',
    exercises: [
      { name: 'Dynamic Stretching', details: '10 minutes of gentle movements', duration: 600, muscles: ['Full Body'], instructions: 'Perform gentle, controlled movements like arm circles, leg swings, and torso twists to warm up your body.' },
      { name: 'Beginner Yoga Flow', details: '20 minutes of basic poses', duration: 1200, muscles: ['Full Body'], instructions: 'Follow a simple yoga routine, moving through poses like Cat-Cow, Downward Dog, and Warrior I. Focus on your breath.' },
      { name: 'Deep Breathing', details: '5 minutes of focused breathing', duration: 300, muscles: ['Mind'], instructions: 'Sit or lie down comfortably. Inhale slowly through your nose for 4 seconds, hold for 4, and exhale slowly through your mouth for 6.' },
      { name: 'Static Stretches (Hold 30s each)', details: '10 minutes', duration: 600, muscles: ['Legs', 'Back', 'Chest'], instructions: 'Gently stretch major muscle groups like hamstrings, quads, chest, and back. Hold each stretch without bouncing.' },
    ],
  },
  {
    title: 'Active Recovery & Mobility',
    goal: 'Promote muscle recovery and reduce soreness',
    daysPerWeek: 2,
    metric: 'Balance',
    difficulty: 'Beginner',
    exercises: [
      { name: 'Light Walk', details: '20 minutes', duration: 1200, muscles: ['Full Body'], instructions: 'Take a gentle walk to increase blood flow to your muscles without causing strain.' },
      { name: 'Full Body Stretching', details: '15 minutes', duration: 900, muscles: ['Full Body'], instructions: 'Perform a series of static stretches, holding each for 30-60 seconds to improve flexibility.' },
      { name: 'Foam Roll', details: '10 minutes, focus on tight areas', duration: 600, muscles: ['Full Body'], instructions: 'Use a foam roller on major muscle groups like your quads, hamstrings, and back to release muscle tightness.' },
    ],
  },
  {
    title: 'Dumbbell Intro',
    goal: 'Learn basic dumbbell movements safely',
    daysPerWeek: 3,
    metric: 'Strength',
    difficulty: 'Beginner',
    exercises: [
      { name: 'Dumbbell Goblet Squats', details: '3 sets of 10 reps', duration: 180, muscles: ['Quads', 'Glutes'], instructions: '1. Hold one dumbbell vertically against your chest with both hands.\n2. Squat down as if sitting in a chair, keeping your chest up.\n3. Push through your heels to return to the start.' },
      { name: 'Dumbbell Rows', details: '3 sets of 12 reps per arm', duration: 240, muscles: ['Back', 'Biceps'], instructions: '1. Place one knee and hand on a bench. Hold a dumbbell in the opposite hand.\n2. Pull the dumbbell up towards your chest, squeezing your back muscles.\n3. Lower the dumbbell with control.' },
      { name: 'Dumbbell Bench Press', details: '3 sets of 10 reps', duration: 180, muscles: ['Chest', 'Triceps'], instructions: '1. Lie on a bench with a dumbbell in each hand at your chest.\n2. Push the dumbbells up until your arms are fully extended.\n3. Lower them back down slowly.' },
      { name: 'Dumbbell Bicep Curls', details: '3 sets of 12 reps', duration: 150, muscles: ['Biceps'], instructions: '1. Stand with a dumbbell in each hand, palms facing forward.\n2. Curl the weights up towards your shoulders, keeping your elbows stationary.\n3. Lower the dumbbells back down with control.' },
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
      { name: 'Barbell Squats', details: '3 sets of 8-12 reps', duration: 180, muscles: ['Quads', 'Glutes'], instructions: '1. With a barbell on your upper back, stand with feet shoulder-width apart.\n2. Squat down by bending your hips and knees until your thighs are parallel to the floor.\n3. Drive back up to the starting position.' },
      { name: 'Bench Press', details: '3 sets of 8-12 reps', duration: 180, muscles: ['Chest', 'Triceps'], instructions: '1. Lie on a bench and grab the barbell with a slightly wider than shoulder-width grip.\n2. Lower the bar to your chest.\n3. Press it back up to the starting position.' },
      { name: 'Deadlifts', details: '3 sets of 5-8 reps', duration: 240, muscles: ['Back', 'Hamstrings'], instructions: '1. Stand with your mid-foot under the barbell.\n2. Hinge at the hips and bend your knees to grip the bar.\n3. Lift the bar by driving your hips forward and straightening your back, keeping the bar close to your body.' },
      { name: 'Overhead Press', details: '3 sets of 8-12 reps', duration: 180, muscles: ['Shoulders'], instructions: '1. Stand with the barbell at your front shoulders.\n2. Press the bar directly overhead until your arms are fully extended.\n3. Lower it back to your shoulders with control.' },
      { name: 'Pull-ups / Lat Pulldowns', details: '3 sets to failure or 10-12 reps', duration: 150, muscles: ['Back', 'Biceps'], instructions: 'Pull your body up to the bar until your chin is over it, or pull the lat pulldown bar to your upper chest.' },
    ],
  },
  {
    title: 'Core Crusher',
    goal: 'Develop strong and stable core muscles',
    daysPerWeek: 4,
    metric: 'Strength',
    difficulty: 'Intermediate',
    exercises: [
      { name: 'Hanging Leg Raises', details: '3 sets of 15 reps', duration: 180, muscles: ['Lower Abs'], instructions: '1. Hang from a pull-up bar.\n2. Raise your legs until they are parallel to the floor, keeping them straight.\n3. Lower them back down with control.' },
      { name: 'Cable Crunches', details: '3 sets of 15-20 reps', duration: 180, muscles: ['Abs'], instructions: '1. Kneel in front of a high-pulley cable machine with a rope attachment.\n2. Crunch your torso downwards, bringing your elbows towards your knees.\n3. Return slowly to the starting position.' },
      { name: 'Russian Twists (with weight)', details: '3 sets of 15 reps (each side)', duration: 120, muscles: ['Obliques'], instructions: '1. Sit on the floor, lean back, and lift your feet.\n2. Hold a weight with both hands.\n3. Twist your torso from side to side, touching the weight to the floor on each side.' },
      { name: 'Plank', details: '3 sets, hold for 90s', duration: 270, muscles: ['Core'], instructions: '1. Place your forearms on the ground with elbows aligned below shoulders.\n2. Keep your body in a straight line from head to heels.\n3. Engage your core and hold the position. Do not let your hips sag.' },
      { name: 'Ab Rollouts', details: '3 sets of 10-12 reps', duration: 180, muscles: ['Core', 'Abs'], instructions: '1. Kneel on the floor holding an ab roller.\n2. Slowly roll the wheel forward, extending your body as far as you can without arching your back.\n3. Use your core to pull yourself back to the starting position.' },
    ],
  },
  {
    title: 'Endurance Builder',
    goal: 'Push your cardio limits and increase stamina',
    daysPerWeek: 4,
    metric: 'Endurance',
    difficulty: 'Intermediate',
    exercises: [
        { name: 'Interval Run', details: '5 min warm up, then 8x 400m sprint, 90s rest', duration: 2400, muscles: ['Legs', 'Cardio'], instructions: 'After a warm-up, run 400 meters at a fast pace, then rest for 90 seconds. Repeat 8 times.' },
        { name: 'Kettlebell Swings', details: '5 sets of 20 reps', duration: 300, muscles: ['Glutes', 'Hamstrings', 'Back'], instructions: '1. Hinge at your hips, swinging the kettlebell between your legs.\n2. Explosively drive your hips forward to swing the kettlebell up to chest height.\n3. Let the kettlebell swing back down naturally.' },
        { name: 'Rowing Machine', details: '2000m for time', duration: 600, muscles: ['Full Body', 'Cardio'], instructions: 'Row 2000 meters as quickly as possible while maintaining good form: legs, core, then arms on the drive; arms, core, then legs on the recovery.' },
        { name: 'Box Jumps', details: '4 sets of 12 reps', duration: 240, muscles: ['Legs', 'Glutes'], instructions: '1. Stand in front of a plyo box.\n2. Jump explosively onto the box, landing softly with your knees bent.\n3. Step back down.' },
    ],
  },
  {
    title: 'Aesthetic Physique (Upper Body Focus)',
    goal: 'Build a well-defined upper body',
    daysPerWeek: 2,
    metric: 'Strength',
    difficulty: 'Intermediate',
    exercises: [
        { name: 'Incline Dumbbell Press', details: '4 sets of 10-12 reps', duration: 240, muscles: ['Upper Chest'], instructions: '1. Set a bench to a 30-45 degree incline.\n2. Press dumbbells up from your chest until your arms are fully extended.\n3. Lower them slowly.' },
        { name: 'Seated Cable Rows', details: '4 sets of 10-12 reps', duration: 240, muscles: ['Back'], instructions: '1. Sit at a cable row machine and pull the handle towards your lower abdomen.\n2. Squeeze your back muscles together.\n3. Extend your arms with control.' },
        { name: 'Lateral Raises', details: '4 sets of 15-20 reps', duration: 200, muscles: ['Shoulders'], instructions: '1. Stand with light dumbbells at your sides.\n2. Raise the dumbbells out to your sides until they are at shoulder height.\n3. Lower them with control.' },
        { name: 'Tricep Pushdowns', details: '3 sets of 12-15 reps', duration: 150, muscles: ['Triceps'], instructions: '1. At a cable machine, push the bar down until your arms are fully extended.\n2. Keep your elbows tucked in at your sides.\n3. Return to the starting position slowly.' },
        { name: 'Face Pulls', details: '3 sets of 15-20 reps', duration: 150, muscles: ['Rear Delts', 'Back'], instructions: '1. Using a rope on a cable machine, pull the handles towards your face.\n2. Squeeze your shoulder blades together.\n3. Return to the starting position with control.' },
    ],
  },
  {
    title: 'Aesthetic Physique (Lower Body Focus)',
    goal: 'Develop strong and sculpted legs',
    daysPerWeek: 2,
    metric: 'Strength',
    difficulty: 'Intermediate',
    exercises: [
        { name: 'Leg Press', details: '4 sets of 10-15 reps', duration: 240, muscles: ['Quads', 'Glutes'], instructions: '1. Sit in a leg press machine and place your feet shoulder-width apart on the platform.\n2. Push the platform away until your legs are nearly extended (but not locked).\n3. Lower the weight with control.' },
        { name: 'Romanian Deadlifts', details: '4 sets of 10-12 reps', duration: 240, muscles: ['Hamstrings', 'Glutes'], instructions: '1. Hold a barbell or dumbbells and hinge at your hips, keeping your legs mostly straight.\n2. Lower the weight as far as you can without rounding your back.\n3. Drive your hips forward to return to the start.' },
        { name: 'Bulgarian Split Squats', details: '3 sets of 12 reps per leg', duration: 300, muscles: ['Quads', 'Glutes'], instructions: '1. Place your back foot on a bench and step your front foot forward.\n2. Lower your body until your front thigh is parallel to the floor.\n3. Push up through your front foot.' },
        { name: 'Leg Curls', details: '3 sets of 15-20 reps', duration: 150, muscles: ['Hamstrings'], instructions: 'At a leg curl machine, curl the pad towards your glutes, squeezing your hamstrings at the top.' },
        { name: 'Calf Raises', details: '4 sets of 20 reps', duration: 180, muscles: ['Calves'], instructions: '1. Stand with the balls of your feet on an elevated surface.\n2. Lower your heels, then press up as high as you can onto your toes.' },
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
      { name: 'Burpee Box Jumps', details: '45s on, 15s rest', duration: 60, muscles: ['Full Body', 'Cardio'], instructions: 'Perform a burpee, then immediately jump onto a plyo box. Step down and repeat.' },
      { name: 'Kettlebell Snatches', details: '45s on, 15s rest', duration: 60, muscles: ['Full Body'], instructions: 'Explosively pull a kettlebell from the floor to an overhead position in one fluid motion.' },
      { name: 'Assault Bike Sprint', details: '45s on, 15s rest', duration: 60, muscles: ['Full Body', 'Cardio'], instructions: 'Sprint on an assault bike with maximum effort for the entire duration.' },
      { name: 'Toes-to-Bar', details: '45s on, 15s rest', duration: 60, muscles: ['Core', 'Abs'], instructions: 'Hanging from a bar, use your core to bring your toes up to touch the bar.' },
      { name: 'Rest', details: '3 minutes', duration: 180, muscles: [], instructions: 'Active recovery. Walk around, drink some water.' },
      { name: 'Repeat Circuit', details: '4 more times', duration: 0, muscles: [], instructions: 'Repeat the entire circuit of the 4 exercises for the specified number of rounds.' },
    ],
  },
  {
    title: 'Advanced Strength & Power',
    goal: 'Maximize strength and explosive power',
    daysPerWeek: 4,
    metric: 'Strength',
    difficulty: 'Advanced',
    exercises: [
        { name: 'Heavy Squats', details: '5 sets of 3-5 reps', duration: 300, muscles: ['Quads', 'Glutes'], instructions: 'Focus on moving heavy weight with perfect form. Take adequate rest between sets (2-3 minutes).' },
        { name: 'Heavy Bench Press', details: '5 sets of 3-5 reps', duration: 300, muscles: ['Chest', 'Triceps'], instructions: 'Focus on moving heavy weight with perfect form. Use a spotter if necessary. Take adequate rest.' },
        { name: 'Power Cleans', details: '5 sets of 3 reps', duration: 300, muscles: ['Full Body', 'Power'], instructions: 'Explosively lift a barbell from the floor to your shoulders, catching it in a front squat position.' },
        { name: 'Weighted Pull-ups', details: '4 sets of 5-8 reps', duration: 240, muscles: ['Back', 'Biceps'], instructions: 'Add weight using a dip belt or by holding a dumbbell between your feet. Pull up until your chin is over the bar.' },
        { name: 'Push Press', details: '4 sets of 5 reps', duration: 240, muscles: ['Shoulders', 'Triceps'], instructions: 'Use a slight dip in your legs to help drive the barbell explosively overhead.' },
    ],
  },
  {
    title: 'Cross-functional Fitness Challenge',
    goal: 'Test all-around fitness with a challenging workout',
    daysPerWeek: 1,
    metric: 'Endurance',
    difficulty: 'Advanced',
    exercises: [
        { name: 'For Time: 1-mile run', details: 'As fast as possible', duration: 480, muscles: ['Cardio'], instructions: 'Complete the run as quickly as you can to start the workout.' },
        { name: '100 Pull-ups', details: 'Partition as needed', duration: 600, muscles: ['Back', 'Biceps'], instructions: 'Complete 100 pull-ups. Break them into smaller sets (e.g., 10 sets of 10) as needed.' },
        { name: '200 Push-ups', details: 'Partition as needed', duration: 720, muscles: ['Chest', 'Triceps'], instructions: 'Complete 200 push-ups. Break them into smaller, manageable sets.' },
        { name: '300 Squats', details: 'Partition as needed', duration: 900, muscles: ['Quads', 'Glutes'], instructions: 'Complete 300 bodyweight squats. Focus on maintaining form even when fatigued.' },
        { name: 'For Time: 1-mile run', details: 'As fast as possible', duration: 480, muscles: ['Cardio'], instructions: 'Finish the workout by completing another 1-mile run as quickly as you can.' },
    ],
  },
  {
    title: 'Advanced Yoga & Inversions',
    goal: 'Master advanced yoga poses and inversions',
    daysPerWeek: 3,
    metric: 'Flexibility',
    difficulty: 'Advanced',
    exercises: [
        { name: 'Handstand Practice', details: '15 minutes against a wall', duration: 900, muscles: ['Shoulders', 'Core'], instructions: 'Practice kicking up into a handstand against a wall. Work on holding the position and building shoulder stability.' },
        { name: 'Advanced Vinyasa Flow', details: '45 minutes, complex sequences', duration: 2700, muscles: ['Full Body'], instructions: 'Move through a fast-paced, challenging yoga flow that includes arm balances, deep backbends, and complex transitions.' },
        { name: 'Deep Hip Openers', details: '10 minutes, poses like pigeon and lizard', duration: 600, muscles: ['Hips', 'Glutes'], instructions: 'Hold deep hip-opening poses to increase flexibility and release tension in the hips.' },
        { name: 'Forearm Stand Practice', details: '10 minutes', duration: 600, muscles: ['Shoulders', 'Core', 'Back'], instructions: 'Practice Pincha Mayurasana, either against a wall or in the center of the room. Focus on core engagement and balance.' },
    ],
  },
  {
    title: 'Metabolic Conditioning (Metcon)',
    goal: 'Improve work capacity and metabolic rate',
    daysPerWeek: 3,
    metric: 'Cardio',
    difficulty: 'Advanced',
    exercises: [
        { name: 'AMRAP 20 (As Many Rounds As Possible)', details: '20-minute continuous circuit', duration: 1200, muscles: ['Full Body'], instructions: 'Set a timer for 20 minutes and complete as many rounds as possible of the following exercises without resting.' },
        { name: '5 Burpees', details: 'Part of the AMRAP circuit', duration: 0, muscles: ['Full Body'], instructions: 'Drop to the floor, perform a push-up, jump your feet back in, and jump explosively into the air.' },
        { name: '10 Thrusters (95/65 lb)', details: 'Part of the AMRAP circuit', duration: 0, muscles: ['Legs', 'Shoulders'], instructions: 'Hold a barbell in a front rack position, perform a front squat, and as you stand up, press the bar overhead.' },
        { name: '15 Kettlebell Swings (53/35 lb)', details: 'Part of the AMRAP circuit', duration: 0, muscles: ['Glutes', 'Hamstrings'], instructions: 'Perform a Russian kettlebell swing, driving with your hips to bring the kettlebell to chest height.' },
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
