export const CARD_MAX_NAME_LENGTH = 30;

export interface CardDesign {
  id: string;
  name: string;
  colors: [string, string, string];
  textColor: string;
  accentColor: string;
}

export const CARD_DESIGNS: CardDesign[] = [
  { id: 'aurora', name: 'Aurora', colors: ['#0f0c29', '#302b63', '#24243e'], textColor: '#e0d7ff', accentColor: 'rgba(139,92,246,0.3)' },
  { id: 'ocean', name: 'Ocean', colors: ['#0077b6', '#00b4d8', '#90e0ef'], textColor: '#ffffff', accentColor: 'rgba(255,255,255,0.15)' },
  { id: 'sunset', name: 'Sunset', colors: ['#ee0979', '#ff6a00', '#ffd166'], textColor: '#ffffff', accentColor: 'rgba(255,255,255,0.12)' },
  { id: 'forest', name: 'Forest', colors: ['#0b3d0b', '#1a7a1a', '#34d399'], textColor: '#d1fae5', accentColor: 'rgba(255,255,255,0.1)' },
  { id: 'neon', name: 'Neon', colors: ['#0a0a0a', '#3b0764', '#0a0a0a'], textColor: '#e879f9', accentColor: 'rgba(232,121,249,0.2)' },
  { id: 'lava', name: 'Lava', colors: ['#1a0000', '#8b0000', '#ff4500'], textColor: '#ffd6c0', accentColor: 'rgba(255,140,0,0.2)' },
  { id: 'arctic', name: 'Arctic', colors: ['#e0f2fe', '#7dd3fc', '#0c4a6e'], textColor: '#0c4a6e', accentColor: 'rgba(12,74,110,0.1)' },
  { id: 'gold', name: 'Gold', colors: ['#462523', '#daa520', '#8b6914'], textColor: '#fff8e1', accentColor: 'rgba(255,248,225,0.15)' },
  { id: 'rose', name: 'Rose', colors: ['#4a0020', '#9f1239', '#fecdd3'], textColor: '#fff1f2', accentColor: 'rgba(255,255,255,0.1)' },
  { id: 'cyber', name: 'Cyber', colors: ['#000000', '#003300', '#001a00'], textColor: '#00ff41', accentColor: 'rgba(0,255,65,0.08)' },
  { id: 'midnight', name: 'Midnight', colors: ['#020617', '#0f172a', '#1e293b'], textColor: '#94a3b8', accentColor: 'rgba(148,163,184,0.08)' },
  { id: 'candy', name: 'Candy', colors: ['#a855f7', '#ec4899', '#eab308'], textColor: '#ffffff', accentColor: 'rgba(255,255,255,0.15)' },
];

export interface Card {
  _id: string;
  userId: string;
  cardNumber: string;
  name: string;
  designId: string;
  createdAt: string;
}

export interface User {
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export function getCardDesign(designId: string): CardDesign {
  return CARD_DESIGNS.find((d) => d.id === designId) || CARD_DESIGNS[0];
}
