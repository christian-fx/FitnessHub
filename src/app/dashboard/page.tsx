'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Activity, Flame, Dumbbell, Zap } from "lucide-react";
import { WorkoutHistoryChart } from "./components/workout-history-chart";
import { ProgressOverviewChart } from "./components/progress-overview-chart";
import { useUser } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { DailyTaskAlert } from "./components/daily-task-alert";

export default function DashboardPage() {
  const { user, profile, loading } = useUser();

  const stats = useMemo(() => [
    {
      title: "Total Workouts",
      value: profile?.totalWorkouts?.toLocaleString() ?? 0,
      change: `+${profile?.recentWorkoutChange ?? 0} this month`,
      icon: Activity,
      color: "text-muted-foreground",
    },
    {
      title: "Calories Burned",
      value: profile?.caloriesBurned?.toLocaleString() ?? 0,
      change: `+${profile?.recentCaloriesChange ?? 0} kcal this month`,
      icon: Flame,
      color: "text-accent",
    },
    {
      title: "Volume Lifted",
      value: `${(profile?.volumeLifted ?? 0).toLocaleString()} kg`,
      change: `+${(profile?.recentVolumeChange ?? 0).toLocaleString()}% this month`,
      icon: Dumbbell,
      color: "text-muted-foreground",
    },
    {
      title: "Active Streak",
      value: `${profile?.activeStreak ?? 0} days`,
      change: "Keep the fire going!",
      icon: Zap,
      color: "text-primary",
    },
  ], [profile]);

  if (loading) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="lg:col-span-4 h-80" />
                <Skeleton className="lg:col-span-3 h-80" />
            </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DailyTaskAlert />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                        {stat.change}
                    </p>
                </CardContent>
            </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Workout History</CardTitle>
            <CardDescription>Your workout frequency over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <WorkoutHistoryChart data={profile?.workoutHistory} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>Comparison of key metrics this month.</CardDescription>
          </CardHeader>
          <CardContent className="pr-6">
            <ProgressOverviewChart data={profile?.progressOverview} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
