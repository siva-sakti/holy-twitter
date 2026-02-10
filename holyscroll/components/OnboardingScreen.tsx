'use client';

import { useState } from 'react';
import FigureCard from './FigureCard';
import { updateUserFollowing } from '@/lib/firebase/firestore';
import type { Figure } from '@/lib/types';

interface OnboardingScreenProps {
  figures: Figure[];
  userId: string;
  onComplete: () => void;
}

export default function OnboardingScreen({
  figures,
  userId,
  onComplete,
}: OnboardingScreenProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = (figureId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(figureId)) {
        next.delete(figureId);
      } else {
        next.add(figureId);
      }
      return next;
    });
  };

  const handleContinue = async () => {
    if (selectedIds.size === 0) return;

    setIsSubmitting(true);
    try {
      await updateUserFollowing(userId, Array.from(selectedIds));
      onComplete();
    } catch (error) {
      console.error('Error saving following list:', error);
      setIsSubmitting(false);
    }
  };

  const canContinue = selectedIds.size > 0;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-[#eff3f4] dark:border-[#2f3336]">
        <div className="px-4 h-[53px] flex flex-col justify-center">
          <h1 className="text-[20px] font-bold text-[#0f1419] dark:text-[#e7e9ea]">Choose who to follow</h1>
          <p className="text-[13px] text-[#536471] dark:text-[#71767b]">
            Select at least one to personalize your feed
          </p>
        </div>
      </div>

      {/* Figure Grid */}
      <div className="px-4 py-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {figures.map((figure) => (
            <FigureCard
              key={figure.id}
              figure={figure}
              isSelected={selectedIds.has(figure.id)}
              onToggle={() => handleToggle(figure.id)}
            />
          ))}
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-t border-[#eff3f4] dark:border-[#2f3336] p-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleContinue}
            disabled={!canContinue || isSubmitting}
            className={`w-full h-[52px] px-6 rounded-full font-bold text-[17px] transition-all ${
              canContinue
                ? 'bg-[#0f1419] text-white hover:bg-[#272c30] active:scale-[0.98]'
                : 'bg-[#87898c] text-white cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              `Next${selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
