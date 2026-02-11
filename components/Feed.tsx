'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { IoSparkles } from 'react-icons/io5';
import Post from './Post';
import { shuffle, generateFakeTimestamp } from '@/lib/utils/shuffle';
import type { Quote, Figure, QuoteWithFigure } from '@/lib/types';

interface FeedProps {
  quotes: Quote[];
  figures: Figure[];
  likedQuoteIds: string[];
  savedQuoteIds: string[];
  onLike: (quoteId: string) => void;
  onUnlike: (quoteId: string) => void;
  onBookmark: (quoteId: string) => void;
  onShare: (quote: QuoteWithFigure) => void;
  onExpand: (quote: QuoteWithFigure) => void;
}

// Helper to enrich quotes with figure data
function enrichQuotesWithFigures(
  quotes: Quote[],
  figureMap: Map<string, Figure>
): QuoteWithFigure[] {
  return quotes
    .map((quote) => {
      const figure = figureMap.get(quote.figureId);
      if (!figure) return null;
      return {
        ...quote,
        figure,
        fakeTimestamp: generateFakeTimestamp(),
      };
    })
    .filter((q): q is QuoteWithFigure => q !== null);
}

export default function Feed({
  quotes,
  figures,
  likedQuoteIds,
  savedQuoteIds,
  onLike,
  onUnlike,
  onBookmark,
  onShare,
  onExpand,
}: FeedProps) {
  const [displayedQuotes, setDisplayedQuotes] = useState<QuoteWithFigure[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const batchCountRef = useRef(0);

  // Memoize the figure map to avoid recreating on every render
  const figureMap = useMemo(
    () => new Map(figures.map((f) => [f.id, f])),
    [figures]
  );

  // Generate a new batch of shuffled quotes
  const generateBatch = useCallback(() => {
    const enriched = enrichQuotesWithFigures(quotes, figureMap);
    return shuffle(enriched);
  }, [quotes, figureMap]);

  // Initial load
  useEffect(() => {
    if (quotes.length === 0 || figures.length === 0) return;
    setDisplayedQuotes(generateBatch());
    batchCountRef.current = 1;
  }, [quotes, figureMap, generateBatch]);

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedQuotes.length > 0) {
          // Append a new shuffled batch
          const newBatch = generateBatch().map((q, i) => ({
            ...q,
            id: `${q.id}-batch${batchCountRef.current}-${i}`,
          }));
          batchCountRef.current += 1;
          setDisplayedQuotes((prev) => [...prev, ...newBatch]);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [displayedQuotes.length, generateBatch]);

  // Track scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setDisplayedQuotes(generateBatch());
      batchCountRef.current = 1;
      setIsRefreshing(false);
    }, 300);
  }, [generateBatch]);

  if (displayedQuotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <p className="text-[#536471] dark:text-[#71767b] text-[15px] mb-1">
          Your feed is empty
        </p>
        <p className="text-[#536471] dark:text-[#71767b] text-[13px]">
          Follow some figures to see their wisdom here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Sticky Header */}
      <div
        className={`sticky top-0 z-10 bg-white/85 dark:bg-black/85 backdrop-blur-md transition-shadow ${
          hasScrolled
            ? 'border-b border-[#eff3f4] dark:border-[#2f3336]'
            : 'border-b border-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-[53px]">
          <h1 className="text-[20px] font-bold text-[#0f1419] dark:text-[#e7e9ea]">
            Home
          </h1>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 -mr-2 rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors disabled:opacity-50"
            aria-label="Refresh feed"
          >
            <IoSparkles
              className={`w-5 h-5 text-[#536471] dark:text-[#71767b] ${
                isRefreshing ? 'animate-pulse' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Posts */}
      <div>
        {displayedQuotes.map((quote) => {
          const originalId = quote.id.split('-batch')[0];
          return (
            <Post
              key={quote.id}
              figure={{
                id: quote.figure.id,
                displayName: quote.figure.displayName,
                profilePicUrl: quote.figure.profilePicUrl,
              }}
              quote={{
                text: quote.text,
                sourceCitation: quote.sourceCitation,
              }}
              timestamp={quote.fakeTimestamp}
              isLiked={likedQuoteIds.includes(originalId)}
              isBookmarked={savedQuoteIds.includes(originalId)}
              onLike={() => {
                if (likedQuoteIds.includes(originalId)) {
                  onUnlike(originalId);
                } else {
                  onLike(originalId);
                }
              }}
              onBookmark={() => onBookmark(originalId)}
              onExpand={() => onExpand(quote)}
              onShare={() => onShare(quote)}
            />
          );
        })}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="h-1" />
    </div>
  );
}
