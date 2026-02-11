'use client';

import { useEffect, useState } from 'react';
import { IoClose, IoArrowForward, IoArrowBack } from 'react-icons/io5';
import { FaRegHeart } from 'react-icons/fa';
import { IoBookmarkOutline, IoAddCircleOutline } from 'react-icons/io5';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { BiHomeAlt } from 'react-icons/bi';

interface TutorialModalProps {
  onComplete: () => void;
}

interface TutorialStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const steps: TutorialStep[] = [
  {
    icon: <HiOutlineSparkles className="w-12 h-12 text-[#d4af37]" />,
    title: 'Welcome to Holy Scroll!',
    description: "Here's a quick tour of how to make the most of your feed.",
  },
  {
    icon: <BiHomeAlt className="w-12 h-12 text-[#1d9bf0]" />,
    title: 'Your Feed',
    description: 'Scroll through wisdom from saints, mystics, and sacred texts. Tap any post to read it in full.',
  },
  {
    icon: <FaRegHeart className="w-12 h-12 text-[#f91880]" />,
    title: 'Favorites',
    description: 'Tap the heart to save quotes you love. Find them anytime in your Profile under Favorites.',
  },
  {
    icon: <IoBookmarkOutline className="w-12 h-12 text-[#1d9bf0]" />,
    title: 'Bookmarks',
    description: 'Tap the bookmark icon to organize quotes into custom lists for later.',
  },
  {
    icon: <IoAddCircleOutline className="w-12 h-12 text-[#00ba7c]" />,
    title: 'Suggest a Figure',
    description: "Know a wise teacher we're missing? Use Suggest in the sidebar to recommend them!",
  },
  {
    icon: <span className="text-[48px]">🙏</span>,
    title: "That's it!",
    description: 'Enjoy your holy scroll. May you find peace and wisdom here.',
  },
];

export default function TutorialModal({ onComplete }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

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
      if (e.key === 'Escape') onComplete();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onComplete]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />

      {/* Modal */}
      <div className="relative w-full max-w-[380px] mx-4 bg-white dark:bg-[#16181c] rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200 shadow-xl">
        {/* Header with skip */}
        <div className="flex items-center justify-between px-4 h-[52px] border-b border-[#eff3f4] dark:border-[#2f3336]">
          <span className="text-[14px] text-[#536471] dark:text-[#71767b]">
            {currentStep + 1} of {steps.length}
          </span>
          <button
            onClick={onComplete}
            className="text-[14px] text-[#536471] dark:text-[#71767b] hover:text-[#0f1419] dark:hover:text-[#e7e9ea] transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-10 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {step.icon}
          </div>

          {/* Title */}
          <h2 className="text-[22px] font-bold text-[#0f1419] dark:text-[#e7e9ea] mb-3">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-[15px] text-[#536471] dark:text-[#71767b] leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 pb-6">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-[#1d9bf0]'
                  : 'bg-[#cfd9de] dark:bg-[#3e4144]'
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3 px-6 pb-6">
          {!isFirstStep && (
            <button
              onClick={handleBack}
              className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-full border border-[#cfd9de] dark:border-[#536471] text-[15px] font-bold text-[#0f1419] dark:text-[#e7e9ea] hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors"
            >
              <IoArrowBack className="w-4 h-4" />
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className={`flex-1 flex items-center justify-center gap-2 h-[44px] rounded-full bg-[#0f1419] dark:bg-[#eff3f4] text-[15px] font-bold text-white dark:text-[#0f1419] hover:opacity-90 transition-opacity ${
              isFirstStep ? 'w-full' : ''
            }`}
          >
            {isLastStep ? "Let's go!" : 'Next'}
            {!isLastStep && <IoArrowForward className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
