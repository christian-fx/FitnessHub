'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, Dumbbell, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logWorkout } from './actions';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  workoutType: z.string().min(1, 'Please select a workout type.'),
  duration: z.coerce
    .number()
    .min(1, 'Duration must be at least 1 minute.')
    .positive(),
  caloriesBurned: z.coerce.number().min(0).optional(),
  date: z.date(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function LogWorkoutPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { user } = useUser();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workoutType: '',
      duration: 60,
      caloriesBurned: 300,
      date: new Date(),
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
      const result = await logWorkout(user.uid, values);
      if (result.success) {
        toast({
          title: 'Workout Logged!',
          description: 'Your workout has been successfully saved.',
        });
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            result.error || 'An unexpected error occurred while logging workout.',
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
