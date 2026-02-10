'use client';

import { useEffect } from 'react';
import { FaRegComment, FaRetweet, FaRegHeart, FaHeart } from 'react-icons/fa';
import { FiShare } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import type { QuoteWithFigure } from '@/lib/types';

interface PostModalProps {
  quote: QuoteWithFigure;
  isSaved: boolean;
  onClose: () => void;
  onSave: () => void;
  onRepost: () => void;
  onShare: () => void;
}

export default function PostModal({
  quote,
  isSaved,
  onClose,
  onSave,
  onRepost,
  onShare,
}: PostModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-xl bg-white dark:bg-black sm:rounded-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300 sm:animate-in sm:zoom-in-95 sm:slide-in-from-bottom-0">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 h-[53px] border-b border-[#eff3f4] dark:border-[#2f3336] bg-white dark:bg-black">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors"
          >
            <IoClose className="w-5 h-5 text-[#0f1419] dark:text-[#e7e9ea]" />
          </button>
          <span className="text-[17px] font-bold text-[#0f1419] dark:text-[#e7e9ea]">Post</span>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-53px-60px)]">
          {/* Author info */}
          <div className="flex items-start gap-3">
            <img
              src={quote.figure.profilePicUrl}
              alt={quote.figure.displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-[17px] text-[#0f1419] dark:text-[#e7e9ea]">
                  {quote.figure.displayName}
                </span>
                <span className="text-[#d4af37] text-[13px]">✦</span>
              </div>
              <div className="flex items-center gap-1 text-[15px] text-[#536471] dark:text-[#71767b]">
                <span>{quote.sourceCitation}</span>
                <span>·</span>
                <span>{quote.fakeTimestamp}</span>
              </div>
            </div>
          </div>

          {/* Quote text - full, no truncation */}
          <div className="mt-4 text-[23px] leading-7 text-[#0f1419] dark:text-[#e7e9ea] whitespace-pre-wrap">
            {quote.text}
          </div>

          {/* Timestamp row */}
          <div className="mt-4 py-4 border-t border-[#eff3f4] dark:border-[#2f3336]">
            <span className="text-[15px] text-[#536471] dark:text-[#71767b]">
              From {quote.figure.tradition} tradition
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="sticky bottom-0 flex items-center justify-around px-4 py-3 border-t border-[#eff3f4] dark:border-[#2f3336] bg-white dark:bg-black">
          {/* Comment (decorative) */}
          <button className="group flex items-center" disabled>
            <div className="p-3 rounded-full group-hover:bg-[#1d9bf01a] transition-colors">
              <FaRegComment className="w-[22px] h-[22px] text-[#536471] dark:text-[#71767b]" />
            </div>
          </button>

          {/* Repost */}
          <button className="group flex items-center" onClick={onRepost}>
            <div className="p-3 rounded-full group-hover:bg-[#00ba7c1a] transition-colors">
              <FaRetweet className="w-[22px] h-[22px] text-[#536471] dark:text-[#71767b] group-hover:text-[#00ba7c]" />
            </div>
          </button>

          {/* Save/Heart */}
          <button className="group flex items-center" onClick={onSave}>
            <div className={`p-3 rounded-full transition-colors ${isSaved ? '' : 'group-hover:bg-[#f918801a]'}`}>
              {isSaved ? (
                <FaHeart className="w-[22px] h-[22px] text-[#f91880]" />
              ) : (
                <FaRegHeart className="w-[22px] h-[22px] text-[#536471] dark:text-[#71767b] group-hover:text-[#f91880]" />
              )}
            </div>
          </button>

          {/* Share */}
          <button className="group flex items-center" onClick={onShare}>
            <div className="p-3 rounded-full group-hover:bg-[#1d9bf01a] transition-colors">
              <FiShare className="w-[22px] h-[22px] text-[#536471] dark:text-[#71767b] group-hover:text-[#1d9bf0]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
