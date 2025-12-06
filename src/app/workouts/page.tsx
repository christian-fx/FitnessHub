import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dumbbell, Target, Repeat } from "lucide-react";

const workoutPlans = [
  {
    title: "Full Body Strength",
    goal: "Build overall muscle and strength",
    daysPerWeek: 3,
    exercises: [
      { name: "Squats", details: "3 sets of 8-12 reps" },
      { name: "Bench Press", details: "3 sets of 8-12 reps" },
      { name: "Deadlifts", details: "3 sets of 5-8 reps" },
      { name: "Overhead Press", details: "3 sets of 8-12 reps" },
      { name: "Pull-ups", details: "3 sets to failure" },
    ],
  },
  {
    title: "Cardio Burn",
    goal: "Improve cardiovascular health and endurance",
    daysPerWeek: 4,
    exercises: [
      { name: "Treadmill Run", details: "30 min, Moderate intensity" },
      { name: "Cycling", details: "20 min, High intensity" },
      { name: "Jumping Jacks", details: "4 sets of 60 seconds" },
      { name: "Burpees", details: "4 sets of 15 reps" },
    ],
  },
  {
    title: "Flexibility & Mobility",
    goal: "Increase range of motion and reduce injury risk",
    daysPerWeek: 5,
    exercises: [
      { name: "Dynamic Stretching", details: "10 minutes" },
      { name: "Yoga Flow", details: "30 minutes" },
      { name: "Foam Rolling", details: "15 minutes" },
      { name: "Deep Stretches (Hamstrings, Hips)", details: "10 minutes" },
    ],
  },
];

export default function WorkoutsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">
          Here are your custom and suggested workout plans.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {workoutPlans.map((plan, index) => (
          <AccordionItem value={`item-${index}`} key={index} className="border-none">
             <Card>
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="flex flex-col text-left items-start">
                    <CardTitle className="flex items-center gap-2 font-headline">
                      <Dumbbell className="text-primary" /> {plan.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 pt-2">
                      <span className="flex items-center gap-1.5"><Target className="size-4" /> {plan.goal}</span>
                      <span className="flex items-center gap-1.5"><Repeat className="size-4" /> {plan.daysPerWeek} days/week</span>
                    </CardDescription>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent>
                    <ul className="space-y-2 pt-4 border-t">
                      {plan.exercises.map((ex, exIndex) => (
                        <li key={exIndex} className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                          <span className="font-medium">{ex.name}</span>
                          <span className="text-sm text-muted-foreground">
                           {ex.details}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </AccordionContent>
             </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
