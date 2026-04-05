'use client';

import { CardDesign } from '@/types';

interface CardPatternProps {
  design: CardDesign;
}

export default function CardPattern({ design }: CardPatternProps) {
  const accent = design.accentColor;

  switch (design.pattern) {
    case 'waves':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 400 200">
          <path d="M0 80 Q100 40 200 80 T400 80 V200 H0Z" fill={accent} />
          <path d="M0 120 Q100 80 200 120 T400 120 V200 H0Z" fill={accent} />
          <path d="M0 150 Q100 120 200 150 T400 150 V200 H0Z" fill={accent} />
        </svg>
      );

    case 'circles':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 200">
          <circle cx="340" cy="30" r="80" fill="none" stroke={accent} strokeWidth="2" />
          <circle cx="340" cy="30" r="120" fill="none" stroke={accent} strokeWidth="1.5" />
          <circle cx="340" cy="30" r="160" fill="none" stroke={accent} strokeWidth="1" />
          <circle cx="60" cy="180" r="60" fill={accent} opacity="0.3" />
        </svg>
      );

    case 'dots':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 400 200">
          {Array.from({ length: 12 }).map((_, row) =>
            Array.from({ length: 20 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={col * 22 + 10}
                cy={row * 22 + 10}
                r="1.5"
                fill={design.textColor}
              />
            ))
          )}
        </svg>
      );

    case 'mesh':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 200">
          <defs>
            <pattern id="mesh" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 L40 20 M20 0 L20 40" stroke={design.textColor} strokeWidth="0.5" fill="none" />
              <circle cx="20" cy="20" r="2" fill={design.textColor} opacity="0.5" />
            </pattern>
          </defs>
          <rect width="400" height="200" fill="url(#mesh)" />
          <circle cx="300" cy="50" r="60" fill={accent} />
          <circle cx="100" cy="160" r="40" fill={accent} />
        </svg>
      );

    case 'aurora':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 200">
          <defs>
            <radialGradient id="g1" cx="30%" cy="40%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="g2" cx="70%" cy="60%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="g3" cx="80%" cy="20%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="400" height="200" fill="url(#g1)" />
          <rect width="400" height="200" fill="url(#g2)" />
          <rect width="400" height="200" fill="url(#g3)" />
        </svg>
      );

    case 'geo':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 400 200">
          <polygon points="350,0 400,0 400,80" fill={design.textColor} opacity="0.3" />
          <polygon points="300,0 380,0 400,50 350,80" fill={design.textColor} opacity="0.15" />
          <polygon points="0,200 80,120 160,200" fill={design.textColor} opacity="0.2" />
          <polygon points="50,200 130,140 200,180 180,200" fill={design.textColor} opacity="0.1" />
          <line x1="0" y1="100" x2="400" y2="100" stroke={design.textColor} strokeWidth="0.3" opacity="0.3" />
        </svg>
      );

    case 'stripe':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 200">
          {Array.from({ length: 15 }).map((_, i) => (
            <line
              key={i}
              x1={i * 30 - 20}
              y1="0"
              x2={i * 30 + 100}
              y2="200"
              stroke={design.textColor}
              strokeWidth="1"
            />
          ))}
        </svg>
      );

    case 'none':
    default:
      return null;
  }
}
