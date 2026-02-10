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
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Show sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        setShowStickyHeader(headerBottom < 53);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Sticky Navigation Header */}
      <div className="sticky top-0 z-20 bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-[#eff3f4] dark:border-[#2f3336]">
        <div className="flex items-center gap-6 px-4 h-[53px]">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors"
          >
            <IoArrowBack className="w-5 h-5 text-[#0f1419] dark:text-[#e7e9ea]" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h1 className="text-[20px] font-bold text-[#0f1419] dark:text-[#e7e9ea] truncate">
                {figure.displayName}
              </h1>
              <span className="text-[#d4af37] text-[14px]">✦</span>
            </div>
            <p className="text-[13px] text-[#536471] dark:text-[#71767b]">
              {quotes.length} {quotes.length === 1 ? 'post' : 'posts'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div ref={headerRef} className="px-4 pt-4 pb-4 border-b border-[#eff3f4] dark:border-[#2f3336]">
        {/* Profile pic and follow button row */}
        <div className="flex items-start justify-between mb-3">
          <img
            src={figure.profilePicUrl}
            alt={figure.displayName}
            className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-black"
          />
          <button
            onClick={onToggleFollow}
            className={`px-4 py-1.5 text-[14px] font-bold rounded-full transition-colors ${
              isFollowing
                ? 'text-[#0f1419] dark:text-[#e7e9ea] border border-[#cfd9de] dark:border-[#536471] hover:border-[#f4212e] hover:text-[#f4212e] hover:bg-[#f4212e1a]'
                : 'text-white bg-[#0f1419] dark:bg-[#eff3f4] dark:text-[#0f1419] hover:opacity-90'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Name and halo */}
        <div className="flex items-center gap-1.5 mb-1">
          <h2 className="text-[22px] font-extrabold text-[#0f1419] dark:text-[#e7e9ea]">
            {figure.displayName}
          </h2>
          <span className="text-[#d4af37] text-[16px]" title="Verified Saint">
            ✦
          </span>
        </div>

        {/* Tradition tag */}
        <div className="mb-3">
          <span className="inline-block px-2.5 py-0.5 text-[13px] font-medium text-[#536471] dark:text-[#71767b] bg-[#eff3f4] dark:bg-[#2f3336] rounded-full">
            {figure.tradition}
          </span>
        </div>

        {/* Bio */}
        <p className="text-[15px] text-[#0f1419] dark:text-[#e7e9ea] leading-relaxed mb-3 whitespace-pre-wrap">
          {figure.bio}
        </p>

        {/* External Links */}
        {figure.externalLinks && figure.externalLinks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {figure.externalLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-[#1d9bf0] bg-[#1d9bf00d] hover:bg-[#1d9bf01a] rounded-full transition-colors"
              >
                <FiExternalLink className="w-3.5 h-3.5" />
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Posts Tab Header */}
      <div className="flex border-b border-[#eff3f4] dark:border-[#2f3336]">
        <button className="flex-1 py-4 text-[15px] font-medium text-[#0f1419] dark:text-[#e7e9ea] relative">
          Posts
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full" />
        </button>
      </div>

      {/* Posts List */}
      <div>
        {quotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-[#536471] dark:text-[#71767b] text-[15px]">
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
