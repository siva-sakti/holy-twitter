'use client';

import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

interface CreateListModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function CreateListModal({
  onClose,
  onCreate,
}: CreateListModalProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await onCreate(name.trim());
      onClose();
    } catch (err) {
      console.error('Error creating list:', err);
      setError('Failed to create list. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[320px] mx-4 bg-white dark:bg-[#16181c] rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-[53px] border-b border-[#eff3f4] dark:border-[#2f3336]">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors"
          >
            <IoClose className="w-5 h-5 text-[#0f1419] dark:text-[#e7e9ea]" />
          </button>
          <h2 className="text-[17px] font-bold text-[#0f1419] dark:text-[#e7e9ea]">
            Create list
          </h2>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label
              htmlFor="list-name"
              className="block text-[13px] text-[#536471] dark:text-[#71767b] mb-1"
            >
              Name
            </label>
            <input
              id="list-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g., Morning Readings"
              maxLength={50}
              autoFocus
              className="w-full px-3 py-2 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#cfd9de] dark:border-[#536471] rounded-lg focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] outline-none transition-colors"
            />
            <div className="text-right text-[13px] text-[#536471] dark:text-[#71767b] mt-1">
              {name.length}/50
            </div>
          </div>

          {error && (
            <p className="text-[14px] text-[#f4212e] mb-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            className="w-full py-2.5 bg-[#0f1419] dark:bg-[#eff3f4] text-white dark:text-[#0f1419] text-[15px] font-bold rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
}
