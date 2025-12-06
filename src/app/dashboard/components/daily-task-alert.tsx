'use client';

import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { tinyDailyTasks } from '@/lib/daily-tasks';
import { PartyPopper } from 'lucide-react';

const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export function DailyTaskAlert() {
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
    const lastSeen = localStorage.getItem('dailyTaskLastSeen');

    if (lastSeen !== today) {
      const dayIndex = getDayOfYear();
      const dailyTask = tinyDailyTasks[dayIndex % tinyDailyTasks.length];
      setTask(dailyTask);
      setIsOpen(true);
      localStorage.setItem('dailyTaskLastSeen', today);
    }
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 font-headline">
            <PartyPopper className="text-primary" />
            Your Tiny Task for Today!
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-4 text-center text-lg text-foreground">
            {task}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setIsOpen(false)} className="w-full">
            Got it!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
