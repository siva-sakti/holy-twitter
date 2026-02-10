'use client';

import { useState, useEffect, useRef } from 'react';
import {
  IoArrowBack,
  IoPencil,
  IoTrash,
  IoAdd,
  IoLink,
  IoCheckmark,
  IoClose,
  IoCamera,
} from 'react-icons/io5';
import type { Figure, Quote } from '@/lib/types';
import {
  getQuotesByFigure,
  deleteFigure,
  deleteQuote,
  updateFigure,
} from '@/lib/firebase/firestore';
import FigureEditor from './FigureEditor';
import QuoteEditor from './QuoteEditor';

interface FigureDetailProps {
  figure: Figure;
  onBack: () => void;
  onFigureUpdated: () => void;
  onFigureDeleted: () => void;
}

type EditingField = 'displayName' | 'handle' | 'bio' | 'profilePicUrl' | 'tradition' | null;

export default function FigureDetail({
  figure,
  onBack,
  onFigureUpdated,
  onFigureDeleted,
}: FigureDetailProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFigureEditor, setShowFigureEditor] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [showQuoteEditor, setShowQuoteEditor] = useState(false);
  const [deletingFigure, setDeletingFigure] = useState(false);
  const [deletingQuoteId, setDeletingQuoteId] = useState<string | null>(null);

  // Inline editing state
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    loadQuotes();
  }, [figure.id]);

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [editingField]);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const quotesData = await getQuotesByFigure(figure.id);
      setQuotes(quotesData);
    } catch (err) {
      console.error('Error loading quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (field: EditingField, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveField = async () => {
    if (!editingField || saving) return;

    const trimmedValue = editValue.trim();

    // Validation
    if (editingField === 'displayName' && !trimmedValue) {
      return;
    }
    if (editingField === 'handle' && !trimmedValue) {
      return;
    }

    setSaving(true);
    try {
      let updateData: Partial<Figure> = {};

      if (editingField === 'handle') {
        updateData.handle = trimmedValue.toLowerCase().replace(/[^a-z0-9-]/g, '');
      } else {
        updateData[editingField] = trimmedValue;
      }

      await updateFigure(figure.id, updateData);
      onFigureUpdated();
      setEditingField(null);
      setEditValue('');
    } catch (err) {
      console.error('Error saving field:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editingField !== 'bio') {
      e.preventDefault();
      saveField();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleDeleteFigure = async () => {
    if (!confirm(`Delete "${figure.displayName}" and all their quotes? This cannot be undone.`)) {
      return;
    }

    setDeletingFigure(true);
    try {
      await deleteFigure(figure.id, true);
      onFigureDeleted();
    } catch (err) {
      console.error('Error deleting figure:', err);
      alert('Failed to delete figure');
    } finally {
      setDeletingFigure(false);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (!confirm('Delete this quote? This cannot be undone.')) {
      return;
    }

    setDeletingQuoteId(quoteId);
    try {
      await deleteQuote(quoteId);
      setQuotes(quotes.filter((q) => q.id !== quoteId));
    } catch (err) {
      console.error('Error deleting quote:', err);
      alert('Failed to delete quote');
    } finally {
      setDeletingQuoteId(null);
    }
  };

  const handleFigureSaved = () => {
    setShowFigureEditor(false);
    onFigureUpdated();
  };

  const handleQuoteSaved = () => {
    setShowQuoteEditor(false);
    setEditingQuote(null);
    loadQuotes();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Inline editable field component
  const EditableField = ({
    field,
    value,
    label,
    placeholder,
    multiline = false,
    prefix,
  }: {
    field: EditingField;
    value: string;
    label: string;
    placeholder?: string;
    multiline?: boolean;
    prefix?: string;
  }) => {
    const isEditing = editingField === field;

    if (isEditing) {
      return (
        <div className="group">
          <label className="block text-[12px] font-medium text-[#536471] dark:text-[#71767b] mb-1">
            {label}
          </label>
          <div className="flex items-start gap-2">
            {prefix && (
              <span className="text-[15px] text-[#536471] dark:text-[#71767b] mt-2">{prefix}</span>
            )}
            {multiline ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={3}
                className="flex-1 px-3 py-2 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-white dark:bg-[#16181c] border border-[#1d9bf0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d9bf0]/20 resize-none"
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-white dark:bg-[#16181c] border border-[#1d9bf0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d9bf0]/20"
              />
            )}
            <button
              onClick={saveField}
              disabled={saving}
              className="p-2 text-white bg-[#1d9bf0] rounded-full hover:bg-[#1a8cd8] transition-colors disabled:opacity-50"
            >
              <IoCheckmark className="w-4 h-4" />
            </button>
            <button
              onClick={cancelEditing}
              className="p-2 text-[#536471] hover:text-[#0f1419] dark:hover:text-[#e7e9ea] hover:bg-[#eff3f4] dark:hover:bg-[#2f3336] rounded-full transition-colors"
            >
              <IoClose className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={() => startEditing(field, value)}
        className="group cursor-pointer p-2 -m-2 rounded-lg hover:bg-[#f7f9f9] dark:hover:bg-[#1d1f23] transition-colors"
      >
        <label className="block text-[12px] font-medium text-[#536471] dark:text-[#71767b] mb-0.5 pointer-events-none">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {prefix && (
            <span className="text-[15px] text-[#536471] dark:text-[#71767b]">{prefix}</span>
          )}
          <span className={`text-[15px] ${value ? 'text-[#0f1419] dark:text-[#e7e9ea]' : 'text-[#536471] dark:text-[#71767b] italic'}`}>
            {value || placeholder || 'Click to add...'}
          </span>
          <IoPencil className="w-3.5 h-3.5 text-[#536471] dark:text-[#71767b] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[14px] text-[#536471] dark:text-[#71767b] hover:text-[#0f1419] dark:hover:text-[#e7e9ea] transition-colors"
      >
        <IoArrowBack className="w-4 h-4" />
        Back to figures
      </button>

      {/* Figure Info Card - Inline Editable */}
      <div className="bg-white dark:bg-[#16181c] rounded-xl border border-[#eff3f4] dark:border-[#2f3336] overflow-hidden">
        {/* Profile Photo Section */}
        <div className="relative">
          <div className="h-24 bg-gradient-to-br from-[#f7f9f9] to-[#eff3f4] dark:from-[#16181c] dark:to-[#1d1f23]" />
          <div className="absolute -bottom-12 left-6">
            <div className="relative group">
              <img
                src={figure.profilePicUrl || '/default-avatar.png'}
                alt={figure.displayName}
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-[#16181c]"
              />
              <button
                onClick={() => startEditing('profilePicUrl', figure.profilePicUrl)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IoCamera className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
          {/* Delete button */}
          <div className="absolute top-3 right-3">
            <button
              onClick={handleDeleteFigure}
              disabled={deletingFigure}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-red-500 bg-white dark:bg-[#16181c] border border-red-200 dark:border-red-900 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
            >
              <IoTrash className="w-3.5 h-3.5" />
              {deletingFigure ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="pt-14 px-6 pb-6 space-y-4">
          {/* Profile Pic URL (if editing) */}
          {editingField === 'profilePicUrl' && (
            <div className="p-4 bg-[#f7f9f9] dark:bg-[#1d1f23] rounded-lg">
              <label className="block text-[12px] font-medium text-[#536471] dark:text-[#71767b] mb-2">
                Profile Picture URL
              </label>
              <div className="flex gap-2">
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type="url"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-white dark:bg-[#16181c] border border-[#1d9bf0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d9bf0]/20"
                />
                <button
                  onClick={saveField}
                  disabled={saving}
                  className="px-4 py-2 text-[14px] font-bold text-white bg-[#1d9bf0] rounded-lg hover:bg-[#1a8cd8] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={cancelEditing}
                  className="px-4 py-2 text-[14px] font-bold text-[#536471] hover:text-[#0f1419] dark:hover:text-[#e7e9ea] transition-colors"
                >
                  Cancel
                </button>
              </div>
              {editValue && (
                <img
                  src={editValue}
                  alt="Preview"
                  className="mt-3 w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
          )}

          {/* Display Name */}
          <EditableField
            field="displayName"
            value={figure.displayName}
            label="Display Name"
            placeholder="Enter display name"
          />

          {/* Handle */}
          <EditableField
            field="handle"
            value={figure.handle || ''}
            label="Handle"
            placeholder="enter-handle"
            prefix="@"
          />

          {/* Tradition */}
          <EditableField
            field="tradition"
            value={figure.tradition}
            label="Tradition"
            placeholder="e.g., Christian, Buddhist"
          />

          {/* Bio */}
          <EditableField
            field="bio"
            value={figure.bio}
            label="Bio"
            placeholder="Add a bio..."
            multiline
          />

          {/* External Links - Link to full editor */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] font-medium text-[#536471] dark:text-[#71767b]">
                External Links
              </label>
              <button
                onClick={() => setShowFigureEditor(true)}
                className="text-[13px] text-[#1d9bf0] hover:underline"
              >
                Edit all fields
              </button>
            </div>
            {figure.externalLinks.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {figure.externalLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 text-[13px] text-[#1d9bf0] bg-[#1d9bf0]/10 rounded-full hover:bg-[#1d9bf0]/20 transition-colors"
                  >
                    <IoLink className="w-3.5 h-3.5" />
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <button
                onClick={() => setShowFigureEditor(true)}
                className="text-[14px] text-[#536471] dark:text-[#71767b] italic hover:text-[#1d9bf0] transition-colors"
              >
                + Add external links
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quotes Section */}
      <div className="bg-white dark:bg-[#16181c] rounded-xl border border-[#eff3f4] dark:border-[#2f3336]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#eff3f4] dark:border-[#2f3336] flex items-center justify-between">
          <h3 className="text-[17px] font-bold text-[#0f1419] dark:text-[#e7e9ea]">
            Quotes ({quotes.length})
          </h3>
          <button
            onClick={() => {
              setEditingQuote(null);
              setShowQuoteEditor(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#0f1419] dark:bg-[#eff3f4] text-white dark:text-[#0f1419] text-[14px] font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            <IoAdd className="w-4 h-4" />
            Add Quote
          </button>
        </div>

        {/* Quotes List */}
        {loading ? (
          <div className="px-4 py-12 text-center text-[#536471] dark:text-[#71767b]">
            Loading quotes...
          </div>
        ) : quotes.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-[15px] text-[#536471] dark:text-[#71767b]">
              No quotes yet. Add the first quote for this figure.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#eff3f4] dark:divide-[#2f3336]">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="px-4 py-4 hover:bg-[#f7f9f9] dark:hover:bg-[#1d1f23] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] text-[#0f1419] dark:text-[#e7e9ea]">
                      {truncateText(quote.text, 200)}
                    </p>
                    {quote.sourceCitation && (
                      <p className="mt-1 text-[13px] text-[#536471] dark:text-[#71767b]">
                        — {quote.sourceCitation}
                      </p>
                    )}
                    {quote.tags && quote.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {quote.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[12px] bg-[#eff3f4] dark:bg-[#2f3336] text-[#536471] dark:text-[#71767b] rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingQuote(quote);
                        setShowQuoteEditor(true);
                      }}
                      className="p-2 text-[#536471] dark:text-[#71767b] hover:text-[#0f1419] dark:hover:text-[#e7e9ea] hover:bg-[#eff3f4] dark:hover:bg-[#2f3336] rounded-lg transition-colors"
                    >
                      <IoPencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuote(quote.id)}
                      disabled={deletingQuoteId === quote.id}
                      className="p-2 text-[#536471] dark:text-[#71767b] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <IoTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Figure Editor Modal */}
      {showFigureEditor && (
        <FigureEditor
          figure={figure}
          onClose={() => setShowFigureEditor(false)}
          onSaved={handleFigureSaved}
        />
      )}

      {/* Quote Editor Modal */}
      {showQuoteEditor && (
        <QuoteEditor
          quote={editingQuote}
          figureId={figure.id}
          onClose={() => {
            setShowQuoteEditor(false);
            setEditingQuote(null);
          }}
          onSaved={handleQuoteSaved}
        />
      )}
    </div>
  );
}
