'use client';

import { useState, useEffect, useMemo } from 'react';
import { IoArrowBack, IoClose } from 'react-icons/io5';
import Post from './Post';
import { shuffle, generateFakeTimestamp } from '@/lib/utils/shuffle';
import type { Quote, Figure, QuoteWithFigure } from '@/lib/types';

interface UserProfileProps {
  user: {
    displayName: string;
    email: string;
    photoURL: string;
    bio: string;
  };
  savedQuoteIds: string[];
  quotes: Quote[];
  figures: Figure[];
  onClose: () => void;
  onSave: (quoteId: string) => void;
  onUnsave: (quoteId: string) => void;
  onExpand: (quote: QuoteWithFigure) => void;
  onShare: (quote: QuoteWithFigure) => void;
  onRepost: (quote: QuoteWithFigure) => void;
  onUpdateProfile?: (updates: { displayName?: string; bio?: string }) => Promise<void>;
}

type TabType = 'saved' | 'added' | 'quoted';

export default function UserProfile({
  user,
  savedQuoteIds,
  quotes,
  figures,
  onClose,
  onSave,
  onUnsave,
  onExpand,
  onShare,
  onRepost,
  onUpdateProfile,
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<TabType>('saved');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.displayName);
  const [editBio, setEditBio] = useState(user.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  // Handle save profile
  const handleSaveProfile = async () => {
    if (!onUpdateProfile) {
      setIsEditing(false);
      return;
    }

    const updates: { displayName?: string; bio?: string } = {};
    if (editName.trim() !== user.displayName) {
      updates.displayName = editName.trim();
    }
    if (editBio.trim() !== (user.bio || '')) {
      updates.bio = editBio.trim();
    }

    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateProfile(updates);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditName(user.displayName);
    setEditBio(user.bio || '');
    setIsEditing(false);
  };

  // Format bio with line breaks and basic styling
  const formatBio = (bio: string) => {
    if (!bio) return null;
    return bio.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < bio.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Create figure map for enriching quotes
  const figureMap = useMemo(
    () => new Map(figures.map((f) => [f.id, f])),
    [figures]
  );

  // Get saved quotes with figure data
  const savedQuotes = useMemo(() => {
    return savedQuoteIds
      .map((quoteId) => {
        const quote = quotes.find((q) => q.id === quoteId);
        if (!quote) return null;
        const figure = figureMap.get(quote.figureId);
        if (!figure) return null;
        return {
          ...quote,
          figure,
          fakeTimestamp: generateFakeTimestamp(),
        } as QuoteWithFigure;
      })
      .filter((q): q is QuoteWithFigure => q !== null);
  }, [savedQuoteIds, quotes, figureMap]);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'saved', label: 'Saved' },
    { id: 'added', label: 'Added' },
    { id: 'quoted', label: 'Quoted' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-black overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-[#eff3f4] dark:border-[#2f3336]">
        <div className="flex items-center gap-6 px-4 h-[53px]">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors"
          >
            <IoArrowBack className="w-5 h-5 text-[#0f1419] dark:text-[#e7e9ea]" />
          </button>
          <div>
            <h1 className="text-[20px] font-bold text-[#0f1419] dark:text-[#e7e9ea]">
              {user.displayName}
            </h1>
            <p className="text-[13px] text-[#536471] dark:text-[#71767b]">
              {savedQuoteIds.length} saved
            </p>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="px-4 py-4 border-b border-[#eff3f4] dark:border-[#2f3336]">
        {isEditing ? (
          /* Edit Mode */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-[#0f1419] dark:text-[#e7e9ea]">
                Edit profile
              </h3>
              <button
                onClick={handleCancelEdit}
                className="p-2 -mr-2 rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors"
              >
                <IoClose className="w-5 h-5 text-[#0f1419] dark:text-[#e7e9ea]" />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <img
                src={user.photoURL || 'https://ui-avatars.com/api/?name=User&background=536471&color=fff&size=128'}
                alt={user.displayName}
                className="w-20 h-20 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 space-y-4">
                {/* Name input */}
                <div>
                  <label className="block text-[13px] text-[#536471] dark:text-[#71767b] mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    maxLength={50}
                    className="w-full px-3 py-2 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#eff3f4] dark:border-[#2f3336] rounded-lg focus:outline-none focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0]"
                    placeholder="Enter your name"
                  />
                  <p className="mt-1 text-[12px] text-[#536471] dark:text-[#71767b] text-right">
                    {editName.length}/50
                  </p>
                </div>

                {/* Bio input */}
                <div>
                  <label className="block text-[13px] text-[#536471] dark:text-[#71767b] mb-1">
                    Bio
                  </label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    maxLength={160}
                    rows={3}
                    className="w-full px-3 py-2 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#eff3f4] dark:border-[#2f3336] rounded-lg focus:outline-none focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] resize-none"
                    placeholder="Write a short bio about yourself..."
                  />
                  <p className="mt-1 text-[12px] text-[#536471] dark:text-[#71767b] text-right">
                    {editBio.length}/160
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-1.5 text-[14px] font-bold text-[#0f1419] dark:text-[#e7e9ea] border border-[#cfd9de] dark:border-[#536471] rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving || editName.trim() === ''}
                className="px-4 py-1.5 text-[14px] font-bold text-white bg-[#0f1419] dark:bg-[#eff3f4] dark:text-[#0f1419] rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <img
                src={user.photoURL || 'https://ui-avatars.com/api/?name=User&background=536471&color=fff&size=128'}
                alt={user.displayName}
                className="w-20 h-20 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-[22px] font-bold text-[#0f1419] dark:text-[#e7e9ea]">
                  {user.displayName}
                </h2>
                <p className="text-[15px] text-[#536471] dark:text-[#71767b]">
                  {user.email}
                </p>
              </div>
              {onUpdateProfile && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-1.5 text-[14px] font-bold text-[#0f1419] dark:text-[#e7e9ea] border border-[#cfd9de] dark:border-[#536471] rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors flex-shrink-0"
                >
                  Edit profile
                </button>
              )}
            </div>
            {/* Bio display */}
            {user.bio && (
              <p className="text-[15px] text-[#0f1419] dark:text-[#e7e9ea] leading-relaxed">
                {formatBio(user.bio)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#eff3f4] dark:border-[#2f3336]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 text-[15px] font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-[#0f1419] dark:text-[#e7e9ea]'
                : 'text-[#536471] dark:text-[#71767b] hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a]'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === 'saved' && (
          <>
            {savedQuotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <p className="text-[#536471] dark:text-[#71767b] text-[15px] mb-1">
                  No saved quotes yet
                </p>
                <p className="text-[#536471] dark:text-[#71767b] text-[13px]">
                  Tap the heart on any quote to save it here.
                </p>
              </div>
            ) : (
              <div>
                {savedQuotes.map((quote) => (
                  <Post
                    key={quote.id}
                    figure={{
                      id: quote.figure.id,
                      displayName: quote.figure.displayName,
                      profilePicUrl: quote.figure.profilePicUrl,
                    }}
                    quote={{
                      text: quote.text,
                      sourceCitation: quote.sourceCitation,
                    }}
                    timestamp={quote.fakeTimestamp}
                    isSaved={true}
                    onSave={() => onUnsave(quote.id)}
                    onExpand={() => onExpand(quote)}
                    onShare={() => onShare(quote)}
                    onRepost={() => onRepost(quote)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'added' && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-[#536471] dark:text-[#71767b] text-[15px] mb-1">
              Coming soon
            </p>
            <p className="text-[#536471] dark:text-[#71767b] text-[13px]">
              Add your own quotes from your reading.
            </p>
          </div>
        )}

        {activeTab === 'quoted' && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-[#536471] dark:text-[#71767b] text-[15px] mb-1">
              Coming soon
            </p>
            <p className="text-[#536471] dark:text-[#71767b] text-[13px]">
              Share quotes with your own reflections.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
