'use client';

import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, idToken } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from '@/firebase/config';

// Re-export hooks and providers
export { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';


let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

/**
 * Initializes and returns the Firebase app, auth, and firestore instances.
 * It ensures that Firebase is initialized only once.
 *
 * @returns An object containing the FirebaseApp, Auth, and Firestore instances.
 */
export function initializeFirebase() {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  } else {
    firebaseApp = getApp();
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  }

  return { firebaseApp, auth, firestore };
}


/**
 * Middleware for server actions to add the Firebase ID token to the request headers.
 * This is useful for authenticating users in server-side code.
 * @param action 
 * @returns 
 */
export function withFirebaseAuth<T extends (...args: any[]) => Promise<any>>(action: T): T {
    return (async (...args: Parameters<T>) => {
        const { auth } = initializeFirebase();
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated.');
        }

        const token = await user.getIdToken();
        const headers = new Headers();
        headers.append('Authorization', `Bearer ${token}`);
        
        const originalFetch = fetch;
        (global as any).fetch = (url: RequestInfo | URL, options?: RequestInit) => {
            const newOptions = {
                ...options,
                headers: {
                    ...options?.headers,
                    ...Object.fromEntries(headers.entries()),
                },
            };
            return originalFetch(url, newOptions);
        };
        
        try {
            return await action(...args);
        } finally {
            (global as any).fetch = originalFetch;
        }
    }) as T;
}
