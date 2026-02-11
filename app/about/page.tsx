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
            <p className="text-[15px] text-[#536471] dark:text-[#71767b] italic mb-3">
              Instead of doomscrolling, holy scroll.
            </p>
            <p className="text-[24px] font-bold text-[#0f1419] dark:text-[#e7e9ea] mb-2">
              Can't stop scrolling?
            </p>
            <p className="text-[18px] text-[#536471] dark:text-[#71767b]">
              At least scroll this.
            </p>
          </div>

          {/* The Why */}
          <section className="space-y-4">
            <h2 className="text-[18px] font-bold text-[#0f1419] dark:text-[#e7e9ea] flex items-center gap-2">
              <span className="text-[#d4af37]">✦</span> The Why
            </h2>
            <div className="text-[15px] text-[#0f1419] dark:text-[#e7e9ea] leading-relaxed space-y-4">
              <p>
                There's something so dopamine about scrolling Twitter. Especially when you've been raised on the internet and even in your best moments, your fingers still itch to type that URL.
              </p>
              <p>
                So I built this. You still get the scroll. You still get the feed. But instead of rage bait and hot takes, you get words that have survived centuries for a reason.
              </p>
              <p>
                It's a lighthearted project with a serious intention: content that actually fills you up instead of leaving you emptier than before.
              </p>
            </div>
          </section>

          {/* Community */}
          <section className="space-y-4">
            <h2 className="text-[18px] font-bold text-[#0f1419] dark:text-[#e7e9ea] flex items-center gap-2">
              <span className="text-[#d4af37]">✦</span> Community as Practice
            </h2>
            <div className="text-[15px] text-[#0f1419] dark:text-[#e7e9ea] leading-relaxed space-y-4">
              <p>
                They say spiritual practice is often done in community. Sangha in Buddhism. Church in Christianity. Satsang in Hinduism.
              </p>
              <p>
                This is kind of like that, but for the chronically online. A little network of minds worth listening to. Honestly, this feels more like my real social circle than my actual social media.
              </p>
              <p className="text-[#536471] dark:text-[#71767b] italic">
                (At least these friends don't subtoot.)
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
                I'm <span className="font-semibold">Gargi Bala</span>. I make things on the internet, mostly because the internet made me.
              </p>
              <p>
                This project is part of my ongoing attempt to be less online while still being online. A paradox? Maybe. But so is everything interesting.
              </p>
              <p>
                If you have a saint, sage, or wise person you think belongs here, I'd love to hear about them. This is meant to grow.
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
