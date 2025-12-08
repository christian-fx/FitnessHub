
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { format, addMonths } from 'date-fns';

// Define a type for the user profile data
export interface UserProfile {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    createdAt?: string; // ISO string
    weight?: number;
    height?: number;
    age?: number;
    gender?: 'male' | 'female' | 'not-specified';
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

const generateInitialWorkoutHistory = (startDate: Date) => {
    const months = [];
    for (let i = 0; i < 6; i++) {
        const date = addMonths(startDate, i);
        months.push({ month: format(date, 'MMM'), workouts: 0 });
    }
    return months;
};

export const createNewUserProfile = async (firestore: any, user: User, isReset = false): Promise<UserProfile> => {
    const userRef = doc(firestore, 'users', user.uid);
    const creationDate = new Date();

    const newUserProfileData = {
      createdAt: creationDate.toISOString(),
      weight: 0,
      height: 0,
      age: 0,
      gender: 'not-specified' as UserProfile['gender'],
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
      workoutHistory: generateInitialWorkoutHistory(creationDate),
      progressOverview: [
        { metric: 'Strength', value: 0 },
        { metric: 'Cardio', value: 0 },
        { metric: 'Flexibility', value: 0 },
        { metric: 'Endurance', value: 0 },
        { metric: 'Balance', value: 0 },
      ],
    };

    if (isReset) {
      // When resetting, we keep the original creation date
      const { createdAt, ...resettableData } = newUserProfileData;
      await updateDoc(userRef, resettableData);
      return { 
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        ...resettableData
      };
    }

    const fullProfile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      ...newUserProfileData,
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
      const unsubscribeProfile = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setProfile(data);
        } else {
          // Profile doesn't exist, this should only happen during the signup process
          // The signup flow is now solely responsible for profile creation.
          setProfile(null);
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
