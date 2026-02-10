'use client';

import { useState } from 'react';
import { IoClose, IoAdd, IoTrash } from 'react-icons/io5';
import type { Figure } from '@/lib/types';
import { addFigure, updateFigure } from '@/lib/firebase/firestore';

interface FigureEditorProps {
  figure?: Figure | null;
  onClose: () => void;
  onSaved: () => void;
}

const TRADITIONS = [
  'Christian',
  'Catholic',
  'Orthodox',
  'Protestant',
  'Buddhist',
  'Hindu',
  'Islamic',
  'Jewish',
  'Taoist',
  'Sikh',
  'Indigenous',
  'Secular',
  'Other',
];

export default function FigureEditor({
  figure,
  onClose,
  onSaved,
}: FigureEditorProps) {
  const isEditing = !!figure;

  const [handle, setHandle] = useState(figure?.handle || '');
  const [displayName, setDisplayName] = useState(figure?.displayName || '');
  const [type, setType] = useState<'person' | 'text'>(figure?.type || 'person');
  const [tradition, setTradition] = useState(figure?.tradition || '');
  const [bio, setBio] = useState(figure?.bio || '');
  const [profilePicUrl, setProfilePicUrl] = useState(figure?.profilePicUrl || '');
  const [externalLinks, setExternalLinks] = useState<{ label: string; url: string }[]>(
    figure?.externalLinks || []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate handle from display name
  const generateHandle = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value);
    // Auto-generate handle if it's empty or matches the old auto-generated one
    if (!handle || handle === generateHandle(displayName)) {
      setHandle(generateHandle(value));
    }
  };

  const handleAddLink = () => {
    setExternalLinks([...externalLinks, { label: '', url: '' }]);
  };

  const handleRemoveLink = (index: number) => {
    setExternalLinks(externalLinks.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const updated = [...externalLinks];
    updated[index][field] = value;
    setExternalLinks(updated);
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }

    if (!handle.trim()) {
      setError('Handle is required');
      return;
    }

    if (!tradition) {
      setError('Tradition is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const figureData = {
        handle: handle.trim().toLowerCase(),
        displayName: displayName.trim(),
        type,
        tradition,
        bio: bio.trim(),
        profilePicUrl: profilePicUrl.trim(),
        externalLinks: externalLinks.filter((l) => l.label.trim() && l.url.trim()),
      };

      if (isEditing && figure) {
        await updateFigure(figure.id, figureData);
      } else {
        await addFigure(figureData);
      }

      onSaved();
    } catch (err) {
      console.error('Error saving figure:', err);
      setError('Failed to save figure. Please try again.');
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
            {isEditing ? 'Edit Figure' : 'Add New Figure'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-[#eff3f4] dark:hover:bg-[#2f3336] transition-colors"
          >
            <IoClose className="w-5 h-5 text-[#0f1419] dark:text-[#e7e9ea]" />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-130px)] space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[14px] rounded-lg">
              {error}
            </div>
          )}

          {/* Display Name */}
          <div>
            <label className="block text-[13px] font-medium text-[#536471] dark:text-[#71767b] mb-1.5">
              Display Name *
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => handleDisplayNameChange(e.target.value)}
              placeholder="e.g., Meister Eckhart"
              className="w-full px-3 py-2 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#eff3f4] dark:border-[#2f3336] rounded-lg focus:outline-none focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0]"
            />
          </div>

          {/* Handle */}
          <div>
            <label className="block text-[13px] font-medium text-[#536471] dark:text-[#71767b] mb-1.5">
              Handle * <span className="font-normal">(URL slug)</span>
            </label>
            <div className="flex items-center">
              <span className="text-[15px] text-[#536471] dark:text-[#71767b] mr-1">@</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="meister-eckhart"
                className="flex-1 px-3 py-2 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#eff3f4] dark:border-[#2f3336] rounded-lg focus:outline-none focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0]"
              />
            </div>
            <p className="mt-1 text-[12px] text-[#536471] dark:text-[#71767b]">
              Used in URLs: /figure/{handle || 'handle'}
            </p>
          </div>

          {/* Type */}
          <div>
            <label className="block text-[13px] font-medium text-[#536471] dark:text-[#71767b] mb-1.5">
              Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="person"
                  checked={type === 'person'}
                  onChange={() => setType('person')}
                  className="w-4 h-4 accent-[#1d9bf0]"
                />
                <span className="text-[14px] text-[#0f1419] dark:text-[#e7e9ea]">Person</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="text"
                  checked={type === 'text'}
                  onChange={() => setType('text')}
                  className="w-4 h-4 accent-[#1d9bf0]"
                />
                <span className="text-[14px] text-[#0f1419] dark:text-[#e7e9ea]">Text/Scripture</span>
              </label>
            </div>
          </div>

          {/* Tradition */}
          <div>
            <label className="block text-[13px] font-medium text-[#536471] dark:text-[#71767b] mb-1.5">
              Tradition *
            </label>
            <select
              value={tradition}
              onChange={(e) => setTradition(e.target.value)}
              className="w-full px-3 py-2 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#eff3f4] dark:border-[#2f3336] rounded-lg focus:outline-none focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0]"
            >
              <option value="">Select tradition...</option>
              {TRADITIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-[13px] font-medium text-[#536471] dark:text-[#71767b] mb-1.5">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief description of the figure..."
              rows={3}
              className="w-full px-3 py-2 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#eff3f4] dark:border-[#2f3336] rounded-lg focus:outline-none focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] resize-none"
            />
          </div>

          {/* Profile Pic URL */}
          <div>
            <label className="block text-[13px] font-medium text-[#536471] dark:text-[#71767b] mb-1.5">
              Profile Picture URL
            </label>
            <input
              type="url"
              value={profilePicUrl}
              onChange={(e) => setProfilePicUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#eff3f4] dark:border-[#2f3336] rounded-lg focus:outline-none focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0]"
            />
            {profilePicUrl && (
              <img
                src={profilePicUrl}
                alt="Preview"
                className="mt-2 w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>

          {/* External Links */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[13px] font-medium text-[#536471] dark:text-[#71767b]">
                External Links
              </label>
              <button
                type="button"
                onClick={handleAddLink}
                className="flex items-center gap-1 text-[13px] text-[#1d9bf0] hover:underline"
              >
                <IoAdd className="w-4 h-4" />
                Add link
              </button>
            </div>
            <div className="space-y-2">
              {externalLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                    placeholder="Label (e.g., Wikipedia)"
                    className="flex-1 px-3 py-2 text-[14px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#eff3f4] dark:border-[#2f3336] rounded-lg focus:outline-none focus:border-[#1d9bf0]"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    placeholder="URL"
                    className="flex-1 px-3 py-2 text-[14px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#eff3f4] dark:border-[#2f3336] rounded-lg focus:outline-none focus:border-[#1d9bf0]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className="p-2 text-[#536471] hover:text-red-500 transition-colors"
                  >
                    <IoTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
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
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Figure'}
          </button>
        </div>
      </div>
    </div>
  );
}
