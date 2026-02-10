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
  arrayUnion,
  arrayRemove,
  Timestamp,
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
