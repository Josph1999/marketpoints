'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

interface CardScannerProps {
  onScan: (value: string) => void;
  onClose: () => void;
}

export default function CardScanner({ onScan, onClose }: CardScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let reader: BrowserMultiFormatReader | null = null;

    async function startScanning() {
      try {
        reader = new BrowserMultiFormatReader();

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsScanning(true);

          reader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
            if (result) {
              if ('vibrate' in navigator) {
                navigator.vibrate(100);
              }
              onScan(result.getText());
            }
            if (err && !(err instanceof NotFoundException)) {
              // Only log non-NotFoundException errors
            }
          });
        }
      } catch {
        setError('Camera access denied. Please allow camera access to scan barcodes.');
      }
    }

    startScanning();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (reader) {
        reader.reset();
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-12 right-6 z-50 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {error ? (
        <div className="flex flex-col items-center justify-center h-full px-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={onClose} className="text-white underline">
            Go back
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Scanner overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Darkened corners */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Clear scanning area */}
            <div className="relative w-72 h-48 z-10">
              <div className="absolute inset-0 bg-transparent" style={{
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
              }} />
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-white rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-white rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-white rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-white rounded-br-lg" />

              {/* Scanning line animation */}
              {isScanning && (
                <div className="absolute left-2 right-2 h-0.5 bg-white/80 animate-scan" />
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-24 left-0 right-0 text-center z-20">
            <p className="text-white text-lg font-medium">Point camera at barcode</p>
            <p className="text-gray-400 text-sm mt-1">მიუთითეთ კამერა შტრიხკოდისკენ</p>
          </div>
        </>
      )}
    </div>
  );
}
