
'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAIWorkout } from '@/app/ai/actions';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, ArrowRight, Copy, Sparkles, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import Link from 'next/link';

const formSchema = z.object({
  fitnessGoals: z.string().min(10, 'Please describe your goals in more detail (at least 10 characters).'),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  availableEquipment: z.string().min(3, 'Please list equipment or "bodyweight" (at least 3 characters).'),
  existingHealthRecommendations: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;
const TRIAL_STORAGE_KEY = 'fitness-hub-ai-trials';

export function AIWorkoutForm() {
  const [isPending, startTransition] = useTransition();
  const [workoutPlan, setWorkoutPlan] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const [trialsLeft, setTrialsLeft] = useState(2);

  useEffect(() => {
    if (!user) {
      const storedTrials = localStorage.getItem(TRIAL_STORAGE_KEY);
      if (storedTrials !== null) {
        setTrialsLeft(Number(storedTrials));
      } else {
        localStorage.setItem(TRIAL_STORAGE_KEY, '2');
      }
    }
  }, [user]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fitnessGoals: '',
      fitnessLevel: 'beginner',
      availableEquipment: '',
      existingHealthRecommendations: '',
    },
  });

  const onSubmit = (values: FormData) => {
    if (!user && trialsLeft <= 0) {
        toast({
            variant: "destructive",
            title: "Free Trials Exhausted",
            description: "Please sign up or log in to continue using the AI Planner.",
        });
        return;
    }

    startTransition(async () => {
      setWorkoutPlan(null); // Clear current plan to show loader
      const result = await getAIWorkout(values);
      if (result.success && result.data?.workoutPlan) {
        setWorkoutPlan(result.data.workoutPlan);
        if (!user) {
          const newTrials = trialsLeft - 1;
          setTrialsLeft(newTrials);
          localStorage.setItem(TRIAL_STORAGE_KEY, String(newTrials));
        }
      } else {
        toast({
            variant: "destructive",
            title: "Error Generating Plan",
            description: result.error || 'An unexpected error occurred.',
        });
      }
    });
  };

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
        title: "Copied to Clipboard",
    });
  }

  const handleNewPlan = () => {
    setWorkoutPlan(null);
    form.reset();
  }

  const trialsExhausted = !user && trialsLeft <= 0;

  return (
    <div className="space-y-8">
      {trialsExhausted ? (
        <Card className="text-center">
            <CardHeader>
                <div className='w-full flex justify-center'>
                    <UserPlus className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="font-semibold text-2xl">You've Used Your Free Trials</CardTitle>
                <CardContent>
                    <p className="text-muted-foreground mt-2 mb-6">
                        Create an account to get unlimited access to the AI Workout Planner, save your progress, and join challenges.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button asChild>
                            <Link href="/signup">
                                Sign Up Now <ArrowRight className="ml-2" />
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/login">
                                Log In
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </CardHeader>
        </Card>
      ) : (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="fitnessGoals"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Fitness Goals</FormLabel>
                    <FormControl>
                        <Textarea placeholder="e.g., Lose 10 pounds, run a 5k, build upper body strength" {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="availableEquipment"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Available Equipment</FormLabel>
                    <FormControl>
                        <Textarea placeholder="e.g., Dumbbells, resistance bands, treadmill, or just bodyweight" {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="fitnessLevel"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Fitness Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your fitness level" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="existingHealthRecommendations"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Health Recommendations</FormLabel>
                    <FormControl>
                        <Input placeholder="Optional: e.g., Avoid high-impact exercises" {...field} />
                    </FormControl>
                    <FormDescription>
                        Any specific advice from a health professional.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className='flex items-center gap-4'>
                {workoutPlan ? (
                    <Button type="button" onClick={handleNewPlan} size="lg" variant="outline">
                        <Sparkles className="mr-2 h-4 w-4" />
                        New Plan
                    </Button>
                ) : (
                    <Button type="submit" disabled={isPending} size="lg">
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Generate Plan
                    </Button>
                )}
                {!user && (
                    <p className="text-sm text-muted-foreground">
                        {trialsLeft} free trial{trialsLeft !== 1 ? 's' : ''} remaining.
                    </p>
                )}
            </div>
            </form>
        </Form>
      )}

      {isPending && (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-muted/50 rounded-lg">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground font-semibold">Our AI is crafting your personalized workout plan...</p>
                </div>
            </CardContent>
        </Card>
      )}

      {workoutPlan && (
        <Card className="animate-in fade-in-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
                <CardTitle className="font-semibold flex items-center gap-2">
                    <Wand2 />
                    Your Personalized Workout Plan
                </CardTitle>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleCopy(workoutPlan)} title="Copy">
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/50 rounded-lg">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>
                        {workoutPlan}
                    </ReactMarkdown>
                </div>
            </div>
            {!user && (
                <div className="mt-6 p-6 bg-accent/20 border border-accent/50 rounded-lg text-center">
                    <h3 className="text-xl font-bold text-accent-foreground">Like what you see?</h3>
                    <p className="mt-2 text-muted-foreground">Sign up to save your progress, access full workout plans, and join challenges!</p>
                    <div className="mt-4 flex justify-center gap-4">
                        <Button asChild>
                            <Link href="/signup">
                                Sign Up Now <ArrowRight className="ml-2" />
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/login">
                                Log In
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
