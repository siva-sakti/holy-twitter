'use client';

import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-xl mx-auto border-x border-[#eff3f4] dark:border-[#2f3336] min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-[#eff3f4] dark:border-[#2f3336]">
          <div className="flex items-center gap-6 px-4 h-[53px]">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-[#0f14190a] dark:hover:bg-[#eff3f41a] transition-colors"
            >
              <IoArrowBack className="w-5 h-5 text-[#0f1419] dark:text-[#e7e9ea]" />
            </button>
            <h1 className="text-[20px] font-bold text-[#0f1419] dark:text-[#e7e9ea]">
              About
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-8">
          {/* Tagline */}
          <div className="text-center pb-6 border-b border-[#eff3f4] dark:border-[#2f3336]">
            <h2
              className="text-[32px] font-semibold text-[#0f1419] dark:text-[#e7e9ea] tracking-tight mb-3"
              style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}
            >
              Holy Scroll <span className="text-[#d4af37]">✦</span>
            </h2>
            <p className="text-[18px] font-medium text-[#0f1419] dark:text-[#e7e9ea] mb-2">
              Can't stop scrolling?
            </p>
            <p
              className="text-[22px] text-[#0f1419] dark:text-[#e7e9ea] italic"
              style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}
            >
              At least make it sacred.
            </p>
          </div>

          {/* The Why */}
          <section className="space-y-4">
            <h2 className="text-[18px] font-bold text-[#0f1419] dark:text-[#e7e9ea] flex items-center gap-2">
              <span className="text-[#d4af37]">✦</span> The Why
            </h2>
            <div className="text-[15px] text-[#0f1419] dark:text-[#e7e9ea] leading-relaxed">
              <p>
                Scrolling — we all love it, whether we want to or not. Maybe one day we'll all make it off the internet, but until then... we might as well make our habit into something more holy.
              </p>
            </div>
          </section>

          {/* About Me */}
          <section className="space-y-4">
            <h2 className="text-[18px] font-bold text-[#0f1419] dark:text-[#e7e9ea] flex items-center gap-2">
              <span className="text-[#d4af37]">✦</span> About Me
            </h2>
            <div className="text-[15px] text-[#0f1419] dark:text-[#e7e9ea] leading-relaxed space-y-4">
              <p>
                Hi, I'm <span className="font-semibold">Gargi Bala</span>, a child of the internet. I can't count the number of times my brain itches to scroll and my fingers reach for the timeline. It's probably a 1000x order of magnitude over the decade+ more than I've prayed.
              </p>
              <p>
                Though I've succumbed to the act of scrolling, the content I saw always dissatisfied me. I want to contemplate spiritual teachings as much as I can in this life, and so I might as well use these optimized reward circuits for a better cause. Plus this feels way more like community to me :)
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-6 border-t border-[#eff3f4] dark:border-[#2f3336] text-center">
            <p className="text-[14px] text-[#536471] dark:text-[#71767b]">
              Made with love and a slight internet addiction
            </p>
            <p className="text-[14px] text-[#536471] dark:text-[#71767b] mt-1">
              🙏
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
