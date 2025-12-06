import { AIWorkoutForm } from "./components/ai-workout-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Wand2 } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-0">
      <div className="grid grid-cols-1 gap-8">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Wand2 className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="font-headline text-3xl">AI Workout Recommendations</CardTitle>
                <CardDescription className="mt-1">
                  Get a personalized workout plan from our AI trainer. Just fill out the form below.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AIWorkoutForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
