'use client';

import { useState, useTransition } from 'react';
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
import { Loader2, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { doc, collection, serverTimestamp, writeBatch, increment } from 'firebase/firestore';

const formSchema = z.object({
  workoutType: z.string().min(1, 'Please select a workout type.'),
  duration: z.coerce
    .number()
    .min(1, 'Duration must be at least 1 minute.')
    .positive(),
  caloriesBurned: z.coerce.number().min(0).optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function LogWorkoutPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workoutType: '',
      duration: 60,
      caloriesBurned: 300,
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const onSubmit = (values: FormData) => {
    if (!user) {
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

        const workoutPayload = {
          ...values,
          date: new Date(values.date),
          createdAt: serverTimestamp(),
        };

        const batch = writeBatch(firestore);

        batch.set(newWorkoutRef, workoutPayload);
        batch.update(userRef, { totalWorkouts: increment(1) });
        
        await batch.commit();
        
        toast({
          title: 'Workout Logged!',
          description: 'Your workout has been successfully saved.',
        });
        form.reset({
          ...form.getValues(),
          date: new Date().toISOString().split('T')[0],
        });

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
                        defaultValue={field.value}
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
                      <FormLabel>Calories Burned (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 300"
                          {...field}
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
                    <FormItem>
                      <FormLabel>Date of Workout</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
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
