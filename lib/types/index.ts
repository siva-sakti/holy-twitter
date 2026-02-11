// Data Models for HolyScroll

export interface Figure {
  id: string;
  handle: string; // URL-friendly slug, e.g., "meister-eckhart"
  displayName: string;
  type: 'person' | 'text';
  bio: string;
  profilePicUrl: string;
  externalLinks: { label: string; url: string }[];
  tradition: string; // "Christian", "Hindu", "Buddhist", etc.
  createdAt: Date;
}

export interface Quote {
  id: string;
  figureId: string;
  text: string;
  sourceCitation: string; // "Bhagavad Gita 2:47"
  tags?: string[]; // Optional tags for categorization
  addedBy: string; // userId or "seed"
  createdAt: Date;
}

export interface User {
  id: string; // Firebase UID
  email: string;
  displayName: string;
  bio: string; // User's bio/description
  profilePicUrl: string;
  following: string[]; // figureIds
  hasSeenTutorial?: boolean; // Whether user has seen the onboarding tutorial
  createdAt: Date;
}

export interface SavedQuote {
  id: string;
  userId: string;
  quoteId: string;
  listId: string | null; // null = general saves
  savedAt: Date;
}

export interface List {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
}

export interface QuoteTweet {
  id: string;
  userId: string;
  originalQuoteId: string;
  userReflection: string;
  createdAt: Date;
}

export interface Suggestion {
  id: string;
  userId: string;
  figureName: string;
  figureTradition: string;
  figureReason?: string;
  suggestedQuotes?: string[];
  suggestedSources?: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

// Extended quote with figure data for feed display
export interface QuoteWithFigure extends Quote {
  figure: Figure;
  fakeTimestamp: string; // "3h", "1d", etc.
}
