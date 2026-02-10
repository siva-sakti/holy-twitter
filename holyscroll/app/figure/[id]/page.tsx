'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import FigureProfile from '@/components/FigureProfile';
import PostModal from '@/components/PostModal';
import {
  getFigureById,
  getQuotesByFigure,
  getUserData,
  getUserSavedQuotes,
  saveQuote,
  unsaveQuote,
  followFigure,
  unfollowFigure,
} from '@/lib/firebase/firestore';
import { shuffle, generateFakeTimestamp } from '@/lib/utils/shuffle';
import type { Figure, Quote, QuoteWithFigure } from '@/lib/types';

export default function FigurePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const figureId = params.id as string;

  const [figure, setFigure] = useState<Figure | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [savedQuoteIds, setSavedQuoteIds] = useState<string[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedQuote, setExpandedQuote] = useState<QuoteWithFigure | null>(null);

  // Load figure data
  useEffect(() => {
    async function loadData() {
      try {
        const [figureData, quotesData] = await Promise.all([
          getFigureById(figureId),
          getQuotesByFigure(figureId),
        ]);

        if (!figureData) {
          router.push('/');
          return;
        }

        setFigure(figureData);
        setQuotes(shuffle(quotesData));

        // Load user-specific data if logged in
        if (user) {
          const [userData, savedIds] = await Promise.all([
            getUserData(user.uid),
            getUserSavedQuotes(user.uid),
          ]);

          if (userData) {
            setIsFollowing(userData.following.includes(figureId));
          }
          setSavedQuoteIds(savedIds);
        }
      } catch (err) {
        console.error('Error loading figure:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [figureId, user, router]);

  // Enrich quotes with figure data
  const enrichedQuotes = useMemo(() => {
    if (!figure) return [];
    return quotes.map((quote) => ({
      ...quote,
      figure,
      fakeTimestamp: generateFakeTimestamp(),
    }));
  }, [quotes, figure]);

  // Handle follow/unfollow
  const handleToggleFollow = async () => {
    if (!user) return;

    try {
      if (isFollowing) {
        await unfollowFigure(user.uid, figureId);
        setIsFollowing(false);
      } else {
        await followFigure(user.uid, figureId);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  // Handle save quote
  const handleSave = async (quoteId: string) => {
    if (!user) return;
    try {
      await saveQuote(user.uid, quoteId);
      setSavedQuoteIds((prev) => [...prev, quoteId]);
    } catch (err) {
      console.error('Error saving quote:', err);
    }
  };

  // Handle unsave quote
  const handleUnsave = async (quoteId: string) => {
    if (!user) return;
    try {
      await unsaveQuote(user.uid, quoteId);
      setSavedQuoteIds((prev) => prev.filter((id) => id !== quoteId));
    } catch (err) {
      console.error('Error unsaving quote:', err);
    }
  };

  // Handle share
  const handleShare = (quote: QuoteWithFigure) => {
    console.log('Share quote:', quote);
  };

  // Handle repost
  const handleRepost = (quote: QuoteWithFigure) => {
    console.log('Repost quote:', quote);
  };

  // Handle expand
  const handleExpand = (quote: QuoteWithFigure) => {
    setExpandedQuote(quote);
  };

  // Handle back
  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
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
        </div>
      </div>
    );
  }

  if (!figure) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-xl mx-auto border-x border-[#eff3f4] dark:border-[#2f3336] min-h-screen">
        <FigureProfile
          figure={figure}
          quotes={enrichedQuotes}
          savedQuoteIds={savedQuoteIds}
          isFollowing={isFollowing}
          onBack={handleBack}
          onToggleFollow={handleToggleFollow}
          onSave={handleSave}
          onUnsave={handleUnsave}
          onExpand={handleExpand}
          onShare={handleShare}
          onRepost={handleRepost}
        />
      </div>

      {/* Post Modal */}
      {expandedQuote && (
        <PostModal
          quote={expandedQuote}
          isSaved={savedQuoteIds.includes(expandedQuote.id)}
          onClose={() => setExpandedQuote(null)}
          onSave={() => {
            if (savedQuoteIds.includes(expandedQuote.id)) {
              handleUnsave(expandedQuote.id);
            } else {
              handleSave(expandedQuote.id);
            }
          }}
          onRepost={() => handleRepost(expandedQuote)}
          onShare={() => handleShare(expandedQuote)}
        />
      )}
    </main>
  );
}
