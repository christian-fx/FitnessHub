
'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// Define the context shape
interface FirebaseContextType {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

// Create the context
const FirebaseContext = createContext<FirebaseContextType | null>(null);

/**
 * Provides the Firebase app, auth, and firestore instances to its children.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {JSX.Element} The FirebaseProvider component.
 */
export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const { firebaseApp, auth, firestore } = useMemo(() => initializeFirebase(), []);

  const contextValue = useMemo(() => ({
    firebaseApp,
    auth,
    firestore,
  }), [firebaseApp, auth, firestore]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
}


// Custom hooks for accessing Firebase services
export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
}

export function useFirebaseApp() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider.');
  }
  return context.firebaseApp;
}

export function useFirestore() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirestore must be used within a FirebaseProvider.');
  }
  return context.firestore;
}

export function useAuth() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useAuth must be used within a FirebaseProvider.');
  }
  return context.auth;
}

