# HolyScroll — Product Spec

## Overview

A social media timeline that looks and feels exactly like X (Twitter), but the only accounts are saints, mystics, sacred texts, and spiritual teachers. The feed surfaces their writings, quotes, and scripture excerpts. The goal: redirect the doomscroll reflex toward wisdom, making saints your "peers and influencers."

**URL:** holyscroll.app (or similar)
**Branding:** Minimal. The app just looks like a timeline.

---

## Core Concept

- Mimics X's layout precisely for familiar dopamine/UX patterns
- "Accounts" are saints, mystics, and sacred texts (Bible, Bhagavad Gita, Steiner, etc.)
- "Tweets" are excerpts, quotes, and passages from their writings
- Users log in, follow who they want, save quotes, add their own finds

---

## User Stories

1. I open the app and see a shuffled feed of quotes from the figures I follow
2. I scroll with the same muscle memory as X
3. I tap a post to see it expanded, or tap the profile pic to visit that saint's profile
4. I bookmark quotes I love; they're saved to my profile
5. I add quotes I encounter in my own reading; they appear on my profile
6. I quote-tweet a saint's words with my own reflection
7. I share a quote as a beautiful image card
8. I export my saved quotes as a backup file

---

## Information Architecture

### Home Feed
- Shuffled quotes from followed accounts
- Fake relative timestamps ("3h", "1d", "3d") — randomized on load
- Pull-to-refresh re-shuffles
- Infinite scroll (cycles/reshuffles at bottom)

### Post Anatomy
```
[Circle Profile Pic] Display Name · Source Citation · 3h
Quote text here, first 280 characters visible...
[Show more]

[♡ Save] [↻ Repost] [Quote] [Share]
```

**Text display behavior (exactly like X):**
- First 280 characters show in feed preview
- "Show more" link if text exceeds 280 chars
- Tap post to expand into full detail view
- All standard X interaction patterns: tap to expand, click profile pic to visit profile, etc.

**Source citation sits where @handle would be:**
- Rudolf Steiner · *Calendar of the Soul, Week 23* · 3h
- Krishna · *Bhagavad Gita 2:47* · 3h
- Teresa of Ávila · *Interior Castle, Fourth Mansions* · 3h
- Psalms · *Psalm 23:1* · 3h

### Profile Page
- Circle-cropped historical image (paintings, icons, photos)
- Display name
- Short bio (2-3 lines, salient points from Wikipedia or similar)
- Links to full texts (Gutenberg, sacred-texts.com, etc.)
- "Verified" halo icon ✦ (instead of checkmark)
- All posts by this figure (randomized order on load)
- Follow/Unfollow button

### User's Own Profile
- Profile pic (from Google account)
- Display name
- Three tabs:
  - **Saved**: Bookmarked quotes from canonical feed
  - **Added**: Quotes user has contributed (PRIVATE — only visible to them, appears in their own feed only)
  - **Quoted**: User's quote-tweets (their reflection + original)

### Add Quote Flow (Private)
- User inputs: quote text, figure (select from existing or add new figure name), source citation
- Added to user's profile under "Added" tab
- Appears in their own feed mixed with canonical content
- **Private to that user only** — does not appear in other users' feeds
- No moderation needed; users curate their own collection

### Suggestion Flow (for Canonical Database)
- User submits a **figure or text** suggestion with:
  - Name (required)
  - Tradition (required)
  - Why they want them (optional)
  - **Optional fields:**
    - Specific quotes they'd like included
    - Source texts / books to pull from (e.g., "The Cloud of Unknowing" or "Chapters 1-3 of Interior Castle")
- Suggestions go to admin (email notification or simple admin dashboard)
- Admin (you) reviews and manually adds approved content to canonical database
- No automated publishing; full curatorial control

### Saved / Lists
- Default "Saved" collection for quick bookmarks
- Ability to create named lists (e.g., "On Suffering", "Morning Readings")
- Quotes can be added to multiple lists

### Share Card
- Tap share icon → generates image that **looks exactly like a tweet screenshot**
- Same layout as X:
  - Profile pic (circle)
  - Display name · Source citation · timestamp
  - Quote text
  - Action icons row (greyed out, decorative)
- Matches light/dark mode
- No visible HolyScroll branding (or extremely subtle — just like sharing an actual tweet)
- Save to camera roll or share directly
- Goal: indistinguishable from a real tweet screenshot at first glance

### Export
- Settings → Export Saved Quotes
- Downloads JSON file with all saved/added quotes
- Backup peace of mind

---

## Visual Design

### Overall Approach
- **Clone X's layout precisely** — same spacing, same hierarchy, same gestures
- Familiar = easy = the dopamine pattern transfers
- Light mode default (matches X's default), dark mode toggle

### Specifics
- Background: white (light) / black (dark)
- Text: standard X typography feel
- Profile pics: circle-cropped, pulled from Wikipedia/historical sources
- Halo verification badge: small golden halo icon instead of blue checkmark
- Subtle touches allowed if delightful, but no heavy "spiritual" theming

### Iconography
- Use X-style icons for actions (heart/save, repost, share)
- Halo badge is the one playful divergence

---

## Technical Architecture

### Stack
| Layer | Technology |
|-------|------------|
| Frontend | React (or Next.js) |
| Auth | Firebase Auth (Google sign-in) |
| Database | Firestore |
| Hosting | Vercel or Firebase Hosting |
| PWA | Service worker + manifest for installability |

### Data Models

**Figure (Saint/Text)**
```
{
  id: string
  displayName: string
  type: "person" | "text"
  bio: string
  profilePicUrl: string
  externalLinks: [{ label: string, url: string }]
  tradition: string // "Christian", "Hindu", "Buddhist", etc.
  createdAt: timestamp
}
```

**Quote**
```
{
  id: string
  figureId: string
  text: string
  sourceCitation: string // "Bhagavad Gita 2:47"
  addedBy: userId | "seed" // track if user-contributed
  createdAt: timestamp
}
```

**User**
```
{
  id: string (Firebase UID)
  email: string
  displayName: string
  profilePicUrl: string (from Google)
  following: [figureId]
  createdAt: timestamp
}
```

**SavedQuote**
```
{
  id: string
  userId: string
  quoteId: string
  listId: string | null // null = general saves
  savedAt: timestamp
}
```

**List**
```
{
  id: string
  userId: string
  name: string
  createdAt: timestamp
}
```

**QuoteTweet**
```
{
  id: string
  userId: string
  originalQuoteId: string
  userReflection: string
  createdAt: timestamp
}
```

**Suggestion (for admin review)**
```
{
  id: string
  userId: string
  // Figure/text being suggested:
  figureName: string
  figureTradition: string
  figureReason: string (optional)
  // Optional: specific content requests
  suggestedQuotes: [string] (optional - quotes they'd like included)
  suggestedSources: [string] (optional - books/texts to pull from)
  // Status:
  status: "pending" | "approved" | "rejected"
  createdAt: timestamp
}
```

### Security Rules (Firestore)
- Figures & seed quotes: read-only for all users
- User document: read/write only by that user
- SavedQuotes, Lists, QuoteTweets: user can only CRUD their own
- User-added quotes: writeable by authenticated users, readable by that user only (MVP)
- Input sanitization on all user-submitted text

### PWA Setup
- Service worker for offline capability (at least show cached feed)
- Web app manifest with icon, name, theme color
- "Add to Home Screen" prompt
- Fullscreen display mode (no browser chrome)

### Future: App Store Distribution
- Google Play: wrap via PWABuilder or TWA
- Apple App Store: wrap via Capacitor
- Not MVP, but architecture supports it

---

## Content Seeding

### Initial Roster (MVP: ~15 figures, ~150 quotes)

**Christian Mystics**
- Meister Eckhart
- Teresa of Ávila
- John of the Cross
- Julian of Norwich
- Thomas à Kempis
- The Desert Fathers (as one "account")

**Hindu / Vedantic**
- Krishna (Bhagavad Gita)
- Ramana Maharshi
- Ramakrishna
- Mirabai

**Buddhist**
- The Buddha (Dhammapada, suttas)
- Thich Nhat Hanh

**Sufi**
- Rumi
- Hafiz

**Other**
- Rudolf Steiner (including all 52 Calendar of the Soul verses)
- Psalms (as an "account")

### Sourcing
- Public domain texts (Gutenberg, sacred-texts.com)
- Existing quote databases (WikiQuote) with verification
- Manual curation for quality
- User contributions grow the database over time

---

## Screens Summary

1. **Splash / Login** — "Sign in with Google" button, minimal
2. **Onboarding** — Grid of figures to follow (after first sign-in)
3. **Home Feed** — main timeline, pull to refresh
4. **Post Detail** — expanded single quote view (for longer quotes)
5. **Profile (Figure)** — bio, links, all posts, follow button
6. **Profile (User)** — saved/added/quoted tabs
7. **Saved / Lists** — manage collections
8. **Add Quote** — form to contribute a quote (private to user)
9. **Suggest** — form to suggest figure/text (with optional quotes/sources)
10. **Settings** — dark mode toggle, export data, sign out

---

## MVP Scope

### In
- [x] Google sign-in
- [x] Onboarding flow (pick figures to follow from grid)
- [x] Home feed (shuffled, fake timestamps)
- [x] 280 char preview with "Show more" / click to expand
- [x] Source citation in handle position
- [x] Figure profiles with bio + all posts + external links
- [x] Randomized order on profile pages
- [x] Follow / unfollow figures
- [x] Bookmark quotes (saved tab)
- [x] Create lists, add quotes to lists
- [x] User profile (saves, adds, quote-tweets)
- [x] Add quote flow (private to user)
- [x] Quote-tweet flow
- [x] Suggest figure/text flow (with optional quotes/sources, goes to admin)
- [x] Share card (tweet screenshot style)
- [x] PWA installable
- [x] Export saved quotes (JSON)
- [x] Dark mode toggle
- [x] Seed content (~15 figures, ~150 quotes)

### Out (Future)
- [ ] Search / discover page
- [ ] Public user-added quotes (community curation)
- [ ] Notifications
- [ ] App Store distribution
- [ ] Calendar of the Soul auto-pinned by week
- [ ] Liturgical calendar integration
- [ ] Comments / replies
- [ ] Algorithmic feed (vs pure random)

---

## Open Questions

1. ~~**Quote length**~~: DECIDED — 280 char preview in feed, click to expand full text (like X's "Show more")
2. ~~**New figure requests**~~: DECIDED — Users can suggest figures/quotes via feedback form; admin manually adds to canonical DB
3. ~~**Share card design**~~: DECIDED — Exact tweet screenshot format, indistinguishable from real X share
4. ~~**Onboarding**~~: DECIDED — Pick from a grid of figures to follow

All major decisions made. Ready to build.

---

## Admin Features (Simple)

- **Admin dashboard** (or just email notifications) to review:
  - Suggested figures
  - Suggested quotes
- **Firestore console** for manually adding approved content to canonical database
- No complex CMS needed for MVP; direct Firestore editing works

---

## Next Steps

1. Finalize this spec (address open questions)
2. Set up Firebase project + auth
3. Design Figma mockups (or just build directly given X is the template)
4. Build component library (Post, Profile, Feed, etc.)
5. Seed initial quote database
6. Ship MVP
7. Use it, grow the quote database organically
8. Iterate

---

*Last updated: February 2025*
