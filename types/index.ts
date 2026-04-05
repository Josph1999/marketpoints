export const CARD_MAX_NAME_LENGTH = 30;

export interface CardDesign {
  id: string;
  name: string;
  background: string;
  textColor: string;
  accentColor: string;
  pattern: 'waves' | 'circles' | 'dots' | 'mesh' | 'aurora' | 'geo' | 'stripe' | 'none';
}

export const CARD_DESIGNS: readonly CardDesign[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%)',
    textColor: '#e0d7ff',
    accentColor: 'rgba(139,92,246,0.3)',
    pattern: 'aurora',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    background: 'linear-gradient(135deg, #0077b6 0%, #00b4d8 50%, #90e0ef 100%)',
    textColor: '#ffffff',
    accentColor: 'rgba(255,255,255,0.15)',
    pattern: 'waves',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    background: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 50%, #ffd166 100%)',
    textColor: '#ffffff',
    accentColor: 'rgba(255,255,255,0.12)',
    pattern: 'circles',
  },
  {
    id: 'forest',
    name: 'Forest',
    background: 'linear-gradient(160deg, #0b3d0b 0%, #1a7a1a 40%, #34d399 100%)',
    textColor: '#d1fae5',
    accentColor: 'rgba(255,255,255,0.1)',
    pattern: 'dots',
  },
  {
    id: 'neon',
    name: 'Neon',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a002e 40%, #3b0764 70%, #0a0a0a 100%)',
    textColor: '#e879f9',
    accentColor: 'rgba(232,121,249,0.2)',
    pattern: 'mesh',
  },
  {
    id: 'lava',
    name: 'Lava',
    background: 'linear-gradient(135deg, #1a0000 0%, #8b0000 30%, #ff4500 60%, #ff8c00 100%)',
    textColor: '#ffd6c0',
    accentColor: 'rgba(255,140,0,0.2)',
    pattern: 'geo',
  },
  {
    id: 'arctic',
    name: 'Arctic',
    background: 'linear-gradient(160deg, #e0f2fe 0%, #7dd3fc 30%, #0284c7 70%, #0c4a6e 100%)',
    textColor: '#0c4a6e',
    accentColor: 'rgba(12,74,110,0.1)',
    pattern: 'dots',
  },
  {
    id: 'gold',
    name: 'Gold',
    background: 'linear-gradient(135deg, #462523 0%, #8b6914 25%, #daa520 50%, #f5d442 75%, #8b6914 100%)',
    textColor: '#fff8e1',
    accentColor: 'rgba(255,248,225,0.15)',
    pattern: 'stripe',
  },
  {
    id: 'rose',
    name: 'Rose',
    background: 'linear-gradient(135deg, #4a0020 0%, #9f1239 40%, #fb7185 80%, #fecdd3 100%)',
    textColor: '#fff1f2',
    accentColor: 'rgba(255,255,255,0.1)',
    pattern: 'circles',
  },
  {
    id: 'cyber',
    name: 'Cyber',
    background: 'linear-gradient(135deg, #000000 0%, #003300 30%, #00ff41 60%, #00ff41 61%, #001a00 100%)',
    textColor: '#00ff41',
    accentColor: 'rgba(0,255,65,0.08)',
    pattern: 'mesh',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    background: 'linear-gradient(160deg, #020617 0%, #0f172a 40%, #1e293b 100%)',
    textColor: '#94a3b8',
    accentColor: 'rgba(148,163,184,0.08)',
    pattern: 'none',
  },
  {
    id: 'candy',
    name: 'Candy',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 33%, #f97316 66%, #eab308 100%)',
    textColor: '#ffffff',
    accentColor: 'rgba(255,255,255,0.15)',
    pattern: 'waves',
  },
] as const;

export type CardDesignId = (typeof CARD_DESIGNS)[number]['id'];

export interface Card {
  _id: string;
  userId: string;
  cardNumber: string;
  name: string;
  designId: CardDesignId;
  createdAt: string;
}

export interface User {
  _id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface OTPRequest {
  phoneNumber: string;
}

export interface OTPVerify {
  phoneNumber: string;
  otp: string;
  firstName: string;
  lastName: string;
}

export interface CardCreate {
  cardNumber: string;
  name: string;
  designId: CardDesignId;
}

export interface CardUpdate {
  name?: string;
  cardNumber?: string;
  designId?: CardDesignId;
}

export function getCardDesign(designId: string): CardDesign {
  return (CARD_DESIGNS.find((d) => d.id === designId) || CARD_DESIGNS[0]) as CardDesign;
}
