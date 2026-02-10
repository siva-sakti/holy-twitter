'use client';

import { useState, useEffect, useRef } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { FiExternalLink } from 'react-icons/fi';
import Post from './Post';
import type { Figure, QuoteWithFigure } from '@/lib/types';

interface FigureProfileProps {
  figure: Figure;
  quotes: QuoteWithFigure[];
  savedQuoteIds: string[];
  isFollowing: boolean;
  onBack: () => void;
  onToggleFollow: () => void;
  onSave: (quoteId: string) => void;
  onUnsave: (quoteId: string) => void;
  onExpand: (quote: QuoteWithFigure) => void;
  onShare: (quote: QuoteWithFigure) => void;
  onRepost: (quote: QuoteWithFigure) => void;
}

export default function FigureProfile({
  figure,
  quotes,
  savedQuoteIds,
  isFollowing,
  onBack,
  onToggleFollow,
  onSave,
  onUnsave,
  onExpand,
  onShare,
  onRepost,
}: FigureProfileProps) {
  const [showCompactHeader, setShowCompactHeader] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Show compact header on scroll past profile section
  useEffect(() => {
    const handleScroll = () => {
      if (profileRef.current) {
        const rect = profileRef.current.getBoundingClientRect();
        setShowCompactHeader(rect.bottom < 53);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Sticky Navigation Header */}
      <div className="sticky top-0 z-20 bg-white/85 dark:bg-black/85 backdrop-blur-md">
        <div className="flex items-center gap-8 px-4 h-[53px]">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors"
          >
            <IoArrowBack className="w-5 h-5 text-[#0f1419] dark:text-[#e7e9ea]" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h1 className="text-[20px] font-bold text-[#0f1419] dark:text-[#e7e9ea] truncate">
                {figure.displayName}
              </h1>
              <span className="text-[#d4af37] text-[14px]">✦</span>
            </div>
            {showCompactHeader && (
              <p className="text-[13px] text-[#536471] dark:text-[#71767b]">
                {quotes.length} posts
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div ref={profileRef} className="border-b border-[#eff3f4] dark:border-[#2f3336]">
        {/* Banner area - subtle gradient */}
        <div className="h-32 bg-gradient-to-br from-[#f7f9f9] to-[#eff3f4] dark:from-[#16181c] dark:to-[#1d1f23]" />

        {/* Profile content */}
        <div className="px-4 pb-4 -mt-16">
          {/* Profile pic row */}
          <div className="flex items-end justify-between mb-3">
            <img
              src={figure.profilePicUrl}
              alt={figure.displayName}
              className="w-[88px] h-[88px] rounded-full object-cover border-4 border-white dark:border-black"
            />
            <button
              onClick={onToggleFollow}
              className={`h-9 px-4 text-[15px] font-bold rounded-full transition-colors ${
                isFollowing
                  ? 'text-[#0f1419] dark:text-[#e7e9ea] border border-[#cfd9de] dark:border-[#536471] hover:border-[#f4212e] hover:text-[#f4212e] hover:bg-[#f4212e0a]'
                  : 'text-white bg-[#0f1419] dark:bg-[#eff3f4] dark:text-[#0f1419] hover:opacity-90'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>

          {/* Name and halo */}
          <div className="flex items-center gap-1.5">
            <h2 className="text-[20px] font-extrabold text-[#0f1419] dark:text-[#e7e9ea]">
              {figure.displayName}
            </h2>
            <span className="text-[#d4af37] text-[16px]">✦</span>
          </div>

          {/* Tradition tag */}
          <div className="mt-1">
            <span className="text-[15px] text-[#536471] dark:text-[#71767b]">
              {figure.tradition}
            </span>
          </div>

          {/* Bio */}
          <p className="mt-3 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] leading-[20px] whitespace-pre-wrap">
            {figure.bio}
          </p>

          {/* External Links */}
          {figure.externalLinks && figure.externalLinks.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {figure.externalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[15px] text-[#1d9bf0] hover:underline"
                >
                  <FiExternalLink className="w-4 h-4" />
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Posts Tab */}
      <div className="border-b border-[#eff3f4] dark:border-[#2f3336]">
        <div className="flex">
          <button className="flex-1 py-4 text-[15px] font-bold text-[#0f1419] dark:text-[#e7e9ea] relative hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors">
            Posts
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#0f1419] dark:bg-[#e7e9ea] rounded-full" />
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div>
        {quotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-[15px] text-[#536471] dark:text-[#71767b]">
              No posts yet
            </p>
          </div>
        ) : (
          quotes.map((quote) => (
            <Post
              key={quote.id}
              figure={{
                displayName: quote.figure.displayName,
                profilePicUrl: quote.figure.profilePicUrl,
              }}
              quote={{
                text: quote.text,
                sourceCitation: quote.sourceCitation,
              }}
              timestamp={quote.fakeTimestamp}
              isSaved={savedQuoteIds.includes(quote.id)}
              onSave={() => {
                if (savedQuoteIds.includes(quote.id)) {
                  onUnsave(quote.id);
                } else {
                  onSave(quote.id);
                }
              }}
              onExpand={() => onExpand(quote)}
              onShare={() => onShare(quote)}
              onRepost={() => onRepost(quote)}
            />
          ))
        )}
      </div>
    </div>
  );
}
