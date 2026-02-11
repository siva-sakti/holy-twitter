'use client';

import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from './AuthContext';

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black px-6">
      <div className="w-full max-w-[364px] flex flex-col items-center">
        {/* Logo */}
        <div className="mb-6 text-center">
          <h1
            className="text-[42px] font-semibold text-[#0f1419] dark:text-[#e7e9ea] tracking-tight"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}
          >
            Holy Scroll <span className="text-[#d4af37]">✦</span>
          </h1>
          <p
            className="mt-2 text-[15px] text-[#536471] dark:text-[#71767b] italic"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}
          >
            Instead of doomscrolling, holy scroll.
          </p>
        </div>

        {/* Subtitle */}
        <p className="mt-4 text-[15px] text-[#536471] dark:text-[#71767b] text-center">
          Join today.
        </p>

        {/* Sign in section */}
        <div className="w-full mt-8 space-y-3">
          {/* Google button - X style */}
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 h-[40px] px-4 bg-white border border-[#dadce0] rounded-full hover:bg-[#f8f9fa] active:bg-[#f1f3f4] transition-colors shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="w-[18px] h-[18px]" />
            <span className="text-[14px] font-medium text-[#3c4043]">
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 h-px bg-[#eff3f4] dark:bg-[#2f3336]" />
            <span className="text-[15px] text-[#536471] dark:text-[#71767b]">or</span>
            <div className="flex-1 h-px bg-[#eff3f4] dark:bg-[#2f3336]" />
          </div>

          {/* Create account button (decorative, same action) */}
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center h-[40px] px-4 bg-[#1d9bf0] rounded-full hover:bg-[#1a8cd8] active:bg-[#1a8cd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-[15px] font-bold text-white">
              Create account
            </span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-4 text-[13px] text-[#f4212e] text-center">{error}</p>
        )}

        {/* Terms text */}
        <p className="mt-6 text-[13px] text-[#536471] dark:text-[#71767b] leading-4 text-center">
          By signing up, you agree to scroll mindfully and seek wisdom.
        </p>

        {/* Existing account link */}
        <div className="mt-10">
          <p className="text-[15px] text-[#536471] dark:text-[#71767b]">
            Already have an account?{' '}
            <button
              onClick={handleSignIn}
              className="text-[#1d9bf0] hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
