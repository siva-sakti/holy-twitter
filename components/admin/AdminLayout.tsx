'use client';

import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
  backLabel?: string;
}

export default function AdminLayout({
  children,
  title = 'Admin Dashboard',
  backHref = '/',
  backLabel = 'Back to app',
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f7f9f9] dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-black border-b border-[#eff3f4] dark:border-[#2f3336]">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link
            href={backHref}
            className="flex items-center gap-2 text-[14px] text-[#536471] dark:text-[#71767b] hover:text-[#0f1419] dark:hover:text-[#e7e9ea] transition-colors"
          >
            <IoArrowBack className="w-4 h-4" />
            {backLabel}
          </Link>
          <div className="h-5 w-px bg-[#eff3f4] dark:bg-[#2f3336]" />
          <h1 className="text-[18px] font-bold text-[#0f1419] dark:text-[#e7e9ea]">
            {title}
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
