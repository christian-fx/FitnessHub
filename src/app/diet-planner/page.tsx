
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
import { AIDietForm } from '../components/ai-diet-form';
import { UtensilsCrossed } from 'lucide-react';
  
  export default function AIDietPage() {
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <UtensilsCrossed className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="font-semibold text-3xl">AI Diet Planner</CardTitle>
                        <CardDescription className="mt-1">
                            Fill out the form below to get a personalized diet plan from our AI nutritionist.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <AIDietForm />
            </CardContent>
        </Card>
    );
  }
  
