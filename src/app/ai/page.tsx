
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
import { AIWorkoutForm } from '../components/ai-workout-form';
import { Wand2 } from 'lucide-react';
  
  export default function AIWorkoutPage() {
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Wand2 className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="font-semibold text-3xl">AI Workout Planner</CardTitle>
                        <CardDescription className="mt-1">
                            Fill out the form below to get a personalized workout plan from our AI trainer.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <AIWorkoutForm />
            </CardContent>
        </Card>
    );
  }
  
