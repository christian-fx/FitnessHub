import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

const faqItems = [
  {
    question: "How does the AI Workout Planner work?",
    answer: "Our AI Workout Planner uses the information you provide—such as your fitness goals, level, and available equipment—to generate a personalized workout plan. It leverages a large language model trained in fitness to create a routine that's tailored to your needs.",
  },
  {
    question: "Is the AI-generated advice a substitute for a real personal trainer?",
    answer: "While our AI provides high-quality recommendations, it is not a substitute for professional medical or fitness advice. Always consult with a qualified healthcare professional before starting any new fitness program. The AI is a tool to help you get started and find new ideas.",
  },
  {
    question: "How do I log a workout?",
    answer: "Navigate to the 'Log Workout' page from the sidebar. Fill in the details of your session, such as workout type, duration, and date. Calories burned will be estimated automatically based on your profile weight. Click 'Log Workout' to save it to your dashboard.",
  },
  {
    question: "How is my 'Active Streak' calculated?",
    answer: "Your active streak increases by one for each consecutive day you log a workout. If you miss a day, the streak resets to zero. You can use a 'Streak Freeze' once a week from your profile page to protect your streak on a rest day.",
  },
  {
    question: "What are 'Challenges'?",
    answer: "Challenges are community-wide events designed to keep you motivated. You can join a challenge to compete with other users and work towards a common goal, like running a certain distance or completing a number of push-ups in a month.",
  },
   {
    question: "How can I reset my password?",
    answer: "On the login page, click the 'Forgot password?' link. You will be prompted to enter your email address, and a password reset link will be sent to your inbox.",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto">
       <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-3xl">Help & FAQ</CardTitle>
              <CardDescription>
                Find answers to common questions about Fitness Hub.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
