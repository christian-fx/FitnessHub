
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
import { Home, LineChart, Dumbbell, Trophy, User, LogIn, PlusSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/icons';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Notifications } from './notifications';
import { ThemeToggle } from './theme-toggle';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/dashboard', icon: LineChart, label: 'Dashboard' },
  { href: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { href: '/challenges', icon: Trophy, label: 'Challenges' },
  { href: '/log', icon: PlusSquare, label: 'Log Workout' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return name.charAt(0);
  }

  // Handle full-page routes like login/signup
  if (pathname === '/login' || pathname === '/signup') {
    return <>{children}</>;
  }
  
  const getPageTitle = () => {
    if (pathname === '/') return 'Home';
    const navItem = navItems.find(item => item.href === pathname);
    return navItem?.label ?? (pathname === '/profile' ? 'Profile' : 'Fitness Hub');
  }

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
            {loading ? (
                <div className="flex flex-col gap-2 p-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            ) : user ? (
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
            ) : (
                <div className="p-2">
                     <Link href="/" passHref legacyBehavior>
                        <SidebarMenuButton icon={<Home />} isActive={pathname === '/'}>
                            Home
                        </SidebarMenuButton>
                    </Link>
                    <Link href="/login" passHref legacyBehavior>
                        <SidebarMenuButton icon={<LogIn />}>
                            Login
                        </SidebarMenuButton>
                    </Link>
                </div>
            )}
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background/95 px-4 md:px-6 backdrop-blur-sm sticky top-0 z-30">
          <SidebarTrigger className="flex md:hidden" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold font-headline">
              {getPageTitle()}
            </h1>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Notifications />
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.displayName}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile" passHref>
                      <DropdownMenuItem asChild>
                          <div className="cursor-pointer">
                              <User className="mr-2 h-4 w-4" />
                              <span>Profile</span>
                          </div>
                      </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={handleSignOut}>
                      <div className="cursor-pointer">
                          <LogIn className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                      </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
             <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button asChild>
                    <Link href="/login">Log In</Link>
                </Button>
                 <Button asChild variant="outline">
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </div>
          )}
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/30 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
