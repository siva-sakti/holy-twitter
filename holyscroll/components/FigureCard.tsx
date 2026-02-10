'use client';

import { FaCheck } from 'react-icons/fa';
import type { Figure } from '@/lib/types';

interface FigureCardProps {
  figure: Figure;
  isSelected: boolean;
  onToggle: () => void;
}

export default function FigureCard({
  figure,
  isSelected,
  onToggle,
}: FigureCardProps) {
  // Truncate bio to ~60 characters
  const bioPreview =
    figure.bio.length > 60 ? figure.bio.slice(0, 60).trim() + '...' : figure.bio;

  return (
    <button
      onClick={onToggle}
      className={`relative w-full p-3 rounded-2xl border transition-all text-left ${
        isSelected
          ? 'border-[#1d9bf0] bg-[#f7f9f9] dark:bg-[#16181c]'
          : 'border-[#eff3f4] dark:border-[#2f3336] bg-white dark:bg-black hover:bg-[#f7f9f9] dark:hover:bg-[#16181c]'
      }`}
    >
      {/* Selected checkmark */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-[#1d9bf0] rounded-full flex items-center justify-center">
          <FaCheck className="w-2.5 h-2.5 text-white" />
        </div>
      )}

      {/* Content */}
      <div className="flex items-start gap-3">
        <img
          src={figure.profilePicUrl}
          alt={figure.displayName}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0 pr-6">
          {/* Name + halo */}
          <div className="flex items-center gap-1">
            <span className="font-bold text-[15px] text-[#0f1419] dark:text-[#e7e9ea] truncate">
              {figure.displayName}
            </span>
            <span className="text-[#d4af37] text-[11px]">✦</span>
          </div>

          {/* Tradition tag */}
          <span className="inline-block mt-0.5 px-2 py-0.5 text-[12px] font-medium text-[#536471] dark:text-[#71767b] bg-[#eff3f4] dark:bg-[#2f3336] rounded-full">
            {figure.tradition}
          </span>

          {/* Bio preview */}
          <p className="mt-1.5 text-[13px] text-[#536471] dark:text-[#71767b] leading-4">{bioPreview}</p>
        </div>
      </div>
    </button>
  );
}
