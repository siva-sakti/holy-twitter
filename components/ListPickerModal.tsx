'use client';

import { useState, useEffect } from 'react';
import { IoClose, IoCheckmark, IoAdd } from 'react-icons/io5';
import type { ListData } from '@/lib/firebase/firestore';

interface ListPickerModalProps {
  lists: ListData[];
  currentListId: string | null | undefined; // undefined = not saved, null = saved without list
  isBookmarked: boolean;
  onClose: () => void;
  onSaveToList: (listId: string | null) => void;
  onRemoveBookmark: () => void;
  onCreateList: () => void;
}

export default function ListPickerModal({
  lists,
  currentListId,
  isBookmarked,
  onClose,
  onSaveToList,
  onRemoveBookmark,
  onCreateList,
}: ListPickerModalProps) {
  const [selectedListId, setSelectedListId] = useState<string | null>(
    currentListId === undefined ? null : currentListId
  );

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

  const handleSave = () => {
    onSaveToList(selectedListId);
    onClose();
  };

  const handleRemove = () => {
    onRemoveBookmark();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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
            Save to...
          </h2>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#0f1419] dark:bg-[#eff3f4] text-white dark:text-[#0f1419] text-[14px] font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>

        {/* List Options */}
        <div className="max-h-[300px] overflow-y-auto">
          {/* Quick Save (no list) */}
          <button
            onClick={() => setSelectedListId(null)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors"
          >
            <span className="text-[15px] text-[#0f1419] dark:text-[#e7e9ea]">
              Quick Save
            </span>
            {selectedListId === null && (
              <IoCheckmark className="w-5 h-5 text-[#1d9bf0]" />
            )}
          </button>

          {/* Divider */}
          {lists.length > 0 && (
            <div className="border-t border-[#eff3f4] dark:border-[#2f3336]" />
          )}

          {/* User's Lists */}
          {lists.map((list) => (
            <button
              key={list.id}
              onClick={() => setSelectedListId(list.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors"
            >
              <span className="text-[15px] text-[#0f1419] dark:text-[#e7e9ea]">
                {list.name}
              </span>
              {selectedListId === list.id && (
                <IoCheckmark className="w-5 h-5 text-[#1d9bf0]" />
              )}
            </button>
          ))}
        </div>

        {/* Create New List */}
        <div className="border-t border-[#eff3f4] dark:border-[#2f3336]">
          <button
            onClick={onCreateList}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#1d9bf0] flex items-center justify-center">
              <IoAdd className="w-5 h-5 text-white" />
            </div>
            <span className="text-[15px] font-medium text-[#1d9bf0]">
              Create new list
            </span>
          </button>
        </div>

        {/* Remove bookmark option (only if already bookmarked) */}
        {isBookmarked && (
          <div className="border-t border-[#eff3f4] dark:border-[#2f3336]">
            <button
              onClick={handleRemove}
              className="w-full flex items-center justify-center px-4 py-3 hover:bg-[#f4212e0a] transition-colors"
            >
              <span className="text-[15px] text-[#f4212e]">
                Remove from Saved
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
