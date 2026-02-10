'use client';

import { useMemo } from 'react';
import Post from './Post';
import { generateFakeTimestamp } from '@/lib/utils/shuffle';
import type { Quote, Figure, QuoteWithFigure } from '@/lib/types';

interface SavedQuotesProps {
  savedQuoteIds: string[];
  quotes: Quote[];
  figures: Figure[];
  onSave: (quoteId: string) => void;
  onUnsave: (quoteId: string) => void;
  onExpand: (quote: QuoteWithFigure) => void;
  onShare: (quote: QuoteWithFigure) => void;
  onRepost: (quote: QuoteWithFigure) => void;
}

export default function SavedQuotes({
  savedQuoteIds,
  quotes,
  figures,
  onUnsave,
  onExpand,
  onShare,
  onRepost,
}: SavedQuotesProps) {
  // Create figure map for enriching quotes
  const figureMap = useMemo(
    () => new Map(figures.map((f) => [f.id, f])),
    [figures]
  );

  // Get saved quotes with figure data
  const savedQuotes = useMemo(() => {
    return savedQuoteIds
      .map((quoteId) => {
        const quote = quotes.find((q) => q.id === quoteId);
        if (!quote) return null;
        const figure = figureMap.get(quote.figureId);
        if (!figure) return null;
        return {
          ...quote,
          figure,
          fakeTimestamp: generateFakeTimestamp(),
        } as QuoteWithFigure;
      })
      .filter((q): q is QuoteWithFigure => q !== null);
  }, [savedQuoteIds, quotes, figureMap]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-[#eff3f4] dark:border-[#2f3336]">
        <div className="px-4 h-[53px] flex items-center">
          <h1 className="text-[20px] font-bold text-[#0f1419] dark:text-[#e7e9ea]">
            Saved
          </h1>
        </div>
      </div>

      {/* Content */}
      {savedQuotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <h2 className="text-[31px] font-extrabold text-[#0f1419] dark:text-[#e7e9ea] mb-2">
            Save quotes for later
          </h2>
          <p className="text-[15px] text-[#536471] dark:text-[#71767b] max-w-[320px]">
            Tap the heart on any quote to save it here. Build your personal collection of wisdom.
          </p>
        </div>
      ) : (
        <div>
          {savedQuotes.map((quote) => (
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
              isSaved={true}
              onSave={() => onUnsave(quote.id)}
              onExpand={() => onExpand(quote)}
              onShare={() => onShare(quote)}
              onRepost={() => onRepost(quote)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
