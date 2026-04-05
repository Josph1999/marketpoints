'use client';

import { create } from 'zustand';
import { Card, CardDesignId } from '@/types';

const STORAGE_KEY = 'marketpoints_cards';
const TOKEN_KEY = 'marketpoints_token';
const USER_KEY = 'marketpoints_user';

interface UserInfo {
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

interface CardStore {
  cards: Card[];
  token: string | null;
  user: UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authLoaded: boolean;

  // Auth
  setAuth: (token: string, user: UserInfo) => void;
  logout: () => void;
  loadAuth: () => void;

  // Cards
  setCards: (cards: Card[]) => void;
  addCard: (card: Card) => void;
  updateCard: (id: string, updates: Partial<Card>) => void;
  removeCard: (id: string) => void;
  reorderCards: (cards: Card[]) => void;
  loadCardsFromStorage: () => void;

  // API
  fetchCards: () => Promise<void>;
  createCard: (data: { cardNumber: string; name: string; designId: CardDesignId }) => Promise<Card | null>;
  deleteCard: (id: string) => Promise<boolean>;

  setLoading: (loading: boolean) => void;
}

function saveCardsLocally(cards: Card[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }
}

function loadCardsLocally(): Card[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  token: null,
  user: null,
  isLoading: false,
  isAuthenticated: false,
  authLoaded: false,

  setAuth: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    set({ token, user, isAuthenticated: true, authLoaded: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(STORAGE_KEY);
    }
    set({ token: null, user: null, isAuthenticated: false, cards: [] });
  },

  loadAuth: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as UserInfo;
        set({ token, user, isAuthenticated: true, authLoaded: true });
      } catch {
        set({ authLoaded: true });
      }
    } else {
      set({ authLoaded: true });
    }
  },

  setCards: (cards) => {
    saveCardsLocally(cards);
    set({ cards });
  },

  addCard: (card) => {
    const cards = [...get().cards, card];
    saveCardsLocally(cards);
    set({ cards });
  },

  updateCard: (id, updates) => {
    const cards = get().cards.map((c) => (c._id === id ? { ...c, ...updates } : c));
    saveCardsLocally(cards);
    set({ cards });
  },

  removeCard: (id) => {
    const cards = get().cards.filter((c) => c._id !== id);
    saveCardsLocally(cards);
    set({ cards });
  },

  reorderCards: (cards) => {
    saveCardsLocally(cards);
    set({ cards });
  },

  loadCardsFromStorage: () => {
    const cards = loadCardsLocally();
    set({ cards });
  },

  fetchCards: async () => {
    const { token } = get();
    if (!token) return;
    set({ isLoading: true });
    try {
      const res = await fetch('/api/cards', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        saveCardsLocally(data.cards);
        set({ cards: data.cards });
      }
    } catch {
      set({ cards: loadCardsLocally() });
    } finally {
      set({ isLoading: false });
    }
  },

  createCard: async (data) => {
    const { token } = get();
    const makeLocalCard = (): Card => ({
      _id: `local_${Date.now()}`,
      userId: 'local',
      cardNumber: data.cardNumber,
      name: data.name,
      designId: data.designId,
      createdAt: new Date().toISOString(),
    });

    if (!token) {
      const localCard = makeLocalCard();
      get().addCard(localCard);
      return localCard;
    }

    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const { card } = await res.json();
        get().addCard(card);
        return card;
      }
    } catch {
      // Network error — fall through
    }

    // API failed or returned error — save locally
    const localCard = makeLocalCard();
    get().addCard(localCard);
    return localCard;
  },

  deleteCard: async (id) => {
    const { token } = get();
    if (id.startsWith('local_') || !token) {
      get().removeCard(id);
      return true;
    }
    try {
      const res = await fetch(`/api/cards/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        get().removeCard(id);
        return true;
      }
    } catch {
      get().removeCard(id);
      return true;
    }
    return false;
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
