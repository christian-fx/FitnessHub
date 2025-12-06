import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from '@/lib/placeholder-images';

const challenges = [
  {
    id: 1,
    title: "30-Day Running Challenge",
    description: "Run at least 1 mile every day for 30 days straight. Push your limits and build a strong running habit.",
    participants: 125,
    daysLeft: 22,
    category: "Cardio",
    imageId: 'challengeRunning'
  },
  {
    id: 2,
    title: "10,000 Push-ups in a Month",
    description: "A test of pure upper body strength and endurance. Can you complete 10,000 push-ups before the month ends?",
    participants: 88,
    daysLeft: 15,
    category: "Strength",
    imageId: 'challengePushups'
  },
  {
    id: 3,
    title: "Yoga & Mindfulness Journey",
    description: "Commit to 20 minutes of yoga or meditation daily to improve flexibility and mental clarity.",
    participants: 210,
    daysLeft: 28,
    category: "Wellness",
    imageId: 'challengeYoga'
  },
  {
    id: 4,
    title: "Team Step Contest",
    description: "Form a team and compete to see who can get the most steps in a week. Sync your fitness trackers!",
    participants: 45,
    daysLeft: 6,
    category: "Social",
    imageId: 'challengeSteps'
  },
];

const getImage = (id: string) => {
    return PlaceHolderImages.find(img => img.id === id);
}

export default function ChallengesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">
          Join a challenge, stay motivated, and compete with the community.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {challenges.map((challenge) => {
          const image = getImage(challenge.imageId);
          return (
          <Card key={challenge.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {image && (
              <div className="relative h-48 w-full">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  fill
                  className="object-cover"
                  data-ai-hint={image.imageHint}
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                  <CardTitle className="font-headline">{challenge.title}</CardTitle>
                  <Badge variant="secondary" className="whitespace-nowrap">{challenge.category}</Badge>
              </div>
              <CardDescription className="pt-2">{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> {challenge.participants} participants
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> {challenge.daysLeft} days left
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Join Challenge</Button>
            </CardFooter>
          </Card>
        )})}
      </div>
    </div>
  );
}
