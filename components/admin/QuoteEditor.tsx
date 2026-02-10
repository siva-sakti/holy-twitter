'use client';

import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import type { Quote } from '@/lib/types';
import { addQuote, updateQuote } from '@/lib/firebase/firestore';

interface QuoteEditorProps {
  quote?: Quote | null;
  figureId: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function QuoteEditor({
  quote,
  figureId,
  onClose,
  onSaved,
}: QuoteEditorProps) {
  const isEditing = !!quote;

  const [text, setText] = useState(quote?.text || '');
  const [sourceCitation, setSourceCitation] = useState(quote?.sourceCitation || '');
  const [tagsInput, setTagsInput] = useState(quote?.tags?.join(', ') || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!text.trim()) {
      setError('Quote text is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0);

      const quoteData = {
        figureId,
        text: text.trim(),
        sourceCitation: sourceCitation.trim(),
        tags: tags.length > 0 ? tags : undefined,
        addedBy: 'admin',
      };

      if (isEditing && quote) {
        await updateQuote(quote.id, quoteData);
      } else {
        await addQuote(quoteData);
      }

      onSaved();
    } catch (err) {
      console.error('Error saving quote:', err);
      setError('Failed to save quote. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#16181c] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#eff3f4] dark:border-[#2f3336] flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-[#0f1419] dark:text-[#e7e9ea]">
            {isEditing ? 'Edit Quote' : 'Add New Quote'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-[#eff3f4] dark:hover:bg-[#2f3336] transition-colors"
          >
            <IoClose className="w-5 h-5 text-[#0f1419] dark:text-[#e7e9ea]" />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[14px] rounded-lg">
              {error}
            </div>
          )}

          {/* Quote Text */}
          <div>
            <label className="block text-[13px] font-medium text-[#536471] dark:text-[#71767b] mb-1.5">
              Quote Text *
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the quote..."
              rows={5}
              className="w-full px-3 py-2 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#eff3f4] dark:border-[#2f3336] rounded-lg focus:outline-none focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] resize-none"
            />
            <p className="mt-1 text-[12px] text-[#536471] dark:text-[#71767b] text-right">
              {text.length} characters
            </p>
          </div>

          {/* Source Citation */}
          <div>
            <label className="block text-[13px] font-medium text-[#536471] dark:text-[#71767b] mb-1.5">
              Source Citation
            </label>
            <input
              type="text"
              value={sourceCitation}
              onChange={(e) => setSourceCitation(e.target.value)}
              placeholder="e.g., Sermon 52, or Bhagavad Gita 2:47"
              className="w-full px-3 py-2 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#eff3f4] dark:border-[#2f3336] rounded-lg focus:outline-none focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0]"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[13px] font-medium text-[#536471] dark:text-[#71767b] mb-1.5">
              Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Comma-separated (e.g., love, detachment, prayer)"
              className="w-full px-3 py-2 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#eff3f4] dark:border-[#2f3336] rounded-lg focus:outline-none focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0]"
            />
            <p className="mt-1 text-[12px] text-[#536471] dark:text-[#71767b]">
              Separate tags with commas
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#eff3f4] dark:border-[#2f3336] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[14px] font-bold text-[#0f1419] dark:text-[#e7e9ea] border border-[#cfd9de] dark:border-[#536471] rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-[14px] font-bold text-white bg-[#0f1419] dark:bg-[#eff3f4] dark:text-[#0f1419] rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Quote'}
          </button>
        </div>
      </div>
    </div>
  );
}
