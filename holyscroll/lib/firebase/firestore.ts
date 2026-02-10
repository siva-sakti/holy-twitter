import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  setDoc,
  deleteDoc,
  addDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  writeBatch,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from './config';
import type { Figure, Quote, User, SavedQuote } from '@/lib/types';

// Helper to convert Firestore timestamp to Date
function toDate(timestamp: Timestamp | Date): Date {
  return timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
}

// ============ FIGURES ============

export async function getFigures(): Promise<Figure[]> {
  const figuresRef = collection(db, 'figures');
  const snapshot = await getDocs(figuresRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toDate(doc.data().createdAt),
  })) as Figure[];
}

export async function getFigureById(id: string): Promise<Figure | null> {
  const figureRef = doc(db, 'figures', id);
  const snapshot = await getDoc(figureRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: toDate(snapshot.data().createdAt),
  } as Figure;
}

// ============ QUOTES ============

export async function getQuotesByFigure(figureId: string): Promise<Quote[]> {
  const quotesRef = collection(db, 'quotes');
  const q = query(quotesRef, where('figureId', '==', figureId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toDate(doc.data().createdAt),
  })) as Quote[];
}

export async function getQuotesForFeed(followedFigureIds: string[]): Promise<Quote[]> {
  if (followedFigureIds.length === 0) return [];

  // Firestore 'in' queries are limited to 30 items
  // Split into chunks if needed
  const chunks: string[][] = [];
  for (let i = 0; i < followedFigureIds.length; i += 30) {
    chunks.push(followedFigureIds.slice(i, i + 30));
  }

  const allQuotes: Quote[] = [];

  for (const chunk of chunks) {
    const quotesRef = collection(db, 'quotes');
    const q = query(quotesRef, where('figureId', 'in', chunk));
    const snapshot = await getDocs(q);

    const quotes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: toDate(doc.data().createdAt),
    })) as Quote[];

    allQuotes.push(...quotes);
  }

  return allQuotes;
}

// ============ USERS ============

export async function getUserData(uid: string): Promise<User | null> {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: toDate(snapshot.data().createdAt),
  } as User;
}

export async function createUserIfNotExists(
  uid: string,
  email: string | null,
  displayName: string | null,
  photoURL: string | null
): Promise<User> {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: toDate(snapshot.data().createdAt),
    } as User;
  }

  const newUser: Omit<User, 'id'> = {
    email: email || '',
    displayName: displayName || 'Anonymous',
    bio: '',
    profilePicUrl: photoURL || '',
    following: [],
    createdAt: new Date(),
  };

  await setDoc(userRef, {
    ...newUser,
    createdAt: Timestamp.fromDate(newUser.createdAt),
  });

  return { id: uid, ...newUser };
}

export async function updateUserFollowing(
  uid: string,
  figureIds: string[]
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { following: figureIds });
}

export async function followFigure(uid: string, figureId: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    following: arrayUnion(figureId),
  });
}

export async function unfollowFigure(uid: string, figureId: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    following: arrayRemove(figureId),
  });
}

export async function updateUserProfile(
  uid: string,
  updates: { displayName?: string; bio?: string; profilePicUrl?: string }
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, updates);
}

// ============ SAVED QUOTES ============

export async function saveQuote(uid: string, quoteId: string): Promise<void> {
  const savedQuoteRef = doc(db, 'users', uid, 'savedQuotes', quoteId);
  await setDoc(savedQuoteRef, {
    quoteId,
    listId: null,
    savedAt: Timestamp.now(),
  });
}

export async function unsaveQuote(uid: string, quoteId: string): Promise<void> {
  const savedQuoteRef = doc(db, 'users', uid, 'savedQuotes', quoteId);
  await deleteDoc(savedQuoteRef);
}

export async function getUserSavedQuotes(uid: string): Promise<string[]> {
  const savedQuotesRef = collection(db, 'users', uid, 'savedQuotes');
  const snapshot = await getDocs(savedQuotesRef);

  return snapshot.docs.map((doc) => doc.data().quoteId);
}

export async function getUserSavedQuotesWithData(uid: string): Promise<SavedQuote[]> {
  const savedQuotesRef = collection(db, 'users', uid, 'savedQuotes');
  const snapshot = await getDocs(savedQuotesRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    userId: uid,
    ...doc.data(),
    savedAt: toDate(doc.data().savedAt),
  })) as SavedQuote[];
}

// ============ ADMIN: FIGURES ============

export async function addFigure(
  figureData: Omit<Figure, 'id' | 'createdAt'>
): Promise<string> {
  const figuresRef = collection(db, 'figures');
  const docRef = await addDoc(figuresRef, {
    ...figureData,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateFigure(
  id: string,
  figureData: Partial<Omit<Figure, 'id' | 'createdAt'>>
): Promise<void> {
  const figureRef = doc(db, 'figures', id);
  await updateDoc(figureRef, figureData);
}

export async function deleteFigure(
  id: string,
  deleteQuotes: boolean = false
): Promise<void> {
  if (deleteQuotes) {
    // Delete all quotes for this figure first
    const quotesRef = collection(db, 'quotes');
    const q = query(quotesRef, where('figureId', '==', id));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }

  const figureRef = doc(db, 'figures', id);
  await deleteDoc(figureRef);
}

// ============ ADMIN: QUOTES ============

export async function getAllQuotes(): Promise<Quote[]> {
  const quotesRef = collection(db, 'quotes');
  const snapshot = await getDocs(quotesRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toDate(doc.data().createdAt),
  })) as Quote[];
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  const quoteRef = doc(db, 'quotes', id);
  const snapshot = await getDoc(quoteRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: toDate(snapshot.data().createdAt),
  } as Quote;
}

export async function addQuote(
  quoteData: Omit<Quote, 'id' | 'createdAt'>
): Promise<string> {
  const quotesRef = collection(db, 'quotes');
  const docRef = await addDoc(quotesRef, {
    ...quoteData,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateQuote(
  id: string,
  quoteData: Partial<Omit<Quote, 'id' | 'createdAt'>>
): Promise<void> {
  const quoteRef = doc(db, 'quotes', id);
  await updateDoc(quoteRef, quoteData);
}

export async function deleteQuote(id: string): Promise<void> {
  const quoteRef = doc(db, 'quotes', id);
  await deleteDoc(quoteRef);
}

export async function getQuoteCountByFigure(figureId: string): Promise<number> {
  const quotesRef = collection(db, 'quotes');
  const q = query(quotesRef, where('figureId', '==', figureId));
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

export async function getQuoteCountsForFigures(
  figureIds: string[]
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();

  // Get all quotes and count locally (more efficient for getting counts for multiple figures)
  const quotesRef = collection(db, 'quotes');
  const snapshot = await getDocs(quotesRef);

  figureIds.forEach((id) => counts.set(id, 0));

  snapshot.docs.forEach((doc) => {
    const figureId = doc.data().figureId;
    if (counts.has(figureId)) {
      counts.set(figureId, (counts.get(figureId) || 0) + 1);
    }
  });

  return counts;
}
