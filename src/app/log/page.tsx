'use client';

import { useState, useTransition, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Dumbbell, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { doc, collection, serverTimestamp, writeBatch, increment, getDoc, Timestamp } from 'firebase/firestore';
import type { UserProfile } from '@/firebase/auth/use-user';
import { format, subDays, differenceInCalendarDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  workoutType: z.string().min(1, 'Please select a workout type.'),
  duration: z.coerce
    .number()
    .min(1, 'Duration must be at least 1 minute.')
    .positive(),
  caloriesBurned: z.coerce.number().min(0).optional(),
  volumeLifted: z.coerce.number().min(0).optional(),
  date: z.date({
    required_error: "A date is required.",
  }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;


export default function LogWorkoutPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { user, profile } = useUser();
  const firestore = useFirestore();

  const defaultValues: FormData = useMemo(() => ({
    workoutType: 'Strength Training',
    duration: 60,
    caloriesBurned: 300,
    volumeLifted: 1000,
    date: new Date(),
    notes: '',
  }), []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (values: FormData) => {
    if (!user || !profile) {
        toast({
            variant: "destructive",
            title: "Not Authenticated",
            description: "You must be logged in to log a workout.",
        });
        return;
    }
    startTransition(async () => {
      try {
        const userRef = doc(firestore, 'users', user.uid);
        const workoutsCollectionRef = collection(userRef, 'workouts');
        const newWorkoutRef = doc(workoutsCollectionRef);

        const workoutDate = values.date;
        const workoutDateStr = format(workoutDate, 'yyyy-MM-dd');

        const workoutPayload = {
          ...values,
          date: Timestamp.fromDate(workoutDate),
          createdAt: serverTimestamp(),
        };

        const batch = writeBatch(firestore);

        batch.set(newWorkoutRef, workoutPayload);
        
        const updates: Partial<UserProfile> = {};
        
        updates.totalWorkouts = increment(1);
        
        if (values.caloriesBurned) {
          updates.caloriesBurned = increment(values.caloriesBurned);
        }
        if (values.volumeLifted) {
          updates.volumeLifted = increment(values.volumeLifted);
        }

        // --- Streak Logic ---
        const lastWorkoutDate = profile.lastWorkoutDate ? new Date(profile.lastWorkoutDate) : null;
        let newStreak = profile.activeStreak || 0;

        if (lastWorkoutDate) {
            const daysDifference = differenceInCalendarDays(workoutDate, lastWorkoutDate);
            if (daysDifference === 1) {
                newStreak += 1; // Consecutive day, increment streak
            } else if (daysDifference > 1) {
                newStreak = 1; // Missed a day, reset streak to 1
            }
            // if daysDifference is 0 or negative, do nothing (workout on same day or past)
        } else {
            newStreak = 1; // First workout
        }
        
        updates.activeStreak = newStreak;
        updates.lastWorkoutDate = workoutDateStr;


        const monthKey = format(workoutDate, 'MMM');
        const newWorkoutHistory = [...(profile.workoutHistory || [])];
        const monthIndex = newWorkoutHistory.findIndex(h => h.month === monthKey);
        
        if (monthIndex > -1) {
            newWorkoutHistory[monthIndex].workouts = (newWorkoutHistory[monthIndex].workouts || 0) + 1;
        }
        updates.workoutHistory = newWorkoutHistory;

        const newProgressOverview = [...(profile.progressOverview || [])];
        let metricToUpdate: string | null = null;
        switch(values.workoutType) {
            case 'Strength Training': metricToUpdate = 'Strength'; break;
            case 'Cardio': metricToUpdate = 'Cardio'; break;
            case 'Yoga': metricToUpdate = 'Flexibility'; break;
            case 'HIIT': metricToUpdate = 'Endurance'; break;
            case 'Stretching': metricToUpdate = 'Flexibility'; break;
            case 'Other': metricToUpdate = 'Balance'; break;
        }

        if(metricToUpdate) {
            const metricIndex = newProgressOverview.findIndex(p => p.metric === metricToUpdate);
            if (metricIndex > -1) {
                newProgressOverview[metricIndex].value = (newProgressOverview[metricIndex].value || 0) + 2; 
            }
            updates.progressOverview = newProgressOverview;
        }
        
        batch.update(userRef, updates as { [key: string]: any });
        
        await batch.commit();
        
        toast({
          title: 'Workout Logged!',
          description: 'Your dashboard has been updated with your new workout.',
        });
        form.reset(defaultValues);

      } catch (error: any) {
        console.error("Error logging workout:", error);
        toast({
          variant: 'destructive',
          title: 'Error Logging Workout',
          description:
            error.message || 'An unexpected error occurred. Please try again.',
        });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Dumbbell className="text-primary"/>
            Log a New Workout
          </CardTitle>
          <CardDescription>
            Fill in the details of your workout session to keep track of your
            progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="workoutType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a workout type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Strength Training">
                            Strength Training
                          </SelectItem>
                          <SelectItem value="Cardio">Cardio</SelectItem>
                          <SelectItem value="Yoga">Yoga</SelectItem>
                          <SelectItem value="HIIT">HIIT</SelectItem>
                          <SelectItem value="Stretching">Stretching</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 60" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="caloriesBurned"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calories Burned</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 300"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="volumeLifted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volume Lifted (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="For strength training"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Workout</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workout Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any notes about your workout? e.g., 'Felt strong today, increased weight on squats.'"
                        {...field}
                        rows={4}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} size="lg">
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Log Workout
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
