# Holy Scroll ✦

> Instead of doomscrolling, holy scroll.

A Twitter-like feed of wisdom from saints, mystics, and sacred texts. Built for those who can't stop scrolling but want to make it meaningful.

## Features

- **Scrollable Feed** - Wisdom quotes from spiritual figures, styled like a social timeline
- **Follow Figures** - Choose which saints, mystics, and texts appear in your feed
- **Favorites** - Heart quotes you love, find them in your profile
- **Bookmarks** - Organize quotes into custom lists for later
- **Suggest Figures** - Recommend new teachers to add to the platform
- **Dark Mode** - Because we scroll at night too

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Auth & Firestore database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vercel](https://vercel.com/) - Deployment

## Getting Started

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` with your Firebase config:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/           # Next.js App Router pages
components/    # React components
lib/           # Firebase, types, utilities
public/        # Static assets
```

## Contributing

Know a saint, sage, or wise figure that belongs here? Use the Suggest feature in the app or open an issue.

## Author

Made by [Gargi Bala](https://twitter.com/gargibala) with love and a slight internet addiction 🙏
