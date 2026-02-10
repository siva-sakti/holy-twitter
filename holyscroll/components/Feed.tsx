'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { IoSparkles, IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import Post from './Post';
import { shuffle, generateFakeTimestamp } from '@/lib/utils/shuffle';
import type { Quote, Figure, QuoteWithFigure } from '@/lib/types';

interface FeedProps {
  quotes: Quote[];
  figures: Figure[];
  savedQuoteIds: string[];
  userPhotoUrl?: string;
  onSave: (quoteId: string) => void;
  onUnsave: (quoteId: string) => void;
  onShare: (quote: QuoteWithFigure) => void;
  onRepost: (quote: QuoteWithFigure) => void;
  onExpand: (quote: QuoteWithFigure) => void;
  onSignOut?: () => void;
  onResetOnboarding?: () => void;
  onShowProfile?: () => void;
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
  savedQuoteIds,
  userPhotoUrl,
  onSave,
  onUnsave,
  onShare,
  onRepost,
  onExpand,
  onSignOut,
  onResetOnboarding,
  onShowProfile,
}: FeedProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Load theme on mount
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
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
            // Give each quote a unique key by appending batch number
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

  // Refresh handler - resets to fresh batch
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
        <p className="text-[#536471] text-[15px] mb-1">Your feed is empty</p>
        <p className="text-[#536471] text-[13px]">
          Follow some figures to see their wisdom here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Sticky Header - X style */}
      <div
        className={`sticky top-0 z-10 bg-white/85 dark:bg-black/85 backdrop-blur-md border-b transition-shadow ${
          hasScrolled ? 'shadow-sm border-[#eff3f4] dark:border-[#2f3336]' : 'border-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-[53px]">
          {/* Profile pic / menu trigger */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
            >
              {userPhotoUrl ? (
                <img src={userPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#536471] flex items-center justify-center text-white text-sm font-bold">
                  ?
                </div>
              )}
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute top-10 left-0 z-20 bg-white dark:bg-[#16181c] rounded-xl shadow-lg border border-[#eff3f4] dark:border-[#2f3336] py-2 min-w-[200px]">
                  {onShowProfile && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onShowProfile();
                      }}
                      className="w-full px-4 py-3 text-left text-[15px] text-[#0f1419] dark:text-[#e7e9ea] hover:bg-[#f7f9f9] dark:hover:bg-[#1d1f23] transition-colors"
                    >
                      My profile
                    </button>
                  )}
                  <button
                    onClick={() => {
                      toggleTheme();
                    }}
                    className="w-full px-4 py-3 text-left text-[15px] text-[#0f1419] dark:text-[#e7e9ea] hover:bg-[#f7f9f9] dark:hover:bg-[#1d1f23] transition-colors flex items-center gap-3"
                  >
                    {isDark ? (
                      <>
                        <IoSunnyOutline className="w-5 h-5" />
                        Light mode
                      </>
                    ) : (
                      <>
                        <IoMoonOutline className="w-5 h-5" />
                        Dark mode
                      </>
                    )}
                  </button>
                  {onResetOnboarding && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onResetOnboarding();
                      }}
                      className="w-full px-4 py-3 text-left text-[15px] text-[#0f1419] dark:text-[#e7e9ea] hover:bg-[#f7f9f9] dark:hover:bg-[#1d1f23] transition-colors"
                    >
                      Change who you follow
                    </button>
                  )}
                  {onSignOut && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onSignOut();
                      }}
                      className="w-full px-4 py-3 text-left text-[15px] text-[#f4212e] hover:bg-[#f7f9f9] dark:hover:bg-[#1d1f23] transition-colors"
                    >
                      Sign out
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          <h1 className="text-[20px] font-bold text-[#0f1419] dark:text-[#e7e9ea]">Home</h1>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 -mr-2 rounded-full hover:bg-[#0f14190a] transition-colors disabled:opacity-50"
            aria-label="Refresh feed"
          >
            <IoSparkles
              className={`w-5 h-5 text-[#536471] ${
                isRefreshing ? 'animate-pulse' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Posts */}
      <div>
        {displayedQuotes.map((quote) => {
          // Extract original quote ID for save state
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
              isSaved={savedQuoteIds.includes(originalId)}
              onSave={() => {
                if (savedQuoteIds.includes(originalId)) {
                  onUnsave(originalId);
                } else {
                  onSave(originalId);
                }
              }}
              onExpand={() => onExpand(quote)}
              onShare={() => onShare(quote)}
              onRepost={() => onRepost(quote)}
            />
          );
        })}
      </div>

      {/* Infinite scroll trigger - invisible sentinel */}
      <div ref={loadMoreRef} className="h-1" />
    </div>
  );
}
