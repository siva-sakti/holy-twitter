'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthContext';
import LoginScreen from '@/components/LoginScreen';
import OnboardingScreen from '@/components/OnboardingScreen';
import AppShell from '@/components/AppShell';
import Feed from '@/components/Feed';
import PostModal from '@/components/PostModal';
import UserProfile from '@/components/UserProfile';
import SavedQuotes from '@/components/SavedQuotes';
import { shareQuote as shareQuoteUtil } from '@/lib/utils/share';
import {
  getFigures,
  getQuotesForFeed,
  getUserData,
  createUserIfNotExists,
  getUserSavedQuotes,
  saveQuote,
  unsaveQuote,
  updateUserFollowing,
  updateUserProfile,
} from '@/lib/firebase/firestore';
import type { Figure, Quote, User, QuoteWithFigure } from '@/lib/types';
import type { NavTab } from '@/components/Sidebar';

type AppState = 'loading' | 'login' | 'onboarding' | 'feed';

export default function Home() {
  const { user, loading: authLoading } = useAuth();

  const [appState, setAppState] = useState<AppState>('loading');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [figures, setFigures] = useState<Figure[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [savedQuoteIds, setSavedQuoteIds] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [expandedQuote, setExpandedQuote] = useState<QuoteWithFigure | null>(null);

  // Load figures on mount (needed for both onboarding and feed)
  useEffect(() => {
    getFigures()
      .then(setFigures)
      .catch((err) => console.error('Error loading figures:', err));
  }, []);

  // Handle auth state changes
  useEffect(() => {
    if (authLoading) {
      setAppState('loading');
      return;
    }

    if (!user) {
      setAppState('login');
      return;
    }

    // User is authenticated, check if they have data
    setDataLoading(true);
    createUserIfNotExists(user.uid, user.email, user.displayName, user.photoURL)
      .then((userData) => {
        setUserData(userData);

        if (userData.following.length === 0) {
          setAppState('onboarding');
          setDataLoading(false);
        } else {
          // User has following list, load feed data
          loadFeedData(user.uid, userData.following);
        }
      })
      .catch((err) => {
        console.error('Error loading user data:', err);
        setDataLoading(false);
      });
  }, [user, authLoading]);

  // Load feed data
  const loadFeedData = async (uid: string, following: string[]) => {
    try {
      const [quotesData, savedIds] = await Promise.all([
        getQuotesForFeed(following),
        getUserSavedQuotes(uid),
      ]);

      setQuotes(quotesData);
      setSavedQuoteIds(savedIds);
      setAppState('feed');
    } catch (err) {
      console.error('Error loading feed data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  // Handle onboarding complete
  const handleOnboardingComplete = useCallback(async () => {
    if (!user) return;

    setDataLoading(true);
    try {
      const updatedUserData = await getUserData(user.uid);
      if (updatedUserData) {
        setUserData(updatedUserData);
        await loadFeedData(user.uid, updatedUserData.following);
      }
    } catch (err) {
      console.error('Error after onboarding:', err);
      setDataLoading(false);
    }
  }, [user]);

  // Track in-progress saves to prevent double-clicks
  const [savingQuoteIds, setSavingQuoteIds] = useState<Set<string>>(new Set());

  // Handle save quote
  const handleSave = async (quoteId: string) => {
    if (!user) return;
    // Prevent duplicate saves
    if (savedQuoteIds.includes(quoteId) || savingQuoteIds.has(quoteId)) return;

    setSavingQuoteIds((prev) => new Set(prev).add(quoteId));
    try {
      await saveQuote(user.uid, quoteId);
      setSavedQuoteIds((prev) =>
        prev.includes(quoteId) ? prev : [...prev, quoteId]
      );
    } catch (err) {
      console.error('Error saving quote:', err);
    } finally {
      setSavingQuoteIds((prev) => {
        const next = new Set(prev);
        next.delete(quoteId);
        return next;
      });
    }
  };

  // Handle unsave quote
  const handleUnsave = async (quoteId: string) => {
    if (!user) return;
    // Prevent duplicate unsaves
    if (!savedQuoteIds.includes(quoteId) || savingQuoteIds.has(quoteId)) return;

    setSavingQuoteIds((prev) => new Set(prev).add(quoteId));
    try {
      await unsaveQuote(user.uid, quoteId);
      setSavedQuoteIds((prev) => prev.filter((id) => id !== quoteId));
    } catch (err) {
      console.error('Error unsaving quote:', err);
    } finally {
      setSavingQuoteIds((prev) => {
        const next = new Set(prev);
        next.delete(quoteId);
        return next;
      });
    }
  };

  // Handle share - copy to clipboard or native share
  const handleShare = useCallback(async (quote: QuoteWithFigure) => {
    await shareQuoteUtil({
      figureName: quote.figure.displayName,
      quoteText: quote.text,
      sourceCitation: quote.sourceCitation,
    });
  }, []);

  // Handle repost (placeholder for now)
  const handleRepost = (quote: QuoteWithFigure) => {
    console.log('Repost quote:', quote);
  };

  // Handle expand - open modal
  const handleExpand = (quote: QuoteWithFigure) => {
    setExpandedQuote(quote);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setExpandedQuote(null);
  };

  // Handle sign out
  const handleSignOut = useCallback(async () => {
    const { signOut } = await import('@/lib/firebase/auth');
    await signOut();
  }, []);

  // Handle reset onboarding
  const handleResetOnboarding = useCallback(async () => {
    if (!user) return;
    await updateUserFollowing(user.uid, []);
    setAppState('onboarding');
  }, [user]);

  // Handle update profile
  const handleUpdateProfile = useCallback(
    async (updates: { displayName?: string; bio?: string }) => {
      if (!user) return;
      await updateUserProfile(user.uid, updates);
      if (userData) {
        setUserData({
          ...userData,
          ...(updates.displayName && { displayName: updates.displayName }),
          ...(updates.bio !== undefined && { bio: updates.bio }),
        });
      }
    },
    [user, userData]
  );

  // Get original quote ID for save state
  const getOriginalId = (id: string) => id.split('-batch')[0];

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <svg
          className="animate-spin h-8 w-8 text-[#536471] dark:text-[#71767b]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p className="text-[#536471] dark:text-[#71767b] text-sm">Loading...</p>
      </div>
    </div>
  );

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Feed
            quotes={quotes}
            figures={figures}
            savedQuoteIds={savedQuoteIds}
            onSave={handleSave}
            onUnsave={handleUnsave}
            onShare={handleShare}
            onRepost={handleRepost}
            onExpand={handleExpand}
          />
        );
      case 'bookmarks':
        return (
          <SavedQuotes
            savedQuoteIds={savedQuoteIds}
            quotes={quotes}
            figures={figures}
            onSave={handleSave}
            onUnsave={handleUnsave}
            onExpand={handleExpand}
            onShare={handleShare}
            onRepost={handleRepost}
          />
        );
      case 'profile':
        return user ? (
          <UserProfile
            user={{
              displayName: userData?.displayName || user.displayName || 'Anonymous',
              email: user.email || '',
              photoURL: user.photoURL || '',
              bio: userData?.bio || '',
            }}
            savedQuoteIds={savedQuoteIds}
            quotes={quotes}
            figures={figures}
            onClose={() => setActiveTab('home')}
            onSave={handleSave}
            onUnsave={handleUnsave}
            onExpand={handleExpand}
            onShare={handleShare}
            onRepost={handleRepost}
            onUpdateProfile={handleUpdateProfile}
          />
        ) : null;
      default:
        return null;
    }
  };

  // Render based on app state
  if (appState === 'loading' || dataLoading) {
    return <LoadingSpinner />;
  }

  if (appState === 'login') {
    return <LoginScreen />;
  }

  if (appState === 'onboarding' && user) {
    return (
      <OnboardingScreen
        figures={figures}
        userId={user.uid}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  if (appState === 'feed') {
    return (
      <>
        <AppShell
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userPhotoUrl={user?.photoURL || undefined}
          userName={userData?.displayName || user?.displayName || 'User'}
          onSignOut={handleSignOut}
        >
          {renderContent()}
        </AppShell>

        {/* Post Modal */}
        {expandedQuote && (
          <PostModal
            quote={expandedQuote}
            isSaved={savedQuoteIds.includes(getOriginalId(expandedQuote.id))}
            onClose={handleCloseModal}
            onSave={() => {
              const originalId = getOriginalId(expandedQuote.id);
              if (savedQuoteIds.includes(originalId)) {
                handleUnsave(originalId);
              } else {
                handleSave(originalId);
              }
            }}
            onRepost={() => handleRepost(expandedQuote)}
            onShare={() => handleShare(expandedQuote)}
          />
        )}
      </>
    );
  }

  return <LoadingSpinner />;
}
