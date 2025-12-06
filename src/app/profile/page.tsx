'use client';

import * as React from 'react';
import { useState } from 'react';
import { useUser, useAuth } from '@/firebase';
import { signOut, updateProfile as updateAuthProfile, updateEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, profile, loading: userLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (user && profile) {
      setDisplayName(profile.displayName || '');
      setEmail(profile.email || '');
    }
  }, [user, profile]);

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      const updatedProfileData: { displayName?: string; email?: string } = {};

      if (displayName !== profile?.displayName) {
        await updateAuthProfile(user, { displayName });
        updatedProfileData.displayName = displayName;
      }
      if (email !== profile?.email) {
        // Reauthentication might be needed for security-sensitive operations
        // For simplicity, we are directly trying to update email.
        // In a production app, handle re-authentication flow.
        await updateEmail(user, email);
        updatedProfileData.email = email;
      }

      if (Object.keys(updatedProfileData).length > 0) {
        await updateDoc(userDocRef, updatedProfileData);
      }

      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error updating profile',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsSaving(false);
    }
  };

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

  if (userLoading) {
    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex items-center space-x-6">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-5 w-64" />
                        </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                    <Skeleton className="h-10 w-32" />
                </CardFooter>
            </Card>
        </div>
    )
  }
  
  if (!user) {
    // Optionally, redirect to login if no user is found after loading
    if (typeof window !== 'undefined') {
        router.push('/login');
    }
    return null; // Or a message indicating user should be logged in
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">My Profile</CardTitle>
          <CardDescription>
            Update your personal details and fitness preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.photoURL || `https://avatar.vercel.sh/${user.uid}.png`} alt="User avatar" />
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{profile?.displayName || 'User'}</h2>
              <p className="text-muted-foreground">{profile?.email}</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-between">
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
