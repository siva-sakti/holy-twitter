/**
 * Seed script for HolyScroll Firestore database
 *
 * Usage:
 *   npm run seed              # Add seed data (preserves existing)
 *   npm run seed -- --clear   # Clear existing data first
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { figures, quotes } from './seed.js';

// Firebase config - using environment variables or hardcoded for seeding
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAH2R4H_qXFlbebjMGUr0a7eDulRFZCjWs',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'holyscroll-36b43.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'holyscroll-36b43',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'holyscroll-36b43.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '426755706140',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:426755706140:web:20c2ca0cb01ccdd54dbed9',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const shouldClear = process.argv.includes('--clear');

async function clearCollection(collectionName: string): Promise<number> {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);

  let count = 0;
  for (const docSnapshot of snapshot.docs) {
    await deleteDoc(doc(db, collectionName, docSnapshot.id));
    count++;
  }

  return count;
}

async function seedFigures(): Promise<void> {
  console.log('\n📚 Seeding figures...');

  for (const figure of figures) {
    const figureDoc = {
      displayName: figure.displayName,
      type: figure.type,
      bio: figure.bio,
      profilePicUrl: figure.profilePicUrl,
      tradition: figure.tradition,
      externalLinks: figure.externalLinks,
      createdAt: Timestamp.now(),
    };

    await setDoc(doc(db, 'figures', figure.id), figureDoc);
    console.log(`  ✓ ${figure.displayName}`);
  }

  console.log(`  → Added ${figures.length} figures`);
}

async function seedQuotes(): Promise<void> {
  console.log('\n💬 Seeding quotes...');

  let quoteCount = 0;
  const quotesByFigure: Record<string, number> = {};

  for (const quote of quotes) {
    const quoteId = `quote-${quoteCount + 1}`;

    const quoteDoc = {
      figureId: quote.figureId,
      text: quote.text,
      sourceCitation: quote.sourceCitation,
      addedBy: 'seed',
      createdAt: Timestamp.now(),
    };

    await setDoc(doc(db, 'quotes', quoteId), quoteDoc);

    quotesByFigure[quote.figureId] = (quotesByFigure[quote.figureId] || 0) + 1;
    quoteCount++;
  }

  // Print summary by figure
  for (const [figureId, count] of Object.entries(quotesByFigure)) {
    const figure = figures.find(f => f.id === figureId);
    console.log(`  ✓ ${figure?.displayName || figureId}: ${count} quotes`);
  }

  console.log(`  → Added ${quoteCount} quotes total`);
}

async function main(): Promise<void> {
  console.log('🌱 HolyScroll Seed Script');
  console.log('========================');
  console.log(`Project: ${firebaseConfig.projectId}`);

  try {
    if (shouldClear) {
      console.log('\n🗑️  Clearing existing data...');

      const figuresCleared = await clearCollection('figures');
      console.log(`  → Deleted ${figuresCleared} figures`);

      const quotesCleared = await clearCollection('quotes');
      console.log(`  → Deleted ${quotesCleared} quotes`);
    }

    await seedFigures();
    await seedQuotes();

    console.log('\n✅ Seeding complete!');
    console.log('\nSummary:');
    console.log(`  • ${figures.length} figures`);
    console.log(`  • ${quotes.length} quotes`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
}

main();
