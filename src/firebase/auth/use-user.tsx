'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';

// Define a type for the user profile data
export interface UserProfile {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    totalWorkouts?: number;
    recentWorkoutChange?: number;
    caloriesBurned?: number;
    recentCaloriesChange?: number;
    volumeLifted?: number;
    recentVolumeChange?: number;
    activeStreak?: number;
    lastWorkoutDate?: string; // YYYY-MM-DD
    workoutHistory?: { month: string; workouts: number }[];
    progressOverview?: { metric: string; value: number }[];
    streakFreezeLastUsed?: string; // YYYY-MM-DD
    dailyTaskLastCompleted?: string; // YYYY-MM-DD
}

export const createNewUserProfile = async (firestore: any, user: User, isReset = false) => {
    const userRef = doc(firestore, 'users', user.uid);
    const newUserProfile: Omit<UserProfile, 'uid' | 'displayName' | 'email' | 'photoURL'> = {
      totalWorkouts: 0,
      recentWorkoutChange: 0,
      caloriesBurned: 0,
      recentCaloriesChange: 0,
      volumeLifted: 0,
      recentVolumeChange: 0,
      activeStreak: 0,
      lastWorkoutDate: '',
      streakFreezeLastUsed: '',
      dailyTaskLastCompleted: '',
      workoutHistory: [
        { month: 'Jan', workouts: 0 },
        { month: 'Feb', workouts: 0 },
        { month: 'Mar', workouts: 0 },
        { month: 'Apr', workouts: 0 },
        { month: 'May', workouts: 0 },
        { month: 'Jun', workouts: 0 },
      ],
      progressOverview: [
        { metric: 'Strength', value: 0 },
        { metric: 'Cardio', value: 0 },
        { metric: 'Flexibility', value: 0 },
        { metric: 'Endurance', value: 0 },
        { metric: 'Balance', value: 0 },
      ],
    };

    if (isReset) {
      await updateDoc(userRef, newUserProfile);
      return { ...user, ...newUserProfile} as UserProfile;
    }

    const fullProfile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      ...newUserProfile,
    };

    await setDoc(userRef, fullProfile);
    return fullProfile;
};


export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (user) {
      const docRef = doc(firestore, 'users', user.uid);
      const unsubscribeProfile = onSnapshot(docRef, async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setProfile(data);
        } else {
          // If profile doesn't exist, create one
          const newProfile = await createNewUserProfile(firestore, user);
          setProfile(newProfile);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching user profile:", error);
        setProfile(null);
        setLoading(false);
      });
      
      return () => unsubscribeProfile();
    }
  }, [user, firestore]);

  return { user, profile, loading };
}
