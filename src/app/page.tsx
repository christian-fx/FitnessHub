
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AIWorkoutForm } from "./components/ai-workout-form";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wand2 } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <div className="py-16">
                <Card className="w-full shadow-lg">
                    <CardHeader>
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Skeleton className="h-24" />
                                <Skeleton className="h-24" />
                                <Skeleton className="h-10" />
                                <Skeleton className="h-10" />
                            </div>
                            <Skeleton className="h-11 w-40" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-0 -mt-8">
      <section className="relative text-center py-20 md:py-32 bg-card border-b">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
            Your Personal AI Fitness Coach
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Achieve your fitness goals with personalized workout plans, progress
            tracking, and community challenges. All powered by AI.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/signup">
                Get Started for Free <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <div className="py-16">
         <Card className="w-full shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Wand2 className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="font-headline text-3xl">Try Our AI Workout Planner</CardTitle>
                <CardDescription className="mt-1">
                  Not ready to sign up? Get a sample personalized workout plan from our AI trainer. Just fill out the form below.
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
