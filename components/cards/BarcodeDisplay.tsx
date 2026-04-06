'use client';

import { useEffect, useRef, useState } from 'react';
import { generateBarcode, formatCardNumber } from '@/lib/barcode';

interface BarcodeDisplayProps {
  value: string;
  format?: string;
  showNumber?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// CODE128 supports ASCII 0-127
function sanitizeForBarcode(value: string): string {
  return value.replace(/[^\x00-\x7F]/g, '');
}

export default function BarcodeDisplay({ value, format = 'CODE128', showNumber = true, size = 'md' }: BarcodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  const cleanValue = sanitizeForBarcode(value);

  useEffect(() => {
    setError(false);
    if (canvasRef.current && cleanValue) {
      try {
        generateBarcode(canvasRef.current, cleanValue, format);
      } catch {
        setError(true);
      }
    } else if (canvasRef.current && !cleanValue) {
      setError(true);
    }
  }, [cleanValue, format]);

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
        {error ? (
          <div className="flex items-center justify-center h-20 text-gray-400 text-sm text-center">
            Enter a valid card number<br />(letters and numbers only)
          </div>
        ) : (
          <canvas ref={canvasRef} className="w-full h-auto" />
        )}
      </div>
      {showNumber && (
        <p className={`${textSizes[size]} font-mono font-bold tracking-wider text-center`}>
          {formatCardNumber(value)}
        </p>
      )}
    </div>
  );
}
