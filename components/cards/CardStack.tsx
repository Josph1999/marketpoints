'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Card } from '@/types';
import CardItem from './CardItem';

interface CardStackProps {
  cards: Card[];
}

export default function CardStack({ cards }: CardStackProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pt-32 px-8 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Cards Yet</h3>
        <p className="text-gray-500 text-sm">
          Add your first loyalty card to get started
        </p>
      </div>
    );
  }

  const stackHeight = isExpanded
    ? cards.length * 140 + 80
    : cards.length * 48 + 120;

  return (
    <div className="px-0 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-4 mb-4 text-xs text-gray-500 hover:text-white transition-colors"
      >
        {isExpanded ? 'Stack cards' : 'Expand cards'}
      </button>
      <div className="relative" style={{ height: stackHeight }}>
        <AnimatePresence>
          {cards.map((card, index) => (
            <CardItem
              key={card._id}
              card={card}
              index={index}
              total={cards.length}
              isExpanded={isExpanded}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
