'use client';

import * as React from 'react';
import { useState } from 'useState';
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
import { Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { createNewUserProfile, UserProfile } from '@/firebase/auth/use-user';
import { format, differenceInDays } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProfilePage() {
  const { user, profile, loading: userLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female' | 'not-specified' | ''>('');

  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isFreezing, setIsFreezing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const resetFormState = React.useCallback(() => {
    if (user && profile) {
      setDisplayName(profile.displayName || '');
      setEmail(profile.email || '');
      setWeight(profile.weight || '');
      setHeight(profile.height || '');
      setAge(profile.age || '');
      setGender(profile.gender || 'not-specified');
    }
  }, [user, profile]);

  React.useEffect(() => {
    resetFormState();
  }, [resetFormState]);

  React.useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      const updatedProfileData: Partial<UserProfile> = {};

      if (displayName !== profile?.displayName) {
        await updateAuthProfile(user, { displayName });
        updatedProfileData.displayName = displayName;
      }
      if (email !== profile?.email && user.email) {
        // Re-authentication might be needed for sensitive operations like changing email
        await updateEmail(user, email);
        updatedProfileData.email = email;
      }

      if (Number(weight) !== profile?.weight) updatedProfileData.weight = Number(weight);
      if (Number(height) !== profile?.height) updatedProfileData.height = Number(height);
      if (Number(age) !== profile?.age) updatedProfileData.age = Number(age);
      if (gender !== profile?.gender) updatedProfileData.gender = gender as UserProfile['gender'];


      if (Object.keys(updatedProfileData).length > 0) {
        await updateDoc(userDocRef, updatedProfileData);
      }

      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
      setIsEditing(false);
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

  const handleCancelEdit = () => {
    resetFormState();
    setIsEditing(false);
  }

  const handleResetData = async () => {
    if (!user) return;
    setIsResetting(true);
    try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const freshProfile = await createNewUserProfile(firestore, user, true);
        await updateDoc(userDocRef, freshProfile);
        toast({
            title: "Data Reset",
            description: "Your workout data has been successfully reset.",
        });
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error Resetting Data",
            description: error.message || "An unexpected error occurred.",
        });
    } finally {
        setIsResetting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleStreakFreeze = async () => {
    if (!user) return;
    setIsFreezing(true);
    try {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, { streakFreezeLastUsed: todayStr, lastWorkoutDate: todayStr });
      toast({
        title: "Streak Freeze Activated!",
        description: "Your streak is safe for today. Keep up the great work!",
      });
    } catch(e: any) {
       toast({
        variant: 'destructive',
        title: 'Error Activating Freeze',
        description: e.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsFreezing(false);
    }
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return name.charAt(0);
  }

  const canUseStreakFreeze = React.useMemo(() => {
    if (!profile?.streakFreezeLastUsed) return true;
    const lastUsed = new Date(profile.streakFreezeLastUsed);
    const today = new Date();
    return differenceInDays(today, lastUsed) >= 7;
  }, [profile?.streakFreezeLastUsed]);

  if (userLoading || !user) {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
                readOnly={!isEditing} 
                />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={!isEditing} 
                />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} readOnly={!isEditing} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} readOnly={!isEditing} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} readOnly={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
               <Select value={gender || 'not-specified'} onValueChange={(value) => setGender(value as 'male' | 'female' | 'not-specified')} disabled={!isEditing}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="not-specified">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-between">
          <div className='flex gap-2'>
            {isEditing ? (
              <>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
                 <Button variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
          <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-primary">
            <ShieldCheck />
            Streak Insurance
          </CardTitle>
          <CardDescription>
            About to lose your streak due to travel, exams, or a rainy day? Use your weekly Streak Freeze to protect it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={!canUseStreakFreeze || isFreezing}>
                {isFreezing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Use Streak Freeze
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Activate Streak Freeze?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will use your weekly streak freeze and protect your streak for today. You can use this once every 7 days.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleStreakFreeze}>
                  Yes, freeze my streak
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
        {!canUseStreakFreeze && (
            <CardFooter>
                 <p className='text-xs text-muted-foreground'>You can use Streak Freeze again in {7 - differenceInDays(new Date(), new Date(profile?.streakFreezeLastUsed || ''))} days.</p>
            </CardFooter>
        )}
      </Card>
      
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-destructive">
            <AlertTriangle />
            Danger Zone
          </CardTitle>
          <CardDescription>
            These actions are irreversible. Please be certain before proceeding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isResetting}>
                  {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reset All Workout Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all of your workout history, stats, and reset your streak.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Yes, reset my data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
