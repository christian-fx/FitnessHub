'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
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
    workoutHistory?: { month: string; workouts: number }[];
    progressOverview?: { metric: string; value: number }[];
}

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
          setProfile(docSnap.data() as UserProfile);
        } else {
          // You might want to create a profile document here if it doesn't exist
          console.log("No such document!");
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
