'use client';

import { motion } from 'framer-motion';
import { Card, getCardDesign } from '@/types';
import { formatCardNumber } from '@/lib/barcode';
import CardPattern from './CardPattern';
import Link from 'next/link';

interface CardItemProps {
  card: Card;
  index: number;
  total: number;
  isExpanded: boolean;
}

export default function CardItem({ card, index, total, isExpanded }: CardItemProps) {
  const design = getCardDesign(card.designId);
  const cardName = card.name || 'Card';

  const stackOffset = isExpanded ? index * 140 : index * 48;
  const scale = isExpanded ? 1 : 1 - index * 0.02;
  const zIndex = total - index;

  return (
    <motion.div
      layout
      initial={{ y: 0, scale: 1 }}
      animate={{
        y: stackOffset,
        scale,
        zIndex,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute left-0 right-0"
      style={{ zIndex }}
    >
      <Link href={`/card/${card._id}`}>
        <div
          className="mx-4 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
          style={{ background: design.background, minHeight: '120px' }}
        >
          <CardPattern design={design} />

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold" style={{ color: design.textColor }}>
                {cardName}
              </h3>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: design.accentColor }}
              >
                <span className="text-lg font-bold" style={{ color: design.textColor }}>
                  {cardName[0].toUpperCase()}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <p
                className="text-lg font-mono tracking-wider"
                style={{ color: design.textColor, opacity: 0.85 }}
              >
                {formatCardNumber(card.cardNumber)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
