
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
import { AIWorkoutForm } from '../components/ai-workout-form';
import { Wand2, UtensilsCrossed, Dumbbell } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIDietForm } from '../components/ai-diet-form';
  
  export default function AIPlannerPage() {
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Wand2 className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="font-semibold text-3xl">AI Fitness Planner</CardTitle>
                        <CardDescription className="mt-1">
                            Get personalized workout and diet plans from our AI assistant.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="workout" className="w-full">
                    <TabsList className='grid w-full grid-cols-2'>
                        <TabsTrigger value="workout">
                            <Dumbbell className='mr-2' />
                            Workout Plan
                        </TabsTrigger>
                        <TabsTrigger value="diet">
                            <UtensilsCrossed className='mr-2' />
                            Diet Plan
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="workout" className='pt-6'>
                        <AIWorkoutForm />
                    </TabsContent>
                    <TabsContent value="diet" className='pt-6'>
                        <AIDietForm />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
  }
  
