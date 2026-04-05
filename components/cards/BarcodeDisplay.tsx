'use client';

import { useEffect, useRef } from 'react';
import { generateBarcode, formatCardNumber } from '@/lib/barcode';

interface BarcodeDisplayProps {
  value: string;
  format?: string;
  showNumber?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function BarcodeDisplay({ value, format = 'CODE128', showNumber = true, size = 'md' }: BarcodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      try {
        generateBarcode(canvasRef.current, value, format);
      } catch (e) {
        console.error('Barcode generation failed:', e);
      }
    }
  }, [value, format]);

  const sizeClasses = {
    sm: 'max-w-[200px]',
    md: 'max-w-[300px]',
    lg: 'max-w-[360px]',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizeClasses[size]} w-full bg-white rounded-xl p-4`}>
        <canvas ref={canvasRef} className="w-full h-auto" />
      </div>
      {showNumber && (
        <p className={`${textSizes[size]} font-mono font-bold tracking-wider text-center`}>
          {formatCardNumber(value)}
        </p>
      )}
    </div>
  );
}
