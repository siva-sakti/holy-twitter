'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showTagline = false, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-[20px]',
    md: 'text-[28px]',
    lg: 'text-[36px]',
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <span
        className={`font-[var(--font-cormorant)] font-semibold tracking-tight text-[#0f1419] dark:text-[#e7e9ea] ${sizeClasses[size]}`}
        style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}
      >
        Holy Scroll <span className="text-[#d4af37]">✦</span>
      </span>
      {showTagline && (
        <span className="text-[11px] text-[#536471] dark:text-[#71767b] mt-0.5">
          Instead of doomscrolling, holy scroll.
        </span>
      )}
    </div>
  );
}
