'use client';

import { useState, useMemo } from 'react';
import { IoAdd, IoTrashOutline } from 'react-icons/io5';
import Post from './Post';
import { generateFakeTimestamp } from '@/lib/utils/shuffle';
import type { Quote, Figure, QuoteWithFigure } from '@/lib/types';
import type { ListData } from '@/lib/firebase/firestore';

interface SavedQuoteData {
  quoteId: string;
  listId: string | null;
}

interface SavedQuotesProps {
  savedQuotes: SavedQuoteData[];
  likedQuoteIds: string[];
  lists: ListData[];
  quotes: Quote[];
  figures: Figure[];
  onLike: (quoteId: string) => void;
  onUnlike: (quoteId: string) => void;
  onBookmark: (quoteId: string) => void;
  onExpand: (quote: QuoteWithFigure) => void;
  onShare: (quote: QuoteWithFigure) => void;
  onCreateList: () => void;
  onDeleteList: (listId: string) => void;
}

export default function SavedQuotes({
  savedQuotes,
  likedQuoteIds,
  lists,
  quotes,
  figures,
  onLike,
  onUnlike,
  onBookmark,
  onExpand,
  onShare,
  onCreateList,
  onDeleteList,
}: SavedQuotesProps) {
  const [selectedListId, setSelectedListId] = useState<string | null>(null); // null = All

  // Create figure map for enriching quotes
  const figureMap = useMemo(
    () => new Map(figures.map((f) => [f.id, f])),
    [figures]
  );

  // Get saved quotes with figure data, filtered by list
  const filteredQuotes = useMemo(() => {
    const filteredSaved = selectedListId === null
      ? savedQuotes
      : savedQuotes.filter((sq) => sq.listId === selectedListId);

    return filteredSaved
      .map((saved) => {
        const quote = quotes.find((q) => q.id === saved.quoteId);
        if (!quote) return null;
        const figure = figureMap.get(quote.figureId);
        if (!figure) return null;
        return {
          ...quote,
          figure,
          fakeTimestamp: generateFakeTimestamp(),
          listId: saved.listId,
        } as QuoteWithFigure & { listId: string | null };
      })
      .filter((q): q is QuoteWithFigure & { listId: string | null } => q !== null);
  }, [savedQuotes, selectedListId, quotes, figureMap]);

  // Get counts for each list
  const listCounts = useMemo(() => {
    const counts = new Map<string | null, number>();
    counts.set(null, savedQuotes.length); // All
    lists.forEach((list) => {
      counts.set(list.id, savedQuotes.filter((sq) => sq.listId === list.id).length);
    });
    return counts;
  }, [savedQuotes, lists]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-[#eff3f4] dark:border-[#2f3336]">
        <div className="px-4 h-[53px] flex items-center justify-between">
          <h1 className="text-[20px] font-bold text-[#0f1419] dark:text-[#e7e9ea]">
            Saved
          </h1>
          <button
            onClick={onCreateList}
            className="p-2 -mr-2 rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors"
            title="Create new list"
          >
            <IoAdd className="w-5 h-5 text-[#536471] dark:text-[#71767b]" />
          </button>
        </div>

        {/* List Filter Tabs */}
        {(lists.length > 0 || savedQuotes.length > 0) && (
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
            {/* All tab */}
            <button
              onClick={() => setSelectedListId(null)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[14px] font-medium transition-colors ${
                selectedListId === null
                  ? 'bg-[#0f1419] dark:bg-[#eff3f4] text-white dark:text-[#0f1419]'
                  : 'bg-[#eff3f4] dark:bg-[#2f3336] text-[#0f1419] dark:text-[#e7e9ea] hover:bg-[#e1e8ed] dark:hover:bg-[#3a3f44]'
              }`}
            >
              All ({listCounts.get(null) || 0})
            </button>

            {/* List tabs */}
            {lists.map((list) => (
              <div key={list.id} className="flex-shrink-0 flex items-center gap-1">
                <button
                  onClick={() => setSelectedListId(list.id)}
                  className={`px-4 py-1.5 rounded-full text-[14px] font-medium transition-colors ${
                    selectedListId === list.id
                      ? 'bg-[#0f1419] dark:bg-[#eff3f4] text-white dark:text-[#0f1419]'
                      : 'bg-[#eff3f4] dark:bg-[#2f3336] text-[#0f1419] dark:text-[#e7e9ea] hover:bg-[#e1e8ed] dark:hover:bg-[#3a3f44]'
                  }`}
                >
                  {list.name} ({listCounts.get(list.id) || 0})
                </button>
                {selectedListId === list.id && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete list "${list.name}"? Quotes won't be deleted.`)) {
                        onDeleteList(list.id);
                        setSelectedListId(null);
                      }
                    }}
                    className="p-1 rounded-full hover:bg-[#f4212e1a] transition-colors"
                    title="Delete list"
                  >
                    <IoTrashOutline className="w-4 h-4 text-[#f4212e]" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {filteredQuotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <h2 className="text-[31px] font-extrabold text-[#0f1419] dark:text-[#e7e9ea] mb-2">
            {selectedListId ? 'This list is empty' : 'Save quotes for later'}
          </h2>
          <p className="text-[15px] text-[#536471] dark:text-[#71767b] max-w-[320px]">
            {selectedListId
              ? 'Add quotes to this list by tapping the bookmark icon on any quote.'
              : 'Tap the bookmark icon on any quote to save it here. Build your personal collection of wisdom.'}
          </p>
        </div>
      ) : (
        <div>
          {filteredQuotes.map((quote) => (
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
              isLiked={likedQuoteIds.includes(quote.id)}
              isBookmarked={true}
              onLike={() => {
                if (likedQuoteIds.includes(quote.id)) {
                  onUnlike(quote.id);
                } else {
                  onLike(quote.id);
                }
              }}
              onBookmark={() => onBookmark(quote.id)}
              onExpand={() => onExpand(quote)}
              onShare={() => onShare(quote)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
