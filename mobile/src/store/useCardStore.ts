import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, User } from '../types';
import { api, apiAuth } from '../lib/api';

const STORAGE_CARDS = 'mp_cards';
const STORAGE_TOKEN = 'mp_token';
const STORAGE_USER = 'mp_user';

interface CardStore {
  cards: Card[];
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authLoaded: boolean;

  setAuth: (token: string, user: User) => void;
  logout: () => void;
  loadAuth: () => Promise<void>;

  setCards: (cards: Card[]) => void;
  addCard: (card: Card) => void;
  removeCard: (id: string) => void;
  reorderCards: (cards: Card[]) => void;

  fetchCards: () => Promise<void>;
  createCard: (data: { cardNumber: string; name: string; designId: string }) => Promise<Card | null>;
  deleteCard: (id: string) => Promise<boolean>;
}

async function saveCards(cards: Card[]) {
  await AsyncStorage.setItem(STORAGE_CARDS, JSON.stringify(cards));
}

async function loadCards(): Promise<Card[]> {
  const data = await AsyncStorage.getItem(STORAGE_CARDS);
  return data ? JSON.parse(data) : [];
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  token: null,
  user: null,
  isLoading: false,
  isAuthenticated: false,
  authLoaded: false,

  setAuth: async (token, user) => {
    await AsyncStorage.setItem(STORAGE_TOKEN, token);
    await AsyncStorage.setItem(STORAGE_USER, JSON.stringify(user));
    set({ token, user, isAuthenticated: true, authLoaded: true });
  },

  logout: async () => {
    await AsyncStorage.multiRemove([STORAGE_TOKEN, STORAGE_USER, STORAGE_CARDS]);
    set({ token: null, user: null, isAuthenticated: false, cards: [] });
  },

  loadAuth: async () => {
    try {
      const [token, userStr] = await AsyncStorage.multiGet([STORAGE_TOKEN, STORAGE_USER]);
      if (token[1] && userStr[1]) {
        const user = JSON.parse(userStr[1]) as User;
        set({ token: token[1], user, isAuthenticated: true, authLoaded: true });
      } else {
        set({ authLoaded: true });
      }
    } catch {
      set({ authLoaded: true });
    }
  },

  setCards: (cards) => {
    saveCards(cards);
    set({ cards });
  },

  addCard: (card) => {
    const cards = [...get().cards, card];
    saveCards(cards);
    set({ cards });
  },

  removeCard: (id) => {
    const cards = get().cards.filter((c) => c._id !== id);
    saveCards(cards);
    set({ cards });
  },

  reorderCards: (cards) => {
    saveCards(cards);
    set({ cards });
  },

  fetchCards: async () => {
    const { token } = get();
    if (!token) return;
    set({ isLoading: true });
    try {
      const res = await apiAuth('/api/cards', token);
      if (res.ok) {
        const data = await res.json();
        await saveCards(data.cards);
        set({ cards: data.cards });
      }
    } catch {
      const cards = await loadCards();
      set({ cards });
    } finally {
      set({ isLoading: false });
    }
  },

  createCard: async (data) => {
    const { token } = get();
    const makeLocal = (): Card => ({
      _id: `local_${Date.now()}`,
      userId: 'local',
      cardNumber: data.cardNumber,
      name: data.name,
      designId: data.designId,
      createdAt: new Date().toISOString(),
    });

    if (!token) {
      const card = makeLocal();
      get().addCard(card);
      return card;
    }

    try {
      const res = await apiAuth('/api/cards', token, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const { card } = await res.json();
        get().addCard(card);
        return card;
      }
    } catch {
      // fall through
    }

    const card = makeLocal();
    get().addCard(card);
    return card;
  },

  deleteCard: async (id) => {
    const { token } = get();
    if (id.startsWith('local_') || !token) {
      get().removeCard(id);
      return true;
    }
    try {
      const res = await apiAuth(`/api/cards/${id}`, token, { method: 'DELETE' });
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
}));
