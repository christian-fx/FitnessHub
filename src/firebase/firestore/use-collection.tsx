
'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where, type Query, type DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export function useCollection<T extends DocumentData>(collectionPath: string, field?: string, value?: string) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let q: Query;
    const collectionRef = collection(firestore, collectionPath);
    if(field && value) {
        q = query(collectionRef, where(field, '==', value));
    } else {
        q = collectionRef;
    }


    const unsubscribe = onSnapshot(
        q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, collectionPath, field, value]);

  return { data, loading, error };
}

