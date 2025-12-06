'use server';

import {
  getFirestore,
  FieldValue,
  doc,
  collection,
  runTransaction,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { initializeFirebase, useUser } from '@/firebase';

type WorkoutData = {
  workoutType: string;
  duration: number;
  caloriesBurned?: number;
  date: Date;
  notes?: string;
};

export async function logWorkout(uid: string, data: WorkoutData) {
  try {
    const { firestore } = initializeFirebase();
    const userRef = doc(firestore, 'users', uid);
    const workoutsCollectionRef = collection(userRef, 'workouts');

    const workoutPayload = {
      ...data,
      createdAt: serverTimestamp(),
    };

    await runTransaction(firestore, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw 'Document does not exist!';
      }
      
      const currentWorkouts = userDoc.data()?.totalWorkouts || 0;

      // Add the new workout to the subcollection
      const newWorkoutRef = doc(workoutsCollectionRef); // Create a new doc ref in the subcollection
      transaction.set(newWorkoutRef, workoutPayload);

      // Update the aggregate count on the user document
      transaction.update(userRef, { totalWorkouts: currentWorkouts + 1 });
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error logging workout:', error);
    return { success: false, error: error.message || 'Could not log workout.' };
  }
}
