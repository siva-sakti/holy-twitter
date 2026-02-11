'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBack, IoCheckmarkCircle } from 'react-icons/io5';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/components/AuthContext';

type SuggestionType = 'figure' | 'quote';

export default function SuggestPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [type, setType] = useState<SuggestionType>('figure');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Figure fields
  const [figureName, setFigureName] = useState('');
  const [figureDescription, setFigureDescription] = useState('');
  const [figureWhy, setFigureWhy] = useState('');

  // Quote fields
  const [quoteFigure, setQuoteFigure] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [quoteSource, setQuoteSource] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'suggestions'), {
        type,
        submittedBy: user?.uid || 'anonymous',
        submittedByEmail: user?.email || 'anonymous',
        createdAt: serverTimestamp(),
        status: 'pending',
        ...(type === 'figure'
          ? {
              figureName: figureName.trim(),
              figureDescription: figureDescription.trim(),
              figureWhy: figureWhy.trim(),
            }
          : {
              quoteFigure: quoteFigure.trim(),
              quoteText: quoteText.trim(),
              quoteSource: quoteSource.trim(),
            }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting suggestion:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFigureName('');
    setFigureDescription('');
    setFigureWhy('');
    setQuoteFigure('');
    setQuoteText('');
    setQuoteSource('');
  };

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
              Suggest
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          {submitted ? (
            /* Success State */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IoCheckmarkCircle className="w-16 h-16 text-[#00ba7c] mb-4" />
              <h2 className="text-[20px] font-bold text-[#0f1419] dark:text-[#e7e9ea] mb-2">
                Thank you!
              </h2>
              <p className="text-[15px] text-[#536471] dark:text-[#71767b] mb-6 max-w-[280px]">
                Your suggestion has been submitted. We'll review it and add it to the scroll if it's a good fit.
              </p>
              <button
                onClick={resetForm}
                className="px-6 py-2.5 bg-[#0f1419] dark:bg-[#eff3f4] text-white dark:text-[#0f1419] text-[15px] font-bold rounded-full hover:opacity-90 transition-opacity"
              >
                Submit another
              </button>
            </div>
          ) : (
            /* Form */
            <>
              <p className="text-[15px] text-[#536471] dark:text-[#71767b] mb-6">
                Know a saint, sage, or wise soul who belongs here? Or a quote that's been living in your head? Share it with us.
              </p>

              {/* Type Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setType('figure')}
                  className={`flex-1 py-2.5 text-[15px] font-medium rounded-full transition-colors ${
                    type === 'figure'
                      ? 'bg-[#0f1419] dark:bg-[#eff3f4] text-white dark:text-[#0f1419]'
                      : 'bg-[#eff3f4] dark:bg-[#2f3336] text-[#0f1419] dark:text-[#e7e9ea]'
                  }`}
                >
                  New Figure
                </button>
                <button
                  onClick={() => setType('quote')}
                  className={`flex-1 py-2.5 text-[15px] font-medium rounded-full transition-colors ${
                    type === 'quote'
                      ? 'bg-[#0f1419] dark:bg-[#eff3f4] text-white dark:text-[#0f1419]'
                      : 'bg-[#eff3f4] dark:bg-[#2f3336] text-[#0f1419] dark:text-[#e7e9ea]'
                  }`}
                >
                  New Quote
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {type === 'figure' ? (
                  /* Figure Form */
                  <>
                    <div>
                      <label className="block text-[13px] text-[#536471] dark:text-[#71767b] mb-1.5">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={figureName}
                        onChange={(e) => setFigureName(e.target.value)}
                        placeholder="e.g., Saint Teresa of Ávila"
                        required
                        className="w-full px-3 py-2.5 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#cfd9de] dark:border-[#536471] rounded-xl focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] text-[#536471] dark:text-[#71767b] mb-1.5">
                        Who are they? *
                      </label>
                      <textarea
                        value={figureDescription}
                        onChange={(e) => setFigureDescription(e.target.value)}
                        placeholder="A brief description - their tradition, time period, what they're known for..."
                        required
                        rows={3}
                        className="w-full px-3 py-2.5 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#cfd9de] dark:border-[#536471] rounded-xl focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] outline-none transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] text-[#536471] dark:text-[#71767b] mb-1.5">
                        Why do you love them?
                      </label>
                      <textarea
                        value={figureWhy}
                        onChange={(e) => setFigureWhy(e.target.value)}
                        placeholder="What makes their words resonate with you?"
                        rows={2}
                        className="w-full px-3 py-2.5 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#cfd9de] dark:border-[#536471] rounded-xl focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] outline-none transition-colors resize-none"
                      />
                    </div>
                  </>
                ) : (
                  /* Quote Form */
                  <>
                    <div>
                      <label className="block text-[13px] text-[#536471] dark:text-[#71767b] mb-1.5">
                        Who said it? *
                      </label>
                      <input
                        type="text"
                        value={quoteFigure}
                        onChange={(e) => setQuoteFigure(e.target.value)}
                        placeholder="e.g., Rumi, Marcus Aurelius, Mary Oliver..."
                        required
                        className="w-full px-3 py-2.5 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#cfd9de] dark:border-[#536471] rounded-xl focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] text-[#536471] dark:text-[#71767b] mb-1.5">
                        The quote *
                      </label>
                      <textarea
                        value={quoteText}
                        onChange={(e) => setQuoteText(e.target.value)}
                        placeholder="The words that stuck with you..."
                        required
                        rows={4}
                        className="w-full px-3 py-2.5 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#cfd9de] dark:border-[#536471] rounded-xl focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] outline-none transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] text-[#536471] dark:text-[#71767b] mb-1.5">
                        Source (if known)
                      </label>
                      <input
                        type="text"
                        value={quoteSource}
                        onChange={(e) => setQuoteSource(e.target.value)}
                        placeholder="e.g., Meditations, Book IV"
                        className="w-full px-3 py-2.5 text-[15px] text-[#0f1419] dark:text-[#e7e9ea] bg-transparent border border-[#cfd9de] dark:border-[#536471] rounded-xl focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] outline-none transition-colors"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#0f1419] dark:bg-[#eff3f4] text-white dark:text-[#0f1419] text-[15px] font-bold rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
