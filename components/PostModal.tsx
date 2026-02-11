'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { FiShare } from 'react-icons/fi';
import { IoArrowBack, IoBookmarkOutline, IoBookmark } from 'react-icons/io5';
import type { QuoteWithFigure } from '@/lib/types';

interface PostModalProps {
  quote: QuoteWithFigure;
  isLiked: boolean;
  isBookmarked: boolean;
  onClose: () => void;
  onLike: () => void;
  onBookmark: () => void;
  onShare: () => void;
}

// Format timestamp like X: "8:02 AM · Feb 10, 2026"
function formatFullTimestamp(): string {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  const minuteStr = minutes.toString().padStart(2, '0');

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[now.getMonth()];
  const day = now.getDate();
  const year = now.getFullYear();

  return `${hour12}:${minuteStr} ${ampm} · ${month} ${day}, ${year}`;
}

export default function PostModal({
  quote,
  isLiked,
  isBookmarked,
  onClose,
  onLike,
  onBookmark,
  onShare,
}: PostModalProps) {
  const router = useRouter();

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

  // Navigate to figure profile
  const handleFigureClick = () => {
    onClose();
    router.push(`/figure/${quote.figure.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-[600px] bg-white dark:bg-black sm:rounded-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-200 sm:animate-in sm:zoom-in-95 sm:slide-in-from-bottom-0">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center px-4 h-[53px] bg-white dark:bg-black">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors"
          >
            <IoArrowBack className="w-5 h-5 text-[#0f1419] dark:text-[#e7e9ea]" />
          </button>
          <h1 className="ml-6 text-[20px] font-bold text-[#0f1419] dark:text-[#e7e9ea]">
            Post
          </h1>
        </div>

        {/* Content */}
        <div className="px-4 pb-4 overflow-y-auto max-h-[calc(90vh-53px-64px)]">
          {/* Author row */}
          <div className="flex gap-3">
            {/* Profile pic */}
            <button
              onClick={handleFigureClick}
              className="flex-shrink-0 hover:opacity-80 transition-opacity"
            >
              <img
                src={quote.figure.profilePicUrl}
                alt={quote.figure.displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
            </button>

            {/* Name and handle */}
            <div className="flex flex-col justify-center min-w-0">
              <button
                onClick={handleFigureClick}
                className="flex items-center gap-1 hover:underline"
              >
                <span className="font-bold text-[15px] text-[#0f1419] dark:text-[#e7e9ea] truncate">
                  {quote.figure.displayName}
                </span>
                <span className="text-[#d4af37] text-[12px]">✦</span>
              </button>
              <span className="text-[15px] text-[#536471] dark:text-[#71767b] truncate">
                {quote.sourceCitation}
              </span>
            </div>
          </div>

          {/* Quote text */}
          <div className="mt-4 text-[17px] leading-[24px] text-[#0f1419] dark:text-[#e7e9ea] whitespace-pre-wrap break-words">
            {quote.text}
          </div>

          {/* Timestamp */}
          <div className="mt-4 pt-4 border-t border-[#eff3f4] dark:border-[#2f3336]">
            <span className="text-[15px] text-[#536471] dark:text-[#71767b]">
              {formatFullTimestamp()}
            </span>
          </div>
        </div>

        {/* Action buttons - 3 buttons */}
        <div className="flex items-center justify-around px-4 py-3 border-t border-[#eff3f4] dark:border-[#2f3336] bg-white dark:bg-black">
          {/* Like/Heart */}
          <button
            onClick={onLike}
            className="group flex items-center gap-1"
          >
            <div className={`p-2 rounded-full transition-colors ${isLiked ? '' : 'group-hover:bg-[#f918801a]'}`}>
              {isLiked ? (
                <FaHeart className="w-5 h-5 text-[#f91880]" />
              ) : (
                <FaRegHeart className="w-5 h-5 text-[#536471] dark:text-[#71767b] group-hover:text-[#f91880]" />
              )}
            </div>
            <span className={`text-[13px] ${isLiked ? 'text-[#f91880]' : 'text-[#536471] dark:text-[#71767b] group-hover:text-[#f91880]'}`}>
              {isLiked ? 'Liked' : 'Like'}
            </span>
          </button>

          {/* Bookmark */}
          <button
            onClick={onBookmark}
            className="group flex items-center gap-1"
          >
            <div className={`p-2 rounded-full transition-colors ${isBookmarked ? '' : 'group-hover:bg-[#1d9bf01a]'}`}>
              {isBookmarked ? (
                <IoBookmark className="w-5 h-5 text-[#1d9bf0]" />
              ) : (
                <IoBookmarkOutline className="w-5 h-5 text-[#536471] dark:text-[#71767b] group-hover:text-[#1d9bf0]" />
              )}
            </div>
            <span className={`text-[13px] ${isBookmarked ? 'text-[#1d9bf0]' : 'text-[#536471] dark:text-[#71767b] group-hover:text-[#1d9bf0]'}`}>
              {isBookmarked ? 'Saved' : 'Save'}
            </span>
          </button>

          {/* Share */}
          <button
            onClick={onShare}
            className="group flex items-center gap-1"
          >
            <div className="p-2 rounded-full group-hover:bg-[#00ba7c1a] transition-colors">
              <FiShare className="w-5 h-5 text-[#536471] dark:text-[#71767b] group-hover:text-[#00ba7c]" />
            </div>
            <span className="text-[13px] text-[#536471] dark:text-[#71767b] group-hover:text-[#00ba7c]">
              Share
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
