'use server';

import { auth } from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { headers } from 'next/headers';

// Initialize Firebase Admin SDK if not already initialized
import admin from 'firebase-admin';
if (!admin.apps.length) {
    admin.initializeApp();
}

type WorkoutData = {
  workoutType: string;
  duration: number;
  caloriesBurned?: number;
  date: Date;
  notes?: string;
};

export async function logWorkout(data: WorkoutData) {
  try {
    const headersList = headers();
    const authorization = headersList.get('authorization');
    if (!authorization) {
        throw new Error('User not authenticated.');
    }
    const token = authorization.split('Bearer ')[1];
    const decodedToken = await auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    if (!uid) {
      throw new Error('User not authenticated.');
    }

    const firestore = getFirestore();
    const workoutRef = firestore.collection('users').doc(uid).collection('workouts').doc();
    const userRef = firestore.collection('users').doc(uid);

    const workoutPayload = {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
    };

    await firestore.runTransaction(async (transaction) => {
      // Get the current totalWorkouts
      const userDoc = await transaction.get(userRef);
      const currentWorkouts = userDoc.data()?.totalWorkouts || 0;
      
      // Add the new workout
      transaction.set(workoutRef, workoutPayload);
      
      // Update the total workout count
      transaction.update(userRef, { totalWorkouts: currentWorkouts + 1 });
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error logging workout:', error);
    return { success: false, error: error.message };
  }
}
