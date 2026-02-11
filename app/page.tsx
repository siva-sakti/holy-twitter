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
import ListPickerModal from '@/components/ListPickerModal';
import CreateListModal from '@/components/CreateListModal';
import { shareQuote as shareQuoteUtil } from '@/lib/utils/share';
import {
  getFigures,
  getQuotesForFeed,
  getUserData,
  createUserIfNotExists,
  getUserSavedQuotesWithData,
  getUserLikedQuotes,
  getUserLists,
  likeQuote,
  unlikeQuote,
  saveQuoteToList,
  unsaveQuote,
  createList,
  deleteList,
  updateUserFollowing,
  updateUserProfile,
} from '@/lib/firebase/firestore';
import type { ListData } from '@/lib/firebase/firestore';
import type { Figure, Quote, User, QuoteWithFigure } from '@/lib/types';
import type { NavTab } from '@/components/Sidebar';

type AppState = 'loading' | 'login' | 'onboarding' | 'feed';

interface SavedQuoteData {
  quoteId: string;
  listId: string | null;
}

export default function Home() {
  const { user, loading: authLoading } = useAuth();

  const [appState, setAppState] = useState<AppState>('loading');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [figures, setFigures] = useState<Figure[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [expandedQuote, setExpandedQuote] = useState<QuoteWithFigure | null>(null);

  // Like state
  const [likedQuoteIds, setLikedQuoteIds] = useState<string[]>([]);
  const [likingQuoteIds, setLikingQuoteIds] = useState<Set<string>>(new Set());

  // Bookmark/Save state
  const [savedQuotes, setSavedQuotes] = useState<SavedQuoteData[]>([]);
  const [savingQuoteIds, setSavingQuoteIds] = useState<Set<string>>(new Set());

  // Lists state
  const [lists, setLists] = useState<ListData[]>([]);

  // Modal state
  const [bookmarkingQuoteId, setBookmarkingQuoteId] = useState<string | null>(null);
  const [showCreateListModal, setShowCreateListModal] = useState(false);

  // Derived: array of saved quote IDs for quick lookup
  const savedQuoteIds = savedQuotes.map((sq) => sq.quoteId);

  // Load figures on mount
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

    setDataLoading(true);
    createUserIfNotExists(user.uid, user.email, user.displayName, user.photoURL)
      .then((userData) => {
        setUserData(userData);

        if (userData.following.length === 0) {
          setAppState('onboarding');
          setDataLoading(false);
        } else {
          loadFeedData(user.uid, userData.following);
        }
      })
      .catch((err) => {
        console.error('Error loading user data:', err);
        setDataLoading(false);
      });
  }, [user, authLoading]);

  // Load feed data including likes and lists
  const loadFeedData = async (uid: string, following: string[]) => {
    try {
      const [quotesData, savedData, likedIds, userLists] = await Promise.all([
        getQuotesForFeed(following),
        getUserSavedQuotesWithData(uid),
        getUserLikedQuotes(uid),
        getUserLists(uid),
      ]);

      setQuotes(quotesData);
      setSavedQuotes(savedData.map((sq) => ({ quoteId: sq.quoteId, listId: sq.listId ?? null })));
      setLikedQuoteIds(likedIds);
      setLists(userLists);
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

  // ============ LIKE HANDLERS ============

  const handleLike = async (quoteId: string) => {
    if (!user) return;
    if (likedQuoteIds.includes(quoteId) || likingQuoteIds.has(quoteId)) return;

    setLikingQuoteIds((prev) => new Set(prev).add(quoteId));
    try {
      await likeQuote(user.uid, quoteId);
      setLikedQuoteIds((prev) => (prev.includes(quoteId) ? prev : [...prev, quoteId]));
    } catch (err) {
      console.error('Error liking quote:', err);
    } finally {
      setLikingQuoteIds((prev) => {
        const next = new Set(prev);
        next.delete(quoteId);
        return next;
      });
    }
  };

  const handleUnlike = async (quoteId: string) => {
    if (!user) return;
    if (!likedQuoteIds.includes(quoteId) || likingQuoteIds.has(quoteId)) return;

    setLikingQuoteIds((prev) => new Set(prev).add(quoteId));
    try {
      await unlikeQuote(user.uid, quoteId);
      setLikedQuoteIds((prev) => prev.filter((id) => id !== quoteId));
    } catch (err) {
      console.error('Error unliking quote:', err);
    } finally {
      setLikingQuoteIds((prev) => {
        const next = new Set(prev);
        next.delete(quoteId);
        return next;
      });
    }
  };

  // ============ BOOKMARK HANDLERS ============

  const handleBookmarkClick = (quoteId: string) => {
    setBookmarkingQuoteId(quoteId);
  };

  const handleSaveToList = async (quoteId: string, listId: string | null) => {
    if (!user) return;
    if (savingQuoteIds.has(quoteId)) return;

    setSavingQuoteIds((prev) => new Set(prev).add(quoteId));
    try {
      await saveQuoteToList(user.uid, quoteId, listId);
      setSavedQuotes((prev) => {
        const existing = prev.find((sq) => sq.quoteId === quoteId);
        if (existing) {
          return prev.map((sq) => (sq.quoteId === quoteId ? { ...sq, listId } : sq));
        }
        return [...prev, { quoteId, listId }];
      });
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

  const handleRemoveBookmark = async (quoteId: string) => {
    if (!user) return;
    if (savingQuoteIds.has(quoteId)) return;

    setSavingQuoteIds((prev) => new Set(prev).add(quoteId));
    try {
      await unsaveQuote(user.uid, quoteId);
      setSavedQuotes((prev) => prev.filter((sq) => sq.quoteId !== quoteId));
    } catch (err) {
      console.error('Error removing bookmark:', err);
    } finally {
      setSavingQuoteIds((prev) => {
        const next = new Set(prev);
        next.delete(quoteId);
        return next;
      });
    }
  };

  // ============ LIST HANDLERS ============

  const handleCreateList = async (name: string) => {
    if (!user) return;

    try {
      const listId = await createList(user.uid, name);
      setLists((prev) => [...prev, { id: listId, name, createdAt: new Date() }]);
    } catch (err) {
      console.error('Error creating list:', err);
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!user) return;

    try {
      await deleteList(user.uid, listId);
      setLists((prev) => prev.filter((l) => l.id !== listId));
      // Update saved quotes that were in this list
      setSavedQuotes((prev) =>
        prev.map((sq) => (sq.listId === listId ? { ...sq, listId: null } : sq))
      );
    } catch (err) {
      console.error('Error deleting list:', err);
    }
  };

  // ============ OTHER HANDLERS ============

  const handleShare = useCallback(async (quote: QuoteWithFigure) => {
    await shareQuoteUtil({
      figureName: quote.figure.displayName,
      quoteText: quote.text,
      sourceCitation: quote.sourceCitation,
    });
  }, []);

  const handleExpand = (quote: QuoteWithFigure) => {
    setExpandedQuote(quote);
  };

  const handleCloseModal = () => {
    setExpandedQuote(null);
  };

  const handleSignOut = useCallback(async () => {
    const { signOut } = await import('@/lib/firebase/auth');
    await signOut();
  }, []);

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

  const getOriginalId = (id: string) => id.split('-batch')[0];

  // Get current list ID for a quote
  const getQuoteListId = (quoteId: string): string | null | undefined => {
    const saved = savedQuotes.find((sq) => sq.quoteId === quoteId);
    return saved ? saved.listId : undefined;
  };

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
            likedQuoteIds={likedQuoteIds}
            savedQuoteIds={savedQuoteIds}
            onLike={handleLike}
            onUnlike={handleUnlike}
            onBookmark={handleBookmarkClick}
            onShare={handleShare}
            onExpand={handleExpand}
          />
        );
      case 'bookmarks':
        return (
          <SavedQuotes
            savedQuotes={savedQuotes}
            likedQuoteIds={likedQuoteIds}
            lists={lists}
            quotes={quotes}
            figures={figures}
            onLike={handleLike}
            onUnlike={handleUnlike}
            onBookmark={handleBookmarkClick}
            onExpand={handleExpand}
            onShare={handleShare}
            onCreateList={() => setShowCreateListModal(true)}
            onDeleteList={handleDeleteList}
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
            likedQuoteIds={likedQuoteIds}
            quotes={quotes}
            figures={figures}
            onClose={() => setActiveTab('home')}
            onLike={handleLike}
            onUnlike={handleUnlike}
            onBookmark={handleBookmarkClick}
            onExpand={handleExpand}
            onShare={handleShare}
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
            isLiked={likedQuoteIds.includes(getOriginalId(expandedQuote.id))}
            isBookmarked={savedQuoteIds.includes(getOriginalId(expandedQuote.id))}
            onClose={handleCloseModal}
            onLike={() => {
              const originalId = getOriginalId(expandedQuote.id);
              if (likedQuoteIds.includes(originalId)) {
                handleUnlike(originalId);
              } else {
                handleLike(originalId);
              }
            }}
            onBookmark={() => handleBookmarkClick(getOriginalId(expandedQuote.id))}
            onShare={() => handleShare(expandedQuote)}
          />
        )}

        {/* List Picker Modal */}
        {bookmarkingQuoteId && (
          <ListPickerModal
            lists={lists}
            currentListId={getQuoteListId(bookmarkingQuoteId)}
            isBookmarked={savedQuoteIds.includes(bookmarkingQuoteId)}
            onClose={() => setBookmarkingQuoteId(null)}
            onSaveToList={(listId) => handleSaveToList(bookmarkingQuoteId, listId)}
            onRemoveBookmark={() => handleRemoveBookmark(bookmarkingQuoteId)}
            onCreateList={() => setShowCreateListModal(true)}
          />
        )}

        {/* Create List Modal */}
        {showCreateListModal && (
          <CreateListModal
            onClose={() => setShowCreateListModal(false)}
            onCreate={handleCreateList}
          />
        )}
      </>
    );
  }

  return <LoadingSpinner />;
}
