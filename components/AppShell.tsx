'use client';

import Sidebar, { NavTab } from './Sidebar';
import BottomNav from './BottomNav';
import { useTheme } from './ThemeProvider';

interface AppShellProps {
  children: React.ReactNode;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  userPhotoUrl?: string;
  userName?: string;
  onSignOut: () => void;
  onShowTutorial?: () => void;
}

export default function AppShell({
  children,
  activeTab,
  onTabChange,
  userPhotoUrl,
  userName,
  onSignOut,
  onShowTutorial,
}: AppShellProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Three-column layout */}
      <div className="max-w-[1280px] mx-auto flex">
        {/* Left Sidebar - hidden on mobile */}
        <aside className="hidden md:flex md:w-[68px] xl:w-[275px] flex-shrink-0 border-r border-[#eff3f4] dark:border-[#2f3336]">
          <Sidebar
            activeTab={activeTab}
            onTabChange={onTabChange}
            userPhotoUrl={userPhotoUrl}
            userName={userName}
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onSignOut={onSignOut}
            onShowTutorial={onShowTutorial}
          />
        </aside>

        {/* Main Content - center column */}
        <main className="flex-1 min-w-0 max-w-[600px] border-r border-[#eff3f4] dark:border-[#2f3336]">
          {/* Add bottom padding on mobile for BottomNav */}
          <div className="pb-[53px] md:pb-0">
            {children}
          </div>
        </main>

        {/* Right Sidebar - hidden on smaller screens */}
        <aside className="hidden lg:block w-[350px] flex-shrink-0 p-4">
          {/* Empty for now - could add search, trends, suggestions */}
        </aside>
      </div>

      {/* Bottom Navigation - mobile only */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
