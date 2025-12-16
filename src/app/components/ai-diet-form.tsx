'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAIDietPlan } from '@/app/ai/actions';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UtensilsCrossed, ArrowRight, Copy, Sparkles, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import Link from 'next/link';

const formSchema = z.object({
  healthGoals: z.string().min(10, 'Please describe your goals in more detail (at least 10 characters).'),
  dietaryPreference: z.enum(['omnivore', 'vegetarian', 'vegan', 'keto', 'paleo']),
  dailyMeals: z.enum(['3', '4', '5']),
  allergies: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;
const TRIAL_STORAGE_KEY = 'fitness-hub-ai-diet-trials';

export function AIDietForm() {
  const [isPending, startTransition] = useTransition();
  const [dietPlan, setDietPlan] = useState<string | null>(null);
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
      healthGoals: '',
      dietaryPreference: 'omnivore',
      dailyMeals: '3',
      allergies: '',
    },
  });

  const onSubmit = (values: FormData) => {
    if (!user && trialsLeft <= 0) {
        toast({
            variant: "destructive",
            title: "Free Trials Exhausted",
            description: "Please sign up or log in to continue using the AI Diet Planner.",
        });
        return;
    }

    startTransition(async () => {
      setDietPlan(null); // Clear current plan to show loader
      const result = await getAIDietPlan(values);
      if (result.success && result.data?.dietPlan) {
        setDietPlan(result.data.dietPlan);
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
    setDietPlan(null);
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
                        Create an account to get unlimited access to the AI Diet Planner, save your plans, and more.
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
                name="healthGoals"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                    <FormLabel>Health Goals</FormLabel>
                    <FormControl>
                        <Textarea placeholder="e.g., Lose weight, build lean muscle, have more energy" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="dietaryPreference"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Dietary Preference</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a dietary preference" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="omnivore">Omnivore (No restrictions)</SelectItem>
                            <SelectItem value="vegetarian">Vegetarian</SelectItem>
                            <SelectItem value="vegan">Vegan</SelectItem>
                            <SelectItem value="keto">Keto</SelectItem>
                            <SelectItem value="paleo">Paleo</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="dailyMeals"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Meals Per Day</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select number of meals" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="3">3 Meals</SelectItem>
                            <SelectItem value="4">3 Meals + 1 Snack</SelectItem>
                            <SelectItem value="5">3 Meals + 2 Snacks</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                    <FormLabel>Allergies or Foods to Exclude</FormLabel>
                    <FormControl>
                        <Input placeholder="Optional: e.g., Peanuts, shellfish, dairy" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className='flex items-center gap-4'>
                {dietPlan ? (
                    <Button type="button" onClick={handleNewPlan} size="lg" variant="outline">
                        <Sparkles className="mr-2 h-4 w-4" />
                        New Plan
                    </Button>
                ) : (
                    <Button type="submit" disabled={isPending} size="lg">
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UtensilsCrossed className="mr-2 h-4 w-4" />}
                        Generate Diet Plan
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
                    <p className="text-muted-foreground font-semibold">Our AI is preparing your personalized diet plan...</p>
                </div>
            </CardContent>
        </Card>
      )}

      {dietPlan && (
        <Card className="animate-in fade-in-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
                <CardTitle className="font-semibold flex items-center gap-2">
                    <UtensilsCrossed />
                    Your Personalized Diet Plan
                </CardTitle>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleCopy(dietPlan)} title="Copy">
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/50 rounded-lg">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>
                        {dietPlan}
                    </ReactMarkdown>
                </div>
            </div>
            {!user && (
                <div className="mt-6 p-6 bg-accent/20 border border-accent/50 rounded-lg text-center">
                    <h3 className="text-xl font-bold text-accent-foreground">Like what you see?</h3>
                    <p className="mt-2 text-muted-foreground">Sign up to save your plans, access your full workout dashboard, and more!</p>
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
