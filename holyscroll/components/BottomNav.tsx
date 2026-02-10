'use client';

import {
  IoHomeOutline,
  IoHome,
  IoSearchOutline,
  IoBookmarkOutline,
  IoBookmark,
  IoPersonOutline,
  IoPerson,
} from 'react-icons/io5';
import type { NavTab } from './Sidebar';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems: { id: NavTab; icon: React.ReactNode; activeIcon: React.ReactNode; disabled?: boolean }[] = [
    {
      id: 'home',
      icon: <IoHomeOutline className="w-[26px] h-[26px]" />,
      activeIcon: <IoHome className="w-[26px] h-[26px]" />,
    },
    {
      id: 'search',
      icon: <IoSearchOutline className="w-[26px] h-[26px]" />,
      activeIcon: <IoSearchOutline className="w-[26px] h-[26px]" />,
      disabled: true,
    },
    {
      id: 'bookmarks',
      icon: <IoBookmarkOutline className="w-[26px] h-[26px]" />,
      activeIcon: <IoBookmark className="w-[26px] h-[26px]" />,
    },
    {
      id: 'profile',
      icon: <IoPersonOutline className="w-[26px] h-[26px]" />,
      activeIcon: <IoPerson className="w-[26px] h-[26px]" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-black border-t border-[#eff3f4] dark:border-[#2f3336] md:hidden">
      <div className="flex items-center justify-around h-[53px]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && onTabChange(item.id)}
            disabled={item.disabled}
            className={`flex items-center justify-center p-3 ${
              item.disabled ? 'opacity-40' : ''
            }`}
          >
            <span className="text-[#0f1419] dark:text-[#e7e9ea]">
              {activeTab === item.id ? item.activeIcon : item.icon}
            </span>
          </button>
        ))}
      </div>
      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white dark:bg-black" />
    </nav>
  );
}
