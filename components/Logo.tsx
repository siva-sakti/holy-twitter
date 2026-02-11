'use client';

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Scroll body */}
      <path
        d="M8 6C8 4.89543 8.89543 4 10 4H22C23.1046 4 24 4.89543 24 6V26C24 27.1046 23.1046 28 22 28H10C8.89543 28 8 27.1046 8 26V6Z"
        className="fill-[#0f1419] dark:fill-[#e7e9ea]"
      />
      {/* Top curl */}
      <path
        d="M6 8C6 5.79086 7.79086 4 10 4H11C11 5.65685 9.65685 7 8 7C6.89543 7 6 7.89543 6 9V8Z"
        className="fill-[#0f1419] dark:fill-[#e7e9ea]"
      />
      <circle
        cx="7"
        cy="8"
        r="2.5"
        className="fill-[#0f1419] dark:fill-[#e7e9ea]"
      />
      {/* Bottom curl */}
      <path
        d="M26 24C26 26.2091 24.2091 28 22 28H21C21 26.3431 22.3431 25 24 25C25.1046 25 26 24.1046 26 23V24Z"
        className="fill-[#0f1419] dark:fill-[#e7e9ea]"
      />
      <circle
        cx="25"
        cy="24"
        r="2.5"
        className="fill-[#0f1419] dark:fill-[#e7e9ea]"
      />
      {/* Gold accent lines (text lines on scroll) */}
      <rect x="11" y="10" width="10" height="1.5" rx="0.75" fill="#d4af37" />
      <rect x="11" y="14" width="8" height="1.5" rx="0.75" fill="#d4af37" />
      <rect x="11" y="18" width="10" height="1.5" rx="0.75" fill="#d4af37" />
    </svg>
  );
}
