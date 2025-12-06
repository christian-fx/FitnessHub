
'use client';

import { useState, useTransition } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2, ArrowRight, Copy, RefreshCw, Sparkles, History, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  fitnessGoals: z.string().min(10, 'Please describe your goals in more detail (at least 10 characters).'),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  availableEquipment: z.string().min(3, 'Please list equipment or "bodyweight" (at least 3 characters).'),
  existingHealthRecommendations: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function AIWorkoutForm() {
  const [isPending, startTransition] = useTransition();
  const [workoutPlan, setWorkoutPlan] = useState<string | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useUser();

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
    startTransition(async () => {
      setWorkoutPlan(null); // Clear current plan to show loader
      const result = await getAIWorkout(values);
      if (result.success && result.data?.workoutPlan) {
        setWorkoutPlan(result.data.workoutPlan);
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
    if (workoutPlan) {
      setWorkoutHistory(prev => [workoutPlan, ...prev]);
    }
    setWorkoutPlan(null);
    form.reset();
  }

  const handleRegenerate = () => {
    if (!workoutPlan) return;
    
    setWorkoutHistory(prev => [workoutPlan, ...prev]);

    // Re-run the submission logic with the current form values
    form.handleSubmit(onSubmit)();
  }

  return (
    <div className="space-y-8">
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
        </form>
      </Form>

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
                <Button variant="outline" size="icon" onClick={handleRegenerate} disabled={isPending} title="Regenerate">
                    <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleCopy(workoutPlan)} title="Copy">
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div key={workoutPlan} className="p-4 bg-muted/50 rounded-lg">
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

    {workoutHistory.length > 0 && (
        <Collapsible>
            <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                    <History className="mr-2 h-4 w-4" />
                    View History ({workoutHistory.length})
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4 animate-in fade-in-50">
                {workoutHistory.map((pastPlan, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardDescription>Previous Plan {workoutHistory.length - index}</CardDescription>
                                <Button variant="ghost" size="icon" onClick={() => handleCopy(pastPlan)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown>{pastPlan}</ReactMarkdown>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </CollapsibleContent>
        </Collapsible>
    )}

    </div>
  );
}

    