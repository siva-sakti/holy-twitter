'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import {
  IoHomeOutline,
  IoHome,
  IoSearchOutline,
  IoBookmarkOutline,
  IoBookmark,
  IoPersonOutline,
  IoPerson,
  IoSettingsOutline,
  IoMoonOutline,
  IoSunnyOutline,
  IoLogOutOutline,
  IoEllipsisHorizontal,
  IoConstructOutline,
  IoInformationCircleOutline,
  IoAddCircleOutline,
} from 'react-icons/io5';

export type NavTab = 'home' | 'search' | 'bookmarks' | 'profile';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  userPhotoUrl?: string;
  userName?: string;
  isDark: boolean;
  onToggleTheme: () => void;
  onSignOut: () => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  userPhotoUrl,
  userName,
  isDark,
  onToggleTheme,
  onSignOut,
}: SidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; activeIcon: React.ReactNode; disabled?: boolean }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <IoHomeOutline className="w-[26px] h-[26px]" />,
      activeIcon: <IoHome className="w-[26px] h-[26px]" />,
    },
    {
      id: 'search',
      label: 'Search',
      icon: <IoSearchOutline className="w-[26px] h-[26px]" />,
      activeIcon: <IoSearchOutline className="w-[26px] h-[26px]" />,
      disabled: true,
    },
    {
      id: 'bookmarks',
      label: 'Bookmarks',
      icon: <IoBookmarkOutline className="w-[26px] h-[26px]" />,
      activeIcon: <IoBookmark className="w-[26px] h-[26px]" />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <IoPersonOutline className="w-[26px] h-[26px]" />,
      activeIcon: <IoPerson className="w-[26px] h-[26px]" />,
    },
  ];

  return (
    <div className="h-screen sticky top-0 flex flex-col justify-between py-3 px-2 xl:px-3">
      {/* Logo */}
      <div className="mb-4 px-3">
        <Logo size="sm" showTagline className="hidden xl:flex" />
        <span
          className="xl:hidden text-[24px] font-semibold text-[#0f1419] dark:text-[#e7e9ea]"
          style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}
        >
          HS <span className="text-[#d4af37]">✦</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => !item.disabled && onTabChange(item.id)}
                disabled={item.disabled}
                className={`flex items-center gap-4 p-3 rounded-full transition-colors w-full ${
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a]'
                } ${activeTab === item.id ? 'font-bold' : ''}`}
              >
                <span className="text-[#0f1419] dark:text-[#e7e9ea]">
                  {activeTab === item.id ? item.activeIcon : item.icon}
                </span>
                <span className="hidden xl:block text-[20px] text-[#0f1419] dark:text-[#e7e9ea]">
                  {item.label}
                </span>
              </button>
            </li>
          ))}

          {/* Suggest */}
          <li>
            <Link
              href="/suggest"
              className="flex items-center gap-4 p-3 rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors w-full"
            >
              <IoAddCircleOutline className="w-[26px] h-[26px] text-[#0f1419] dark:text-[#e7e9ea]" />
              <span className="hidden xl:block text-[20px] text-[#0f1419] dark:text-[#e7e9ea]">
                Suggest
              </span>
            </Link>
          </li>

          {/* About */}
          <li>
            <Link
              href="/about"
              className="flex items-center gap-4 p-3 rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors w-full"
            >
              <IoInformationCircleOutline className="w-[26px] h-[26px] text-[#0f1419] dark:text-[#e7e9ea]" />
              <span className="hidden xl:block text-[20px] text-[#0f1419] dark:text-[#e7e9ea]">
                About
              </span>
            </Link>
          </li>

          {/* Settings */}
          <li className="relative">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="flex items-center gap-4 p-3 rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors w-full"
            >
              <IoSettingsOutline className="w-[26px] h-[26px] text-[#0f1419] dark:text-[#e7e9ea]" />
              <span className="hidden xl:block text-[20px] text-[#0f1419] dark:text-[#e7e9ea]">
                Settings
              </span>
            </button>

            {/* Settings dropdown */}
            {showSettingsMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSettingsMenu(false)}
                />
                <div className="absolute left-0 bottom-full mb-2 z-20 bg-white dark:bg-black rounded-xl shadow-lg border border-[#eff3f4] dark:border-[#2f3336] py-2 min-w-[200px]">
                  <button
                    onClick={() => {
                      onToggleTheme();
                      setShowSettingsMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-[15px] text-[#0f1419] dark:text-[#e7e9ea] hover:bg-[#f7f9f9] dark:hover:bg-[#16181c] transition-colors"
                  >
                    {isDark ? (
                      <>
                        <IoSunnyOutline className="w-5 h-5" />
                        Light mode
                      </>
                    ) : (
                      <>
                        <IoMoonOutline className="w-5 h-5" />
                        Dark mode
                      </>
                    )}
                  </button>
                  <Link
                    href="/admin"
                    onClick={() => setShowSettingsMenu(false)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-[15px] text-[#0f1419] dark:text-[#e7e9ea] hover:bg-[#f7f9f9] dark:hover:bg-[#16181c] transition-colors"
                  >
                    <IoConstructOutline className="w-5 h-5" />
                    Admin
                  </Link>
                  <div className="my-1 border-t border-[#eff3f4] dark:border-[#2f3336]" />
                  <button
                    onClick={() => {
                      onSignOut();
                      setShowSettingsMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-[15px] text-[#f4212e] hover:bg-[#f7f9f9] dark:hover:bg-[#16181c] transition-colors"
                  >
                    <IoLogOutOutline className="w-5 h-5" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </li>
        </ul>
      </nav>

      {/* User button */}
      <div className="relative mt-3">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-3 p-3 rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors w-full"
        >
          {userPhotoUrl ? (
            <img
              src={userPhotoUrl}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#536471] flex items-center justify-center text-white text-sm font-bold">
              ?
            </div>
          )}
          <div className="hidden xl:flex flex-1 items-center justify-between min-w-0">
            <span className="text-[15px] font-bold text-[#0f1419] dark:text-[#e7e9ea] truncate">
              {userName || 'User'}
            </span>
            <IoEllipsisHorizontal className="w-5 h-5 text-[#536471] dark:text-[#71767b]" />
          </div>
        </button>

        {/* User menu dropdown */}
        {showUserMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowUserMenu(false)}
            />
            <div className="absolute left-0 bottom-full mb-2 z-20 bg-white dark:bg-black rounded-xl shadow-lg border border-[#eff3f4] dark:border-[#2f3336] py-2 min-w-[200px]">
              <button
                onClick={() => {
                  onTabChange('profile');
                  setShowUserMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-[15px] text-[#0f1419] dark:text-[#e7e9ea] hover:bg-[#f7f9f9] dark:hover:bg-[#16181c] transition-colors"
              >
                <IoPersonOutline className="w-5 h-5" />
                View profile
              </button>
              <button
                onClick={() => {
                  onSignOut();
                  setShowUserMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-[15px] text-[#f4212e] hover:bg-[#f7f9f9] dark:hover:bg-[#16181c] transition-colors"
              >
                <IoLogOutOutline className="w-5 h-5" />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
