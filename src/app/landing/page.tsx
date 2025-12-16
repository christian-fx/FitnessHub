
import { Button } from "@/components/ui/button";
import { ArrowRight, Wand2, LineChart, Trophy, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-57px)]">
      <main className="flex-grow">
        <section className="relative text-center py-20 md:py-32 bg-card border-b">
          <div className="relative z-10 px-4 container">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your Personal AI Fitness Coach
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Achieve your goals with personalized workout and diet plans, progress
              tracking, and community challenges. All powered by AI.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/signup">
                  Get Started for Free <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                  <Link href="/ai">
                      <Wand2 className="mr-2" /> Try the AI Planner
                  </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
              <div className="text-center">
                  <h2 className="text-3xl font-bold">Features to Help You Succeed</h2>
                  <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                      Everything you need to stay on track, get stronger, and achieve your fitness ambitions.
                  </p>
              </div>
              <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                  <div className="flex flex-col items-center p-4">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                          <Wand2 className="h-8 w-8" />
                      </div>
                      <h3 className="mt-4 text-xl font-semibold">AI-Powered Workouts</h3>
                      <p className="mt-2 text-muted-foreground">
                          Get workout routines tailored to your goals, equipment, and fitness level.
                      </p>
                  </div>
                  <div className="flex flex-col items-center p-4">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                          <UtensilsCrossed className="h-8 w-8" />
                      </div>
                      <h3 className="mt-4 text-xl font-semibold">AI Diet Plans</h3>
                      <p className="mt-2 text-muted-foreground">
                          Receive personalized meal plans that align with your dietary needs and health goals.
                      </p>
                  </div>
                   <div className="flex flex-col items-center p-4">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                          <LineChart className="h-8 w-8" />
                      </div>
                      <h3 className="mt-4 text-xl font-semibold">Track Your Progress</h3>
                      <p className="mt-2 text-muted-foreground">
                          Log every workout and see your strength and consistency improve over time.
                      </p>
                  </div>
                   <div className="flex flex-col items-center p-4">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                          <Trophy className="h-8 w-8" />
                      </div>
                      <h3 className="mt-4 text-xl font-semibold">Join Challenges</h3>
                      <p className="mt-2 text-muted-foreground">
                          Stay motivated by competing with fellow fitness enthusiasts in community challenges.
                      </p>
                  </div>
              </div>
          </div>
        </section>
      </main>
    </div>
  );
}
