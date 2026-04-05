'use client';

import { useCardStore } from '@/store/useCardStore';
import CardStack from '@/components/cards/CardStack';
import Link from 'next/link';

export default function HomePage() {
  const { cards, isLoading, user } = useCardStore();

  return (
    <div className="min-h-screen">
      <header className="px-6 pt-14 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">
              Hi, {user?.firstName}
            </p>
            <h1 className="text-2xl font-bold text-white">
              {cards.length} {cards.length === 1 ? 'card' : 'cards'}
            </h1>
          </div>
          <Link
            href="/add"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </Link>
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center pt-32">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        <CardStack cards={cards} />
      )}

      {cards.length > 0 && (
        <Link
          href="/add"
          className="fixed bottom-24 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform z-40"
        >
          <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </Link>
      )}
    </div>
  );
}
