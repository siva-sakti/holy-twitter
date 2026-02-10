'use client';

import { useRouter } from 'next/navigation';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { FiShare } from 'react-icons/fi';

interface PostProps {
  figure: {
    id?: string;
    displayName: string;
    profilePicUrl: string;
  };
  quote: {
    text: string;
    sourceCitation: string;
  };
  timestamp: string;
  isSaved: boolean;
  onSave: () => void;
  onExpand: () => void;
  onShare: () => void;
  onRepost: () => void;
}

const MAX_PREVIEW_LENGTH = 280;

export default function Post({
  figure,
  quote,
  timestamp,
  isSaved,
  onSave,
  onExpand,
  onShare,
}: PostProps) {
  const router = useRouter();
  const isLongPost = quote.text.length > MAX_PREVIEW_LENGTH;
  const displayText = isLongPost
    ? quote.text.slice(0, MAX_PREVIEW_LENGTH).trim()
    : quote.text;

  const handlePostClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.action-buttons')) {
      return;
    }
    if ((e.target as HTMLElement).closest('.figure-link')) {
      return;
    }
    onExpand();
  };

  const handleFigureClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (figure.id) {
      router.push(`/figure/${figure.id}`);
    }
  };

  return (
    <article
      onClick={handlePostClick}
      className="flex gap-3 px-4 py-3 border-b border-[#eff3f4] dark:border-[#2f3336] hover:bg-[#00000008] dark:hover:bg-[#ffffff08] cursor-pointer transition-colors"
    >
      {/* Profile Picture - exactly 40px like X */}
      <div className="flex-shrink-0 figure-link">
        <button
          onClick={handleFigureClick}
          className={`block ${figure.id ? 'cursor-pointer hover:opacity-90' : ''}`}
          disabled={!figure.id}
        >
          <img
            src={figure.profilePicUrl}
            alt={figure.displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header Row - tighter spacing */}
        <div className="flex items-center gap-1 text-[15px] leading-5">
          <button
            onClick={handleFigureClick}
            className={`figure-link font-bold text-[#0f1419] dark:text-[#e7e9ea] truncate ${figure.id ? 'hover:underline cursor-pointer' : ''}`}
            disabled={!figure.id}
          >
            {figure.displayName}
          </button>
          <span className="text-[#d4af37] text-[11px]">✦</span>
          <span className="text-[#536471] dark:text-[#71767b]">·</span>
          <span className="text-[#536471] dark:text-[#71767b] truncate">{quote.sourceCitation}</span>
          <span className="text-[#536471] dark:text-[#71767b]">·</span>
          <span className="text-[#536471] dark:text-[#71767b] flex-shrink-0">{timestamp}</span>
        </div>

        {/* Quote Text */}
        <div className="mt-0.5 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] leading-5 whitespace-pre-wrap break-words">
          {displayText}
          {isLongPost && (
            <>
              {'... '}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand();
                }}
                className="text-[#1d9bf0] hover:underline"
              >
                Show more
              </button>
            </>
          )}
        </div>

        {/* Action Buttons - minimal, just save and share */}
        <div className="action-buttons flex items-center gap-0 mt-3 -ml-2">
          {/* Save/Heart */}
          <button
            className="group flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
          >
            <div
              className={`p-2 rounded-full transition-colors ${
                isSaved ? '' : 'group-hover:bg-[#f918801a]'
              }`}
            >
              {isSaved ? (
                <FaHeart className="w-[18px] h-[18px] text-[#f91880]" />
              ) : (
                <FaRegHeart className="w-[18px] h-[18px] text-[#536471] dark:text-[#71767b] group-hover:text-[#f91880]" />
              )}
            </div>
          </button>

          {/* Share */}
          <button
            className="group flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
          >
            <div className="p-2 rounded-full group-hover:bg-[#1d9bf01a] transition-colors">
              <FiShare className="w-[18px] h-[18px] text-[#536471] dark:text-[#71767b] group-hover:text-[#1d9bf0]" />
            </div>
          </button>
        </div>
      </div>
    </article>
  );
}
