
'use client';
import { FirebaseProvider } from './provider';

/**
 * A client-side component that wraps the FirebaseProvider.
 * This ensures that Firebase is initialized only on the client.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
    return <FirebaseProvider>{children}</FirebaseProvider>;
}
