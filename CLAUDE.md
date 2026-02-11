# Holy Scroll - Project Context

A Twitter-like feed of wisdom quotes from saints, mystics, and sacred texts. Built with Next.js 16, Firebase, and Tailwind CSS.

## Project Overview

**Tagline:** "Instead of doomscrolling, holy scroll."

Holy Scroll is a social media alternative that provides a scrollable feed of spiritual wisdom. Users can follow figures (saints, mystics, sacred texts), like quotes, bookmark them into custom lists, and suggest new figures to add.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Firebase Firestore
- **Auth:** Firebase Auth (Google sign-in only)
- **Styling:** Tailwind CSS
- **Fonts:** Cormorant Garamond (logo/branding), Geist (UI)
- **Icons:** react-icons (Ionicons)
- **Deployment:** Vercel

## Key Features Implemented

### Core Feed
- Infinite scrolling feed of quotes from followed figures
- Quote cards with figure avatar, name, source citation
- Tap to expand into full PostModal view
- Fake timestamps for organic feel ("3h", "1d", etc.)

### User System
- Google OAuth sign-in
- User profile with editable display name and bio
- Figure following system
- Dark/light mode with persistence (ThemeProvider)

### Favorites & Bookmarks (Two Separate Systems)
- **Heart/Favorites:** Personal likes, viewable in Profile → Favorites tab
- **Bookmark/Lists:** Organize quotes into custom lists, accessible from Bookmarks nav tab
- Micro-interactions: heart pop, bookmark bounce, share pop animations

### Onboarding Flow
1. New users select figures to follow (OnboardingScreen)
2. Tutorial modal shows after first login (TutorialModal)
3. 6-step walkthrough: Welcome, Feed, Favorites, Bookmarks, Suggest, Done
4. Tutorial accessible anytime via Settings → "How to use"

### Pages
- `/` - Main app (feed, bookmarks, profile)
- `/about` - About page with project philosophy
- `/suggest` - Submit new figure/quote suggestions
- `/admin` - Admin panel for managing figures and quotes
- `/figure/[id]` - Individual figure profile page

## Data Model (Firestore)

### Collections
- `figures` - Saints, mystics, sacred texts
- `quotes` - Individual quotes with figureId reference
- `users` - User profiles with following array
- `users/{uid}/likedQuotes` - Liked quote IDs
- `users/{uid}/savedQuotes` - Bookmarked quotes with listId
- `users/{uid}/lists` - Custom bookmark lists
- `suggestions` - User-submitted figure suggestions

### User Document Fields
```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  bio: string;
  profilePicUrl: string;
  following: string[]; // figureIds
  hasSeenTutorial?: boolean;
  createdAt: Date;
}
```

## Component Architecture

### Layout
- `AppShell` - Main layout with sidebar, content area, bottom nav
- `Sidebar` - Desktop navigation (Home, Bookmarks, Profile, Suggest, About, Settings)
- `BottomNav` - Mobile navigation

### Feed Components
- `Feed` - Renders list of Post components
- `Post` - Individual quote card with actions
- `PostModal` - Expanded quote view

### User Components
- `UserProfile` - Profile page with Favorites tab
- `FigureProfile` - Individual figure page with quotes

### Modal Components
- `TutorialModal` - 6-step onboarding tutorial
- `ListPickerModal` - Select bookmark list
- `CreateListModal` - Create new list
- `PostModal` - Expanded quote view

### Auth & Theme
- `AuthContext` - Firebase auth state provider
- `ThemeProvider` - Dark/light mode persistence
- `LoginScreen` - Google sign-in page

## Branding

- **Logo:** "Holy Scroll ✦" in Cormorant Garamond
- **Accent Color:** Gold (#d4af37)
- **Primary Colors:** X/Twitter-style (#0f1419 light, #e7e9ea dark)
- **Secondary:** #536471 (light), #71767b (dark)

## Recent Changes (Feb 2026)

### Session Summary
- Added typography-based logo (Cormorant Garamond + gold star)
- Created About page with personal copy from Gargi
- Added Suggest feature for submitting new figures
- Implemented onboarding tutorial (6-step modal)
- Fixed dark mode persistence across all pages (ThemeProvider)
- Made About and Suggest accessible from main sidebar
- Added "How to use" in Settings to replay tutorial
- Micro-interactions for heart, bookmark, share buttons

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Development

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run lint   # ESLint
```

## File Structure

```
app/
  page.tsx          # Main app orchestration
  layout.tsx        # Root layout with fonts
  about/page.tsx    # About page
  suggest/page.tsx  # Suggest figure page
  admin/page.tsx    # Admin panel
  figure/[id]/      # Figure profile pages

components/
  AuthContext.tsx   # Firebase auth provider
  ThemeProvider.tsx # Dark/light mode provider
  AppShell.tsx      # Main layout shell
  Sidebar.tsx       # Desktop navigation
  BottomNav.tsx     # Mobile navigation
  Feed.tsx          # Quote feed
  Post.tsx          # Quote card
  PostModal.tsx     # Expanded quote view
  TutorialModal.tsx # Onboarding tutorial
  ...

lib/
  firebase/
    config.ts       # Firebase initialization
    firestore.ts    # Firestore operations
    auth.ts         # Auth helpers
  types/
    index.ts        # TypeScript interfaces
  utils/
    share.ts        # Share functionality
```
