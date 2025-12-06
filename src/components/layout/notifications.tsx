
'use client';

import * as React from 'react';
import { Bell, X, PartyPopper, Trophy, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useUser } from '@/firebase';
import { format } from 'date-fns';
import { tinyDailyTasks } from '@/lib/daily-tasks';
import { healthTips } from '@/lib/health-tips';
import { Separator } from '../ui/separator';
import { useRouter } from 'next/navigation';

const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

const challenges = [
  {
    id: 1,
    title: '30-Day Running Challenge',
  },
  {
    id: 2,
    title: '10,000 Push-ups in a Month',
  },
];

export function Notifications() {
  const { profile } = useUser();
  const router = useRouter();

  const [notifications, setNotifications] = React.useState<any[]>([]);

  React.useEffect(() => {
    const newNotifications = [];
    
    // Daily Task Notification
    if (profile) {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      if (profile.dailyTaskLastCompleted !== todayStr) {
        const dayIndex = getDayOfYear();
        const dailyTask = tinyDailyTasks[dayIndex % tinyDailyTasks.length];
        newNotifications.push({ 
            id: 'daily-task', 
            type: 'task',
            title: 'Your daily tiny task is here!', 
            description: dailyTask, 
            href: '/dashboard' 
        });
      }
    }

    // Daily Tips Notification
    const dayIndex = getDayOfYear();
    const tip1 = healthTips[dayIndex % healthTips.length];
    const tip2 = healthTips[(dayIndex + 365) % healthTips.length]; // Offset to get a different tip

    newNotifications.push({
        id: 'tip-1',
        type: 'tip',
        title: 'Daily Health Tip',
        description: tip1,
        href: '#',
    });
     newNotifications.push({
        id: 'tip-2',
        type: 'tip',
        title: 'Daily Motivation',
        description: tip2,
        href: '#',
    });


    // Challenges Notification
    challenges.forEach(challenge => {
        newNotifications.push({
            id: `challenge-${challenge.id}`,
            type: 'challenge',
            title: 'New Challenge Available',
            description: challenge.title,
            href: '/challenges'
        });
    });

    setNotifications(newNotifications);
  }, [profile]);
  
  const handleClear = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  const handleClearAll = () => {
    setNotifications([]);
  }

  const handleNavigate = (href: string) => {
    if (href === '#') return;
    router.push(href);
  };

  const getIcon = (type: string) => {
    switch (type) {
        case 'task':
            return <PartyPopper className="h-5 w-5"/>;
        case 'challenge':
            return <Trophy className="h-5 w-5"/>;
        case 'tip':
            return <Heart className="h-5 w-5"/>;
        default:
            return <Bell className="h-5 w-5"/>;
    }
  };

  const unreadCount = notifications.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4">
          <h4 className="font-medium leading-none">Notifications</h4>
        </div>
        {unreadCount === 0 ? (
            <p className='text-sm text-muted-foreground text-center p-4'>You have no new notifications.</p>
        ) : (
            <div className="grid gap-1 max-h-96 overflow-y-auto">
                {notifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                        <div className="group relative flex items-start gap-3 rounded-md p-4 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer" onClick={() => handleNavigate(notification.href)}>
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                {getIcon(notification.type)}
                            </div>
                            <div className='flex-1'>
                                <p className="font-semibold">{notification.title}</p>
                                <p className="text-muted-foreground">{notification.description}</p>
                            </div>
                             <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClear(notification.id);
                                }}
                                >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        {index < notifications.length - 1 && <Separator />}
                    </React.Fragment>
                ))}
            </div>
        )}
        {unreadCount > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full" onClick={handleClearAll}>
                Clear All Notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
