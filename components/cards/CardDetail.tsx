'use client';

import { useEffect } from 'react';
import { Card, getCardDesign } from '@/types';
import CardPattern from './CardPattern';
import BarcodeDisplay from './BarcodeDisplay';

interface CardDetailProps {
  card: Card;
}

export default function CardDetail({ card }: CardDetailProps) {
  const design = getCardDesign(card.designId);
  const cardName = card.name || 'Card';

  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;

    async function requestWakeLock() {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch {
        // Wake lock not supported or denied
      }
    }

    requestWakeLock();
    return () => { wakeLock?.release(); };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Card banner */}
      <div
        className="w-full max-w-sm rounded-3xl p-6 mb-8 relative overflow-hidden shadow-2xl"
        style={{ background: design.background }}
      >
        <CardPattern design={design} />
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg"
            style={{ backgroundColor: design.accentColor, color: design.textColor }}
          >
            {cardName[0].toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold" style={{ color: design.textColor }}>
            {cardName}
          </h1>
        </div>
      </div>

      {/* White card with barcode */}
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl">
        <BarcodeDisplay
          value={card.cardNumber}
          format="CODE128"
          showNumber={true}
          size="lg"
        />
      </div>
    </div>
  );
}
