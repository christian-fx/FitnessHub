
'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, doc, type DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export function useDoc<T extends DocumentData>(collectionPath: string, docId: string) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docId) {
        setLoading(false);
        setData(null);
        return;
    }
    const docRef = doc(firestore, collectionPath, docId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, collectionPath, docId]);

  return { data, loading, error };
}

