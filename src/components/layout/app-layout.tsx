'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Home, LineChart, Dumbbell, Trophy } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/icons';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/dashboard', icon: LineChart, label: 'Dashboard' },
  { href: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { href: '/challenges', icon: Trophy, label: 'Challenges' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="inline-flex items-center gap-2">
            <Logo className="size-7 text-primary" />
            <span className="font-headline text-lg font-semibold">
              Fitness Hub
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    icon={<item.icon />}
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    {item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background/95 px-4 md:px-6 backdrop-blur-sm sticky top-0 z-30">
          <SidebarTrigger className="flex md:hidden" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold font-headline">
              {navItems.find(item => item.href === pathname)?.label ?? 'Fitness Hub'}
            </h1>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/30 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
